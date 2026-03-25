'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'
import { Configuration, configDimUnit } from '@blueprint3d/core/configuration'

// Import from main project's IndexedDB
const loadBedSizeFromDB = async () => {
  try {
    const { blueprintTemplateDB } = await import('@blueprint3d/indexdb/blueprint-template')
    const bedSize = await blueprintTemplateDB.getBedSize()
    return bedSize
  } catch (error) {
    console.error('Failed to load bed size from IndexedDB:', error)
    return null
  }
}

interface BedSizeInputProps {
  onSizeChange: (width: number, length: number) => void
  defaultWidth?: number
  defaultLength?: number
}

export function BedSizeInput({
  onSizeChange,
  defaultWidth = 150,
  defaultLength = 200
}: BedSizeInputProps) {
  const t = useTranslations('BluePrint.bedSizeInput')

  // Store the actual values in cm (internal representation)
  const [widthCm, setWidthCm] = useState(defaultWidth)
  const [lengthCm, setLengthCm] = useState(defaultLength)
  const [isInitialized, setIsInitialized] = useState(false)

  // Display values in current unit
  const [width, setWidth] = useState(0)
  const [length, setLength] = useState(0)
  const [currentUnit, setCurrentUnit] = useState('inch')

  // Convert cm to display unit
  const cmToDisplay = (cm: number, unit: string): number => {
    switch (unit) {
      case 'inch':
        return cm / 2.54
      case 'm':
        return cm / 100
      case 'cm':
        return cm
      case 'mm':
        return cm * 10
      default:
        return cm / 2.54
    }
  }

  // Convert display unit to cm
  const displayToCm = (value: number, unit: string): number => {
    switch (unit) {
      case 'inch':
        return value * 2.54
      case 'm':
        return value * 100
      case 'cm':
        return value
      case 'mm':
        return value / 10
      default:
        return value * 2.54
    }
  }

  // Get unit label
  const getUnitLabel = (unit: string): string => {
    switch (unit) {
      case 'inch':
        return t('units.inches')
      case 'm':
        return t('units.meters')
      case 'cm':
        return t('units.centimeters')
      case 'mm':
        return t('units.millimeters')
      default:
        return t('units.inches')
    }
  }

  // Get decimal places for unit
  const getDecimalPlaces = (unit: string): number => {
    switch (unit) {
      case 'inch':
        return 0
      case 'm':
        return 2
      case 'cm':
        return 1
      case 'mm':
        return 0
      default:
        return 0
    }
  }

  // Load bed size from IndexedDB on mount
  useEffect(() => {
    const loadSavedBedSize = async () => {
      const savedBedSize = await loadBedSizeFromDB()
      if (savedBedSize && savedBedSize.width > 0 && savedBedSize.length > 0) {
        setWidthCm(savedBedSize.width)
        setLengthCm(savedBedSize.length)
        // Notify parent component
        onSizeChange(savedBedSize.width, savedBedSize.length)
      }
      setIsInitialized(true)
    }
    loadSavedBedSize()
  }, []) // Run only on mount

  // Initialize and listen to unit changes
  useEffect(() => {
    if (!isInitialized) return // Wait for IndexedDB load

    // Get current unit from Configuration
    const unit = Configuration.getStringValue(configDimUnit)
    setCurrentUnit(unit)

    // Update display values based on current cm values and new unit
    const decimals = getDecimalPlaces(unit)
    setWidth(Number(cmToDisplay(widthCm, unit).toFixed(decimals)))
    setLength(Number(cmToDisplay(lengthCm, unit).toFixed(decimals)))

    // Listen to localStorage changes (when unit changes in Settings)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dimensionUnit' && e.newValue) {
        const newUnit = e.newValue
        setCurrentUnit(newUnit)
        const newDecimals = getDecimalPlaces(newUnit)
        setWidth(Number(cmToDisplay(widthCm, newUnit).toFixed(newDecimals)))
        setLength(Number(cmToDisplay(lengthCm, newUnit).toFixed(newDecimals)))
      }
    }

    // Also listen to custom event for same-window changes
    const handleUnitChange = ((e: CustomEvent) => {
      const newUnit = e.detail.unit
      setCurrentUnit(newUnit)
      const newDecimals = getDecimalPlaces(newUnit)
      setWidth(Number(cmToDisplay(widthCm, newUnit).toFixed(newDecimals)))
      setLength(Number(cmToDisplay(lengthCm, newUnit).toFixed(newDecimals)))
    }) as EventListener

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('dimensionUnitChanged', handleUnitChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('dimensionUnitChanged', handleUnitChange)
    }
  }, [widthCm, lengthCm, isInitialized])

  const handleSizeChange = (field: 'width' | 'length', value: number) => {
    // Update display value
    if (field === 'width') {
      setWidth(value)
      const newWidthCm = displayToCm(value, currentUnit)
      setWidthCm(newWidthCm)
      // Notify parent with cm values
      onSizeChange(newWidthCm, lengthCm)
    } else {
      setLength(value)
      const newLengthCm = displayToCm(value, currentUnit)
      setLengthCm(newLengthCm)
      // Notify parent with cm values
      onSizeChange(widthCm, newLengthCm)
    }
  }

  // Get min/max values based on current unit
  const getMinMax = (minCm: number, maxCm: number) => {
    const decimals = getDecimalPlaces(currentUnit)
    return {
      min: Number(cmToDisplay(minCm, currentUnit).toFixed(decimals)),
      max: Number(cmToDisplay(maxCm, currentUnit).toFixed(decimals)),
      step: currentUnit === 'm' ? 0.01 : currentUnit === 'cm' ? 1 : 0.1
    }
  }

  const widthMinMax = getMinMax(80, 300) // Width: 80cm - 300cm
  const lengthMinMax = getMinMax(150, 300) // Length: 150cm - 300cm

  return (
    <div className="mx-5 mb-4">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg shadow-sm">
        <div className="bg-primary/90 px-4 py-3 border-b border-primary/30 rounded-t-lg">
          <h3 className="font-semibold text-primary-foreground flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
            {t('bedDimensions')}
          </h3>
        </div>
        <div className="p-5 bg-card/50 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="w-20 text-sm font-medium text-foreground">{t('width')}</label>
              <Input
                type="number"
                value={width}
                onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                min={widthMinMax.min}
                max={widthMinMax.max}
                step={widthMinMax.step}
                className="font-mono font-semibold"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="w-20 text-sm font-medium text-foreground">{t('length')}</label>
              <Input
                type="number"
                value={length}
                onChange={(e) => handleSizeChange('length', Number(e.target.value))}
                min={lengthMinMax.min}
                max={lengthMinMax.max}
                step={lengthMinMax.step}
                className="font-mono font-semibold"
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/50">
            <small className="text-muted-foreground text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t('measurementsIn')} {getUnitLabel(currentUnit)}
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

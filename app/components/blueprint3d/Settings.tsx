'use client'

import { useState, useEffect, useTransition } from 'react'
import { Settings as SettingsIcon, Languages, Check } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Language display names map
type LanguageMap = Record<string, string>

interface SettingsProps {
  onUnitChange?: (unit: string) => void
  languageMap?: LanguageMap // Optional language display names map
  isLanguageOption?: boolean
}

export function Settings({ onUnitChange, languageMap = {}, isLanguageOption }: SettingsProps) {
  const t = useTranslations('BluePrint.settings')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [selectedUnit, setSelectedUnit] = useState('inch')
  const [selectedLanguage, setSelectedLanguage] = useState(locale)

  const locales = ['en', 'zh', 'tw'] as const

  // Load saved unit from localStorage on mount
  useEffect(() => {
    const savedUnit = localStorage.getItem('dimensionUnit')
    if (savedUnit) {
      setSelectedUnit(savedUnit)
    }
  }, [])

  const handleUnitChange = (unit: string) => {
    setSelectedUnit(unit)
    // Save to localStorage
    localStorage.setItem('dimensionUnit', unit)
    // Notify parent component
    onUnitChange?.(unit)
    // Dispatch custom event for same-window listeners (like BedSizeInput)
    window.dispatchEvent(new CustomEvent('dimensionUnitChanged', { detail: { unit } }))
  }

  const handleLanguageChange = (newLocale: string) => {
    setSelectedLanguage(newLocale)
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as any })
    })
  }

  const units = [
    { value: 'inch', label: t('units.inch.label'), description: t('units.inch.description') },
    { value: 'm', label: t('units.m.label'), description: t('units.m.description') },
    { value: 'cm', label: t('units.cm.label'), description: t('units.cm.description') },
    { value: 'mm', label: t('units.mm.label'), description: t('units.mm.description') }
  ]

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-8">
      <div className="flex items-center gap-3 text-foreground mb-6">
        <SettingsIcon className="h-7 w-7" />
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <div className="space-y-8">
        {/* Language Settings */}
        {isLanguageOption && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">{t('language')}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t('languageDescription')}</p>

            <RadioGroup
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
              disabled={isPending}
            >
              <div className="space-y-3">
                {locales.map((lang) => (
                  <Label
                    key={lang}
                    htmlFor={`language-${lang}`}
                    className={cn(
                      'flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-accent transition-all',
                      selectedLanguage === lang
                        ? 'border-primary bg-primary-50'
                        : 'border-border bg-card'
                    )}
                  >
                    <RadioGroupItem value={lang} id={`language-${lang}`} className="mt-1.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-base text-foreground">
                        {t(`languages.${lang}`)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {languageMap[lang] || lang}
                      </div>
                    </div>
                    {selectedLanguage === lang && (
                      <div className="text-primary font-medium text-sm mt-1.5 flex items-center gap-1">
                        <Check className="h-4 w-4" /> {t('active')}
                      </div>
                    )}
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Dimension Unit Settings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">{t('dimensionUnit')}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t('dimensionUnitDescription')}</p>
        </div>

        <RadioGroup value={selectedUnit} onValueChange={handleUnitChange}>
          <div className="space-y-3">
            {units.map((unit) => (
              <Label
                key={unit.value}
                htmlFor={`unit-${unit.value}`}
                className={cn(
                  'flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-accent transition-all',
                  selectedUnit === unit.value
                    ? 'border-primary bg-primary-50'
                    : 'border-border bg-card'
                )}
              >
                <RadioGroupItem value={unit.value} id={`unit-${unit.value}`} className="mt-1.5" />
                <div className="flex-1">
                  <div className="font-semibold text-base text-foreground">{unit.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{unit.description}</div>
                </div>
                {selectedUnit === unit.value && (
                  <div className="text-primary font-medium text-sm mt-1.5 flex items-center gap-1">
                    <Check className="h-4 w-4" /> {t('active')}
                  </div>
                )}
              </Label>
            ))}
          </div>
        </RadioGroup>

        <div className="mt-6 p-4 bg-primary-50 border-l-4 border-primary rounded">
          <p className="text-sm text-foreground">
            <strong>{t('currentSelection')}:</strong>{' '}
            {units.find((u) => u.value === selectedUnit)?.label}
          </p>
          <p className="text-sm text-muted-foreground mt-2">{t('appliesTo')}</p>
          <ul className="text-sm text-muted-foreground mt-1 ml-4 list-disc">
            <li>{t('applies2dFloorplan')}</li>
            <li>{t('applies3dDimensions')}</li>
            <li>{t('appliesAllDimensions')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

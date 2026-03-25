'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { RoomType } from '@blueprint3d/types/room_types'
import { TemplateOption, getTemplatesByRoomType } from "@/lib/blueprint-templates"
import {
  Blueprint3DTemplate,
  blueprintTemplateDB
} from '@blueprint3d/indexdb/blueprint-template'
import { TemplateCard } from './TemplateCard'
import {
  Loader2,
  AlertCircle,
  Bed,
  Sofa,
  UtensilsCrossed,
  Bath,
  Briefcase,
  Plus,
  FolderOpen
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import blank from "@/config/templates/blank.json"

interface TemplateSelectorProps {
  targetUrl: string
  title?: string
  subtitle?: string
  initialRoomType?: RoomType
}

export function TemplateSelector({
  targetUrl,
  title = 'Choose Your Starting Point',
  subtitle = 'Select a template to begin designing your space',
  initialRoomType = RoomType.BEDROOM
}: TemplateSelectorProps) {
  const router = useRouter()
  const t = useTranslations('BluePrint.Component.FloorPlanDesign.TemplateSelector')
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>(initialRoomType)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // All room types
  const roomTypes = Object.values(RoomType).filter((type) => type !== RoomType.KITCHEN)

  // Room type icon mapping
  const ROOM_TYPE_ICONS: Record<RoomType, React.ComponentType<{ className?: string }>> = {
    [RoomType.BEDROOM]: Bed,
    [RoomType.LIVING_ROOM]: Sofa,
    [RoomType.KITCHEN]: UtensilsCrossed,
    [RoomType.BATHROOM]: Bath,
    [RoomType.OFFICE]: Briefcase
  }

  const handleTemplateClick = async (template: TemplateOption, roomType: RoomType) => {
    setLoading(true)
    setSelectedId(template.id)
    setError(null)

    try {
      // Special handling for "Open My Design"
      if (template.id === 'open-my-design') {
        // Navigate with query parameter to open history (mode is the roomType)
        const url = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'
          }openMyFloorplans=true&mode=${roomType}`
        router.push(url)
        return
      }

      // Save template to IndexedDB
      if (template.template) {
        await blueprintTemplateDB.saveTemplate(template.template)
      } else {
        // Clear template for blank canvas
        await blueprintTemplateDB.clearTemplate()
      }

      // Navigate to target URL with mode parameter (mode is the roomType)
      const url = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}mode=${roomType}`
      router.push(url)
    } catch (error) {
      console.error('Failed to save template:', error)
      setError(t('loadError'))
      setLoading(false)
      setSelectedId(null)
    }
  }

  const handleStartFresh = async (roomType: RoomType) => {
    const blankTemplate: TemplateOption = {
      id: `blank-${roomType}`,
      name: 'Start Fresh',
      description: 'Start from scratch with an empty room',
      preview: '/templates/refresh/blank.webp',
      roomType,
      template: blank as Blueprint3DTemplate
    }
    await handleTemplateClick(blankTemplate, roomType)
  }

  const handleOpenDesign = async (roomType: RoomType) => {
    const blankTemplate: TemplateOption = {
      id: 'open-my-design',
      name: 'Open My Design',
      description: 'Browse and open your saved floor plans',
      preview: '/templates/refresh/history.webp',
      roomType,
      template: blank as Blueprint3DTemplate
    }
    await handleTemplateClick(blankTemplate, roomType)
  }

  return (
    <div className="h-full bg-gradient-to-br from-primary-50 via-background to-background">
      <div
        ref={scrollContainerRef}
        className="h-full flex flex-col items-center justify-center overflow-y-auto"
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <p className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3 tracking-wider">
              {title}
            </p>
            <span className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 mx-auto max-w-md rounded-lg border border-destructive bg-destructive/10 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* Room Type Tabs */}
          <Tabs
            value={selectedRoomType}
            onValueChange={(value) => setSelectedRoomType(value as RoomType)}
          >
            {/* Tab Headers */}
            <TabsList className="w-full grid grid-cols-4 mb-8 h-auto p-1">
              {roomTypes.map((roomType) => {
                const Icon = ROOM_TYPE_ICONS[roomType]
                return (
                  <TabsTrigger
                    key={roomType}
                    value={roomType}
                    className="text-sm px-3 py-2.5 gap-2 flex items-center justify-center data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{t(`roomTypes.${roomType}`)}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {/* Tab Contents */}
            {roomTypes.map((roomType) => {
              const templates = getTemplatesByRoomType(roomType)

              return (
                <TabsContent key={roomType} value={roomType} className="space-y-6">
                  {/* Template Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Start Fresh Card */}
                    <div className="relative h-full">
                      <button
                        onClick={() => handleStartFresh(roomType)}
                        disabled={loading}
                        className="w-full h-full border-2 border-dashed border-primary/50 rounded-lg hover:border-primary transition-colors p-6 flex flex-col items-center justify-center gap-4 cursor-pointer bg-card group aspect-square"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Plus className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground mb-1">{t('startFresh')}</p>
                          <p className="text-sm text-muted-foreground px-2">
                            {t('startFreshDescription', {
                              roomType: t(`roomTypesLowercase.${roomType}`)
                            })}
                          </p>
                        </div>
                      </button>

                      {/* Loading overlay for Start Fresh */}
                      {loading && selectedId === `blank-${roomType}` && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-medium text-foreground">
                              {t('loadingTemplate')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Open Design Card */}
                    <div className="relative h-full">
                      <button
                        onClick={() => handleOpenDesign(roomType)}
                        disabled={loading}
                        className="w-full h-full border-2 border-dashed border-primary/50 rounded-lg hover:border-primary transition-colors p-6 flex flex-col items-center justify-center gap-4 cursor-pointer bg-card group aspect-square"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FolderOpen className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground mb-1">{t('openMyDesign')}</p>
                          <p className="text-sm text-muted-foreground px-2">
                            {t('openMyDesignDescription')}
                          </p>
                        </div>
                      </button>

                      {/* Loading overlay for Open Design */}
                      {loading && selectedId === 'open-my-design' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-medium text-foreground">
                              {t('loadingTemplate')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Template Cards */}
                    {templates.map((template) => (
                      <div key={template.id} className="relative h-full">
                        <TemplateCard
                          template={template}
                          onClick={(t) => handleTemplateClick(t, roomType)}
                        />

                        {/* Loading overlay */}
                        {loading && selectedId === template.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                            <div className="flex flex-col items-center gap-3">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              <p className="text-sm font-medium text-foreground">
                                {t('loadingTemplate')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>

          {/* Footer hint */}
          <div className="mt-8 md:mt-12 text-center pb-8">
            <p className="text-sm text-muted-foreground">{t('customizeHint')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

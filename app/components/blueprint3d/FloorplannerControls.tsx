'use client'

import { Move, Pencil, Trash2, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'
import { useIsMobile } from "@/hooks/use-media-query"

interface FloorplannerControlsProps {
  mode: 'move' | 'draw' | 'delete'
  onModeChange: (mode: 'move' | 'draw' | 'delete') => void
  onDone: () => void
}

export function FloorplannerControls({ mode, onModeChange, onDone }: FloorplannerControlsProps) {
  const t = useTranslations('BluePrint.floorplanner')
  const isMobile = useIsMobile()

  return (
    <div className={cn('absolute left-0 top-0 w-full z-[60] pointer-events-none', isMobile ? 'my-3 px-3' : 'my-3 px-5')}>
      <div className="flex items-center justify-between gap-2">
        <div className={cn('flex pointer-events-auto', isMobile ? 'gap-1.5' : 'gap-2')}>
          <Button
            size={isMobile ? 'icon' : 'sm'}
            variant={mode === 'move' ? 'default' : 'secondary'}
            onClick={() => onModeChange('move')}
            className={cn(
              !isMobile && 'flex items-center gap-2',
              // Mobile: 44x44px touch target with better visual feedback
              isMobile && 'h-11 w-11 shadow-lg active:scale-95 transition-transform'
            )}
            title={isMobile ? t('moveWalls') : undefined}
            aria-label={t('moveWalls')}
            aria-pressed={mode === 'move'}
          >
            <Move className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
            {!isMobile && t('moveWalls')}
          </Button>
          <Button
            size={isMobile ? 'icon' : 'sm'}
            variant={mode === 'draw' ? 'default' : 'secondary'}
            onClick={() => onModeChange('draw')}
            className={cn(
              !isMobile && 'flex items-center gap-2',
              isMobile && 'h-11 w-11 shadow-lg active:scale-95 transition-transform'
            )}
            title={isMobile ? t('drawWalls') : undefined}
            aria-label={t('drawWalls')}
            aria-pressed={mode === 'draw'}
          >
            <Pencil className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
            {!isMobile && t('drawWalls')}
          </Button>
          <Button
            size={isMobile ? 'icon' : 'sm'}
            variant={mode === 'delete' ? 'default' : 'secondary'}
            onClick={() => onModeChange('delete')}
            className={cn(
              !isMobile && 'flex items-center gap-2',
              isMobile && 'h-11 w-11 shadow-lg active:scale-95 transition-transform'
            )}
            title={isMobile ? t('deleteWalls') : undefined}
            aria-label={t('deleteWalls')}
            aria-pressed={mode === 'delete'}
          >
            <Trash2 className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
            {!isMobile && t('deleteWalls')}
          </Button>
        </div>

        <Button
          size={isMobile ? 'sm' : 'sm'}
          variant="default"
          onClick={onDone}
          className={cn(
            'font-medium pointer-events-auto',
            isMobile && 'shadow-lg min-h-[44px] active:scale-95 transition-transform px-4'
          )}
          aria-label={t('done')}
        >
          {isMobile ? (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              <span className="font-medium">{t('done')}</span>
            </>
          ) : (
            <>{t('done')} &raquo;</>
          )}
        </Button>
      </div>
    </div>
  )
}

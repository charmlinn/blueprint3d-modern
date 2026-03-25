'use client'

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-media-query"
import { Maximize, Minimize } from 'lucide-react'

interface ViewToggleProps {
  viewMode: '2d' | '3d'
  onViewChange: (mode: '2d' | '3d') => void
  isFullscreen?: boolean
  onFullscreenToggle?: () => void
}

export function ViewToggle({
  viewMode,
  onViewChange,
  isFullscreen = false,
  onFullscreenToggle
}: ViewToggleProps) {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        'absolute flex bg-card border border-border shadow-lg',
        // Mobile: larger buttons, better spacing, rounded corners
        isMobile
          ? 'top-3 right-3 gap-0.5 rounded-lg'
          : 'top-5 right-5 gap-1 rounded overflow-hidden shadow-md'
      )}
    >
      <button
        onClick={() => onViewChange('3d')}
        className={cn(
          'transition-all font-medium',
          // Mobile: 44x44px minimum touch target (WCAG 2.1)
          isMobile
            ? 'min-w-[44px] min-h-[44px] px-3 py-2 text-sm rounded-l-lg'
            : 'px-3 py-1.5 text-sm',
          viewMode === '3d'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'bg-card text-foreground hover:bg-accent active:scale-95'
        )}
        aria-label="3D View"
        aria-pressed={viewMode === '3d'}
      >
        3D
      </button>
      <button
        onClick={() => onViewChange('2d')}
        className={cn(
          'transition-all font-medium',
          isMobile
            ? 'min-w-[44px] min-h-[44px] px-3 py-2 text-sm'
            : 'px-3 py-1.5 text-sm',
          viewMode === '2d'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'bg-card text-foreground hover:bg-accent active:scale-95',
          // Add right radius only if no fullscreen button
          !onFullscreenToggle && isMobile && 'rounded-r-lg'
        )}
        aria-label="2D View"
        aria-pressed={viewMode === '2d'}
      >
        2D
      </button>
      {onFullscreenToggle && (
        <>
          <div className={cn('bg-border', isMobile ? 'w-0.5' : 'w-px')} />
          <button
            onClick={onFullscreenToggle}
            className={cn(
              'transition-all bg-card text-foreground hover:bg-accent active:scale-95 flex items-center justify-center',
              isMobile
                ? 'min-w-[44px] min-h-[44px] px-3 py-2 rounded-r-lg'
                : 'px-2.5 py-1.5'
            )}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className={isMobile ? 'h-4 w-4' : 'h-4 w-4'} />
            ) : (
              <Maximize className={isMobile ? 'h-4 w-4' : 'h-4 w-4'} />
            )}
          </button>
        </>
      )}
    </div>
  )
}

'use client'

import { ZoomIn, ZoomOut, Home, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface CameraControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function CameraControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onMoveLeft,
  onMoveRight,
  onMoveUp,
  onMoveDown
}: CameraControlsProps) {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        'absolute flex items-end',
        // Mobile: Bottom center with smaller buttons
        isMobile ? 'bottom-3 left-1/2 -translate-x-1/2 gap-2' : 'bottom-5 right-0 pr-5 gap-3'
      )}
    >
      {/* Zoom Controls */}
      <div className={cn('flex items-end', isMobile ? 'gap-0.5' : 'gap-1')}>
        <Button
          size={isMobile ? 'icon' : 'sm'}
          onClick={onZoomOut}
          className={cn(isMobile && 'h-9 w-9 shadow-md')}
        >
          <ZoomOut className={cn(isMobile ? 'h-4 w-4' : 'h-4 w-4')} />
        </Button>
        <Button
          size={isMobile ? 'icon' : 'sm'}
          onClick={onResetView}
          className={cn(isMobile && 'h-9 w-9 shadow-md')}
        >
          <Home className={cn(isMobile ? 'h-4 w-4' : 'h-4 w-4')} />
        </Button>
        <Button
          size={isMobile ? 'icon' : 'sm'}
          onClick={onZoomIn}
          className={cn(isMobile && 'h-9 w-9 shadow-md')}
        >
          <ZoomIn className={cn(isMobile ? 'h-4 w-4' : 'h-4 w-4')} />
        </Button>
      </div>

      {/* Pan Controls */}
      <div className={cn('flex items-end', isMobile ? 'gap-0.5' : 'gap-1')}>
        <Button
          size={isMobile ? 'icon' : 'sm'}
          onClick={onMoveLeft}
          className={cn(isMobile && 'h-9 w-9 shadow-md')}
        >
          <ArrowLeft className={cn(isMobile ? 'h-4 w-4' : 'h-4 w-4')} />
        </Button>
        <div className={cn('flex flex-col', isMobile ? 'gap-0.5' : 'gap-1')}>
          <Button
            size={isMobile ? 'icon' : 'sm'}
            onClick={onMoveUp}
            className={cn('rounded-b-none', isMobile && 'h-9 w-9 shadow-md')}
          >
            <ArrowUp className={cn(isMobile ? 'h-4 w-4' : 'h-4 w-4')} />
          </Button>
          <Button
            size={isMobile ? 'icon' : 'sm'}
            onClick={onMoveDown}
            className={cn('rounded-t-none', isMobile && 'h-9 w-9 shadow-md')}
          >
            <ArrowDown className={cn(isMobile ? 'h-4 w-4' : 'h-4 w-4')} />
          </Button>
        </div>
        <Button
          size={isMobile ? 'icon' : 'sm'}
          onClick={onMoveRight}
          className={cn(isMobile && 'h-9 w-9 shadow-md')}
        >
          <ArrowRight className={cn(isMobile ? 'h-4 w-4' : 'h-4 w-4')} />
        </Button>
      </div>
    </div>
  )
}

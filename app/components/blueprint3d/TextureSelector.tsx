'use client'

import Image from 'next/image'
import { FLOOR_TEXTURES, WALL_TEXTURES } from '@blueprint3d/constants'
import { useTranslations } from 'next-intl'
import { useIsMobile } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface TextureSelectorProps {
  type: 'floor' | 'wall' | null
  onTextureSelect: (textureUrl: string, stretch: boolean, scale: number) => void
}

export function TextureSelector({ type, onTextureSelect }: TextureSelectorProps) {
  const t = useTranslations('BluePrint.textureSelector')
  const isMobile = useIsMobile()

  if (!type) return null

  const textures = type === 'floor' ? FLOOR_TEXTURES : WALL_TEXTURES

  return (
    <div className={cn(
      'bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg',
      isMobile ? 'p-4 max-w-[280px]' : 'p-3 max-w-[240px]'
    )}>
      {/* Compact header */}
      <h3 className={cn('font-semibold', isMobile ? 'text-base mb-3' : 'text-sm mb-2')}>
        {type === 'floor' ? t('adjustFloor') : t('adjustWall')}
      </h3>

      {/* Texture grid - compact 2 columns */}
      <div className={cn('grid grid-cols-2', isMobile ? 'gap-3' : 'gap-2')}>
        {textures.map((texture, index) => (
          <button
            key={index}
            onClick={() => onTextureSelect(texture.url, texture.stretch, texture.scale)}
            className={cn(
              'relative aspect-square border-2 border-border rounded-md hover:border-primary transition-all overflow-hidden active:scale-95',
              isMobile ? 'min-h-[60px]' : 'hover:scale-105'
            )}
          >
            <Image
              src={texture.thumbnail}
              alt={texture.name}
              fill
              sizes={isMobile ? '120px' : '100px'}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ITEMS, type ItemCategory } from '@blueprint3d/constants'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"

interface ItemsListProps {
  onItemSelect: (item: { name: string; key: string; model: string; type: string }) => void
}

const CATEGORY_KEYS = {
  all: 'all',
  bed: 'bed',
  drawer: 'drawer',
  wardrobe: 'wardrobe',
  light: 'light',
  storage: 'storage',
  table: 'table',
  chair: 'chair',
  sofa: 'sofa',
  armchair: 'armchair',
  stool: 'stool',
  door: 'door',
  window: 'window'
} as const

const CATEGORY_VALUES: Array<ItemCategory | 'all'> = [
  'all',
  'bed',
  'drawer',
  'wardrobe',
  'light',
  'storage',
  'table',
  'chair',
  'sofa',
  'armchair',
  'stool',
  'door',
  'window'
]

export function ItemsList({ onItemSelect }: ItemsListProps) {
  const t = useTranslations('BluePrint.items')

  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all')

  // Build categories with translated labels
  const categories = useMemo(() => {
    return CATEGORY_VALUES.map((value) => ({
      value,
      label: t(`categories.${CATEGORY_KEYS[value]}`)
    }))
  }, [t])

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    let items = ITEMS

    // Apply category filter
    if (selectedCategory !== 'all') {
      items = items.filter((item) => item.category === selectedCategory)
    }

    return items
  }, [selectedCategory])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
            className="whitespace-nowrap"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Items Grid - Responsive: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {filteredItems.map((item, index) => (
          <button
            key={index}
            onClick={() =>
              onItemSelect({
                name: item.name,
                key: item.key,
                model: item.model,
                type: item.type
              })
            }
            className="border border-border rounded hover:border-primary active:border-primary transition-colors p-2 sm:p-2 flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer bg-card group min-h-[120px] sm:min-h-[140px]"
          >
            <div className="relative w-full aspect-square">
              <Image
                src={item.image}
                alt={t(item.key)}
                fill
                sizes="(max-width: 768px) 25vw, 10vw"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-center gap-0.5 sm:gap-1 w-full">
              <span className="text-xs sm:text-xs text-center font-medium leading-tight">
                {t(item.key)}
              </span>
              {/* {item.description && (
                <span className="text-[10px] text-muted-foreground text-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity line-clamp-2">
                  {item.description}
                </span>
              )} */}
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">{t('list.noItemsFound')}</p>
          <p className="text-xs mt-2">{t('list.selectDifferentCategory')}</p>
        </div>
      )}
    </div>
  )
}

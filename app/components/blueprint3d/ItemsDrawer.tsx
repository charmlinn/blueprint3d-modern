'use client'

import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'
import { ItemsList } from './ItemsList'

interface ItemsDrawerProps {
  isOpen: boolean
  onClose: () => void
  onItemSelect: (item: any) => void
}

export function ItemsDrawer({ isOpen, onClose, onItemSelect }: ItemsDrawerProps) {
  const t = useTranslations('BluePrint.sidebar')

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full md:w-1/3 bg-background border-l border-border z-50',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">{t('addItems')}</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <ItemsList onItemSelect={onItemSelect} />
          </div>
        </div>
      </div>
    </>
  )
}

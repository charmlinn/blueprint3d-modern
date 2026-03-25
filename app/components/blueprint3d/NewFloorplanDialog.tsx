'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RoomType, ROOM_TYPE_LABELS } from '@blueprint3d/types/room_types'

interface NewFloorplanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (roomType: RoomType) => void
  defaultRoomType?: RoomType
}

export function NewFloorplanDialog({
  open,
  onOpenChange,
  onConfirm,
  defaultRoomType
}: NewFloorplanDialogProps) {
  const t = useTranslations('BluePrint.newDialog')
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>(
    defaultRoomType || RoomType.BEDROOM
  )

  // Update room type when defaultRoomType changes or dialog opens
  useEffect(() => {
    if (open) {
      setSelectedRoomType(defaultRoomType || RoomType.BEDROOM)
    }
  }, [open, defaultRoomType])

  const handleConfirm = () => {
    onConfirm(selectedRoomType)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-3">
            <Label className="text-sm font-medium">{t('roomTypeLabel')}</Label>
            <RadioGroup value={selectedRoomType} onValueChange={(value) => setSelectedRoomType(value as RoomType)}>
              {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key} className="font-normal cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button variant="default" onClick={handleConfirm}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

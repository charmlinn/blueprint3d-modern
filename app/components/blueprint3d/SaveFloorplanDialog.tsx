'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { RoomType } from '@blueprint3d/types/room_types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SaveFloorplanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string, roomType: RoomType) => void
  defaultName?: string
  defaultRoomType?: RoomType
}

export function SaveFloorplanDialog({
  open,
  onOpenChange,
  onSave,
  defaultName = '',
  defaultRoomType = RoomType.BEDROOM
}: SaveFloorplanDialogProps) {
  const t = useTranslations('BluePrint.saveDialog')
  const tRoom = useTranslations('BluePrint.myFloorplans.roomTypes')
  const [name, setName] = useState(defaultName)
  const [roomType, setRoomType] = useState<RoomType>(defaultRoomType)

  // Update fields when dialog opens
  useEffect(() => {
    if (open) {
      setName(defaultName)
      setRoomType(defaultRoomType)
    }
  }, [open, defaultName, defaultRoomType])

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, roomType)
      setName('')
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              {t('nameLabel')}
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('namePlaceholder')}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="roomType" className="text-sm font-medium">
              {t('roomTypeLabel')}
            </label>
            <Select value={roomType} onValueChange={(v) => setRoomType(v as RoomType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RoomType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {tRoom(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button variant="default" onClick={handleSave} disabled={!name.trim()}>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

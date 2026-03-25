'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Settings } from './Settings'

interface SettingsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUnitChange: (unit: string) => void
  isLanguageOption?: boolean
}

export function SettingsDialog({ isOpen, onOpenChange, onUnitChange, isLanguageOption }: SettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Settings onUnitChange={onUnitChange} isLanguageOption={isLanguageOption} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

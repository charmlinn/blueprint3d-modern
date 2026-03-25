import { RoomType } from '@blueprint3d/types/room_types'
import { Blueprint3DTemplate } from '@blueprint3d/indexdb/blueprint-template'

export interface TemplateOption {
  id: string
  name: string
  description: string
  preview: string
  roomType: RoomType
  template?: Blueprint3DTemplate
}

// Import templates (you can add more templates as needed)
// For now, we'll define empty arrays and you can add templates later
const BEDROOM_TEMPLATES: TemplateOption[] = []
const LIVING_ROOM_TEMPLATES: TemplateOption[] = []
const BATHROOM_TEMPLATES: TemplateOption[] = []
const OFFICE_TEMPLATES: TemplateOption[] = []

/**
 * Get templates by room type
 */
export function getTemplatesByRoomType(roomType: RoomType): TemplateOption[] {
  switch (roomType) {
    case RoomType.BEDROOM:
      return BEDROOM_TEMPLATES
    case RoomType.LIVING_ROOM:
      return LIVING_ROOM_TEMPLATES
    case RoomType.BATHROOM:
      return BATHROOM_TEMPLATES
    case RoomType.OFFICE:
      return OFFICE_TEMPLATES
    default:
      return []
  }
}

/**
 * Get all templates
 */
export function getAllTemplates(): TemplateOption[] {
  return [
    ...BEDROOM_TEMPLATES,
    ...LIVING_ROOM_TEMPLATES,
    ...BATHROOM_TEMPLATES,
    ...OFFICE_TEMPLATES
  ]
}

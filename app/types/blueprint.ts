import { RoomType } from '@blueprint3d/types/room_types'

export interface BlueprintListItem {
  id: string
  name: string
  description: string | null
  thumbnailUrl: string | null
  previewCleanUrl: string | null
  roomType: RoomType | null
  createdAt: number
  updatedAt: number
}

export interface BlueprintDetail extends BlueprintListItem {
  layoutData: Record<string, any>
  layoutDataSimple: Record<string, any> | null
}

export interface BlueprintPayload {
  name: string
  description?: string
  layoutData: Record<string, any>
  thumbnailBase64?: string
  roomType?: RoomType
}

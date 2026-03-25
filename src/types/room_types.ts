/**
 * Room Type Enumeration
 * Defines all supported room types for Feng Shui analysis
 * Note: living_room uses underscore for database compatibility
 */
export enum RoomType {
  BEDROOM = 'bedroom',
  LIVING_ROOM = 'living-room',
  KITCHEN = 'kitchen',
  BATHROOM = 'bathroom',
  OFFICE = 'office'
}

/**
 * Type guard to check if a string is a valid RoomType
 */
export function isValidRoomType(value: string): value is RoomType {
  return Object.values(RoomType).includes(value as RoomType)
}

/**
 * Mode Type Enumeration
 * Defines special modes for Blueprint3D
 */
export enum SpecialMode {
  GENERATOR = 'generator',
  WEALTH_CORNER = 'wealth-corner'
}

export enum StandardMode {
  STANDARD = 'standard'
}

/**
 * Combined type for all possible modes (room types + special modes)
 */
export type AppMode = RoomType | SpecialMode

/**
 * Room type display labels
 */
export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  [RoomType.BEDROOM]: 'Bedroom',
  [RoomType.LIVING_ROOM]: 'Living Room',
  [RoomType.KITCHEN]: 'Kitchen',
  [RoomType.BATHROOM]: 'Bathroom',
  [RoomType.OFFICE]: 'Office'
}

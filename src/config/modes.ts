import type { Blueprint3DTemplate } from '../indexdb/blueprint-template'
import { RoomType, SpecialMode, StandardMode } from '../types/room_types'
import DefaultFloorplan from '../templates/default.json'
import ExampleFloorplan from '../templates/example.json'

/**
 * Blueprint3D application modes
 * Combines RoomType and SpecialMode from room_types.ts
 */
export type Blueprint3DMode = RoomType | SpecialMode | StandardMode

/**
 * All available Blueprint3D modes
 */
export const Blueprint3DModes = {
  ...StandardMode,
  ...RoomType,
  ...SpecialMode
} as const

export interface ModeConfig {
  /** Default floorplan template to load */
  defaultTemplate: Blueprint3DTemplate
}

/**
 * Centralized configuration for each Blueprint3D mode
 */
const MODE_CONFIGS_MAP: Record<Blueprint3DMode, ModeConfig> = {
  [StandardMode.STANDARD]: {
    defaultTemplate: ExampleFloorplan as Blueprint3DTemplate
  },
  [RoomType.BEDROOM]: {
    defaultTemplate: DefaultFloorplan as Blueprint3DTemplate
  },
  [RoomType.LIVING_ROOM]: {
    defaultTemplate: DefaultFloorplan as Blueprint3DTemplate
  },
  [RoomType.OFFICE]: {
    defaultTemplate: DefaultFloorplan as Blueprint3DTemplate
  },
  [RoomType.KITCHEN]: {
    defaultTemplate: DefaultFloorplan as Blueprint3DTemplate
  },
  [RoomType.BATHROOM]: {
    defaultTemplate: DefaultFloorplan as Blueprint3DTemplate
  },
  [SpecialMode.GENERATOR]: {
    defaultTemplate: DefaultFloorplan as Blueprint3DTemplate
  },
  [SpecialMode.WEALTH_CORNER]: {
    defaultTemplate: DefaultFloorplan as Blueprint3DTemplate
  }
}

export const MODE_CONFIGS = MODE_CONFIGS_MAP

/**
 * Get mode configuration
 */
export function getModeConfig(mode: Blueprint3DMode): ModeConfig {
  return MODE_CONFIGS[mode]
}

/**
 * Convert Blueprint3DMode to database RoomType
 * Note: Since we unified to use hyphens, this is now a no-op for most cases
 * @param mode - Blueprint3DMode (e.g., 'living-room')
 * @returns Database RoomType (e.g., 'living-room')
 */
export function modeToRoomType(mode: Blueprint3DMode | string): string {
  // No conversion needed anymore since we unified to hyphens
  return String(mode)
}

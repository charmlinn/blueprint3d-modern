// Canvas Data Simplification for LLM-friendly format
// This utility transforms verbose canvas data into a compact, token-efficient format

import type { SavedFloorplan } from '../model/floorplan'
import type { SerializedItem } from '../model/model'

// Input types (from existing model)
interface CanvasData {
  floorplan: SavedFloorplan
  items: SerializedItem[]
}

// Output types (simplified)
interface SimplifiedArea {
  name: string
  boundary: number[] // Corner indices in order
}

interface SimplifiedWall {
  corners: [number, number] // [start corner index, end corner index]
}

interface SimplifiedItem {
  pos: [number, number, number] // [x, y, z]
  rot: number
  scale: [number, number, number] // [x, y, z]
  fixed?: boolean
  resizable?: boolean
  description?: string // Description for AI understanding (replaces technical name)
}

export interface SimplifiedCanvasData {
  corners: [number, number][] // [x, y] coordinates
  layout: {
    walls: SimplifiedWall[]
    areas: SimplifiedArea[]
  }
  items: SimplifiedItem[]
}

/**
 * Simplifies canvas data for LLM consumption
 * - Replaces UUID with indices
 * - Uses arrays instead of objects for coordinates
 * - Extracts room/area boundary information
 * - Removes material/texture data (not relevant for Feng Shui analysis)
 */
export function simplifyCanvasData(data: CanvasData): SimplifiedCanvasData {
  const { floorplan, items } = data

  // Step 1: Build corner mapping (UUID -> index) and simplified corners array
  const cornerIds = Object.keys(floorplan.corners)
  const cornerIndexMap = new Map<string, number>()
  const corners: [number, number][] = []

  cornerIds.forEach((cornerId, index) => {
    cornerIndexMap.set(cornerId, index)
    const corner = floorplan.corners[cornerId]
    // Round to 2 decimal places to reduce token usage
    corners.push([
      Math.round(corner.x * 100) / 100,
      Math.round(corner.y * 100) / 100
    ])
  })

  // Step 2: Simplify walls (structure only, no materials)
  const walls: SimplifiedWall[] = []

  floorplan.walls.forEach((wall) => {
    const corner1Index = cornerIndexMap.get(wall.corner1)
    const corner2Index = cornerIndexMap.get(wall.corner2)

    if (corner1Index === undefined || corner2Index === undefined) {
      console.warn('Wall references unknown corner:', wall)
      return
    }

    walls.push({
      corners: [corner1Index, corner2Index]
    })
  })

  // Step 3: Extract areas/rooms (boundary information only, no materials)
  const areas: SimplifiedArea[] = []

  // Parse newFloorTextures keys (format: "uuid1,uuid2,uuid3,...")
  const newFloorTextures = floorplan.newFloorTextures || {}
  Object.entries(newFloorTextures).forEach(([cornerUuidsStr, _texture], index) => {
    const cornerUuids = cornerUuidsStr.split(',')
    const boundary: number[] = []

    cornerUuids.forEach((uuid) => {
      const cornerIndex = cornerIndexMap.get(uuid)
      if (cornerIndex !== undefined) {
        boundary.push(cornerIndex)
      }
    })

    if (boundary.length >= 3) {
      areas.push({
        name: `area_${index}`,
        boundary
      })
    }
  })

  // Step 4: Simplify items (remove name, type, url to reduce tokens)
  const simplifiedItems: SimplifiedItem[] = items.map((item) => {
    const simplified: SimplifiedItem = {
      pos: [
        Math.round(item.xpos * 100) / 100,
        Math.round(item.ypos * 100) / 100,
        Math.round(item.zpos * 100) / 100
      ],
      rot: Math.round(item.rotation * 100) / 100,
      scale: [
        Math.round(item.scale_x * 100) / 100,
        Math.round(item.scale_y * 100) / 100,
        Math.round(item.scale_z * 100) / 100
      ]
    }

    // Only include optional properties if they are meaningful
    if (item.fixed) {
      simplified.fixed = true
    }
    if (item.resizable !== undefined && item.resizable !== true) {
      simplified.resizable = item.resizable
    }
    // Description is the primary identifier (replaces technical name)
    if (item.description) {
      simplified.description = item.description
    }

    return simplified
  })

  return {
    corners,
    layout: {
      walls,
      areas
    },
    items: simplifiedItems
  }
}

/**
 * Convert simplified canvas data to minified JSON string (no whitespace)
 * This is the format that should be sent to LLM for maximum token efficiency
 */
export function toMinifiedJSON(data: SimplifiedCanvasData): string {
  return JSON.stringify(data)
}

/**
 * Convert simplified canvas data to formatted JSON string (for debugging)
 */
export function toFormattedJSON(data: SimplifiedCanvasData): string {
  return JSON.stringify(data, null, 2)
}

/**
 * Calculate token savings estimate
 */
export function estimateTokenSavings(original: CanvasData, simplified: SimplifiedCanvasData): {
  originalSize: number
  simplifiedSize: number
  minifiedSize: number
  savings: number
  savingsPercent: number
  minifiedSavings: number
  minifiedSavingsPercent: number
} {
  const originalSize = JSON.stringify(original).length
  const simplifiedSize = JSON.stringify(simplified, null, 2).length
  const minifiedSize = JSON.stringify(simplified).length
  const savings = originalSize - simplifiedSize
  const savingsPercent = Math.round((savings / originalSize) * 100)
  const minifiedSavings = originalSize - minifiedSize
  const minifiedSavingsPercent = Math.round((minifiedSavings / originalSize) * 100)

  return {
    originalSize,
    simplifiedSize,
    minifiedSize,
    savings,
    savingsPercent,
    minifiedSavings,
    minifiedSavingsPercent
  }
}

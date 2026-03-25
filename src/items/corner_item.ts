import * as THREE from 'three'
import { Utils } from '../core/utils'
import { Model } from '../model/model'
import { FloorItem } from './floor_item'
import { Metadata } from './metadata'
import type { Room } from '../model/room'

/**
 * A Corner Item is an entity that can only be placed at room corners (where two walls meet).
 * It sits on the floor at the intersection of two walls.
 */
export class CornerItem extends FloorItem {
  /** Distance threshold to snap to corner */
  private readonly cornerSnapDistance = 100

  /** Minimum angle between walls to be considered a valid corner (in radians) */
  private readonly minCornerAngle = Math.PI / 6 // 30 degrees

  constructor(
    model: Model,
    metadata: Metadata,
    geometry: THREE.BufferGeometry,
    material: THREE.Material | THREE.Material[],
    position?: THREE.Vector3,
    rotation?: number,
    scale?: THREE.Vector3
  ) {
    super(model, metadata, geometry, material, position, rotation, scale)
    this.receiveShadow = true
  }

  /** Override placement to snap to nearest corner */
  public placeInRoom(): void {
    super.placeInRoom()

    if (!this.position_set) {
      // Try to find the first valid corner and place item there
      const cornerInfo = this.findNearestValidCorner(this.position)
      if (cornerInfo) {
        this.positionAtCorner(cornerInfo)
      }
    } else {
      // Snap to nearest corner if within snap distance
      this.snapToNearestCorner()
    }
  }

  /** Move to position, ensuring it's at a valid corner */
  public moveToPosition(vec3: THREE.Vector3, intersection: THREE.Intersection | null): void {
    // Find nearest valid corner
    const nearestCorner = this.findNearestValidCorner(vec3)

    if (nearestCorner && this.isValidPosition(vec3)) {
      // Valid position with a nearby corner - snap to it
      this.hideError()
      this.positionAtCorner(nearestCorner)
    } else {
      // Invalid position or no corner nearby - show error
      this.showError(vec3)
    }
  }

  /** Check if position is at a valid corner */
  public isValidPosition(vec3: THREE.Vector3): boolean {
    // First check if we're in a room (inherited check)
    if (!super.isValidPosition(vec3)) {
      return false
    }

    // Check if there's a corner nearby (more lenient during drag)
    const nearestCorner = this.findNearestValidCorner(vec3)
    return nearestCorner !== null
  }

  /** Find the nearest valid corner to the given position */
  private findNearestValidCorner(
    vec3: THREE.Vector3
  ): { x: number; y: number; room: Room; cornerIndex: number } | null {
    const rooms = this.model.floorplan.getRooms()
    let nearestCorner: { x: number; y: number; room: Room; cornerIndex: number } | null = null
    let minDistance = Infinity

    for (const room of rooms) {
      // Check each corner of the room
      for (let i = 0; i < room.corners.length; i++) {
        const corner = room.corners[i]
        const distance = Utils.distance(vec3.x, vec3.z, corner.x, corner.y)

        // Only consider corners that form valid angles (actual corners, not straight walls)
        if (this.isValidCorner(room, i) && distance < minDistance) {
          minDistance = distance
          nearestCorner = { x: corner.x, y: corner.y, room, cornerIndex: i }
        }
      }
    }

    return nearestCorner
  }

  /** Check if a corner forms a valid angle (not a straight wall) */
  private isValidCorner(room: Room, cornerIndex: number): boolean {
    const corners = room.corners
    const numCorners = corners.length

    // Need at least 3 corners to form a room with actual corners
    if (numCorners < 3) {
      return false
    }

    // Get previous, current, and next corners
    const prevIndex = (cornerIndex - 1 + numCorners) % numCorners
    const nextIndex = (cornerIndex + 1) % numCorners

    const prev = corners[prevIndex]
    const current = corners[cornerIndex]
    const next = corners[nextIndex]

    // Calculate vectors from current corner to adjacent corners
    const vec1 = {
      x: prev.x - current.x,
      y: prev.y - current.y
    }
    const vec2 = {
      x: next.x - current.x,
      y: next.y - current.y
    }

    // Normalize vectors
    const len1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y)
    const len2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y)

    if (len1 === 0 || len2 === 0) {
      return false
    }

    vec1.x /= len1
    vec1.y /= len1
    vec2.x /= len2
    vec2.y /= len2

    // Calculate angle between vectors using dot product
    const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y
    const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)))

    // Check if angle is significant enough to be considered a corner
    // (not close to 180 degrees, which would be a straight wall)
    return angle > this.minCornerAngle && angle < Math.PI - this.minCornerAngle
  }

  /** Snap to the nearest corner if within snap distance */
  private snapToNearestCorner(): void {
    const nearestCorner = this.findNearestValidCorner(this.position)
    if (nearestCorner) {
      const distance = Utils.distance(
        this.position.x,
        this.position.z,
        nearestCorner.x,
        nearestCorner.y
      )
      if (distance < this.cornerSnapDistance) {
        this.positionAtCorner(nearestCorner)
      }
    }
  }

  /**
   * Position the item at a corner with edges aligned to both walls.
   * The item will be placed in the corner with its sides parallel to and touching the walls.
   */
  private positionAtCorner(cornerInfo: {
    x: number
    y: number
    room: Room
    cornerIndex: number
  }): void {
    const { x, y, room, cornerIndex } = cornerInfo
    const corners = room.corners
    const numCorners = corners.length

    // Get previous and next corners to determine wall directions
    const prevIndex = (cornerIndex - 1 + numCorners) % numCorners
    const nextIndex = (cornerIndex + 1) % numCorners

    const prev = corners[prevIndex]
    const current = corners[cornerIndex]
    const next = corners[nextIndex]

    // Calculate vectors pointing along the walls (away from corner)
    const vec1 = {
      x: prev.x - current.x,
      y: prev.y - current.y
    }
    const vec2 = {
      x: next.x - current.x,
      y: next.y - current.y
    }

    // Normalize vectors
    const len1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y)
    const len2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y)

    vec1.x /= len1
    vec1.y /= len1
    vec2.x /= len2
    vec2.y /= len2

    // Choose one wall as the primary alignment (vec2)
    // The item will be rotated to align with this wall
    // Subtract PI/2 to rotate 90 degrees counter-clockwise
    const wallAngle = Math.atan2(vec2.x, vec2.y)
    this.rotation.y = wallAngle - Math.PI / 2

    // Calculate offset from corner
    // The item should be offset by half its size in both wall directions
    // so that its edges touch the walls
    const offsetX = vec2.x * this.halfSize.x + vec1.x * this.halfSize.z
    const offsetY = vec2.y * this.halfSize.x + vec1.y * this.halfSize.z

    // Position item offset from corner
    this.position.x = x + offsetX
    this.position.z = y + offsetY
  }
}

import * as THREE from 'three'
import { Utils } from '../core/utils'
import { Configuration, configSnapToWallDistance } from '../core/configuration'
import { Model } from '../model/model'
import { HalfEdge } from '../model/half_edge'
import { Item } from './item'
import { Metadata } from './metadata'

/**
 * A Floor Item is an entity to be placed related to a floor.
 */
export abstract class FloorItem extends Item {
  /** The currently snapped wall edge (for maintaining snap while dragging) */
  private snappedWallEdge: HalfEdge | null = null

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
  }

  /** */
  public placeInRoom() {
    if (!this.position_set) {
      const center = this.model.floorplan.getCenter()
      this.position.x = center.x
      this.position.z = center.z
      this.position.y = 0.5 * (this.geometry.boundingBox!.max.y - this.geometry.boundingBox!.min.y)
    }
  }

  /** Take action after a resize */
  public resized(): void {
    this.position.y = this.halfSize.y
  }

  /** */
  public moveToPosition(vec3: THREE.Vector3, _intersection: THREE.Intersection | null): void {
    // keeps the position in the room and on the floor
    if (!this.isValidPosition(vec3)) {
      this.showError(vec3)
      return
    } else {
      this.hideError()
      vec3.y = this.position.y // keep it on the floor!

      // Enhanced wall snapping with corner support
      let primaryWall: HalfEdge | null = null
      let secondaryWall: HalfEdge | null = null

      const releaseThreshold = 30 // 30cm to release from wall
      const snapThreshold = Configuration.getNumericValue(configSnapToWallDistance)

      // If already snapped to a wall, check if we should maintain it
      if (this.snappedWallEdge) {
        const distanceToSnappedWall = this.snappedWallEdge.distanceTo(vec3.x, vec3.z)
        const surfaceDistanceToSnappedWall = distanceToSnappedWall - this.halfSize.z

        // Stay snapped if within release threshold
        if (surfaceDistanceToSnappedWall <= releaseThreshold) {
          primaryWall = this.snappedWallEdge
        } else {
          // Release from wall if moved too far
          this.snappedWallEdge = null
        }
      }

      // If not currently snapped, find the closest wall
      if (!primaryWall) {
        const { edge, distance } = this.findClosestWallEdge(vec3)
        const surfaceDistance = distance - this.halfSize.z

        // Only snap if within snap threshold
        if (edge && surfaceDistance <= snapThreshold) {
          primaryWall = edge
        }
      }

      // If we have a primary wall, apply its snap
      if (primaryWall) {
        const distance = primaryWall.distanceTo(vec3.x, vec3.z)
        const surfaceDistance = distance - this.halfSize.z
        vec3 = this.snapToWall(vec3, primaryWall, surfaceDistance)
        this.snappedWallEdge = primaryWall

        // Now check for corner snapping (secondary wall perpendicular to primary)
        secondaryWall = this.findPerpendicularWall(vec3, primaryWall, snapThreshold)
        if (secondaryWall) {
          // Apply corner snap - adjust position along primary wall to also touch secondary wall
          vec3 = this.snapToCorner(vec3, primaryWall, secondaryWall)
        }
      } else {
        this.snappedWallEdge = null
      }

      this.position.copy(vec3)
    }
  }

  /** Clear snapped wall when drag ends */
  public clickReleased(): void {
    super.clickReleased()
    // Keep the wall snapped after release so it stays against the wall
    // The snap will be cleared on next drag if moved away
  }

  /** */
  public isValidPosition(vec3: THREE.Vector3): boolean {
    const corners = this.getCorners('x', 'z', vec3)

    // check if we are in a room
    const rooms = this.model.floorplan.getRooms()
    let isInARoom = false
    for (let i = 0; i < rooms.length; i++) {
      if (
        Utils.pointInPolygon(vec3.x, vec3.z, rooms[i].interiorCorners) &&
        !Utils.polygonPolygonIntersect(corners, rooms[i].interiorCorners)
      ) {
        isInARoom = true
      }
    }
    if (!isInARoom) {
      //console.log('object not in a room');
      return false
    }

    // check if we are outside all other objects
    /*
      if (this.obstructFloorMoves) {
          var objects = this.model.items.getItems();
          for (var i = 0; i < objects.length; i++) {
              if (objects[i] === this || !objects[i].obstructFloorMoves) {
                  continue;
              }
              if (!utils.polygonOutsidePolygon(corners, objects[i].getCorners('x', 'z')) ||
                  utils.polygonPolygonIntersect(corners, objects[i].getCorners('x', 'z'))) {
                  //console.log('object not outside other objects');
                  return false;
              }
          }
      }*/

    return true
  }

  /** Find the closest wall edge and its distance from a given position.
   * @param vec3 The position to check.
   * @returns An object containing the closest wall edge and the distance to it.
   */
  protected findClosestWallEdge(vec3: THREE.Vector3): { edge: HalfEdge | null; distance: number } {
    const wallEdges = this.model.floorplan.wallEdges()

    let closestEdge: HalfEdge | null = null
    let minDistance = Infinity

    wallEdges.forEach((edge: HalfEdge) => {
      const distance = edge.distanceTo(vec3.x, vec3.z)
      if (distance < minDistance) {
        minDistance = distance
        closestEdge = edge
      }
    })

    return { edge: closestEdge, distance: minDistance }
  }

  /** Snap position to wall if within threshold distance.
   * @param vec3 The target position.
   * @param wallEdge The closest wall edge.
   * @param distance The distance to the wall.
   * @returns The adjusted position if snapping occurred, otherwise the original position.
   */
  protected snapToWall(
    vec3: THREE.Vector3,
    wallEdge: HalfEdge,
    distance: number
  ): THREE.Vector3 {
    const snapThreshold = Configuration.getNumericValue(configSnapToWallDistance)

    if (distance > snapThreshold) {
      return vec3
    }

    // Calculate the snapped position along the wall
    const start = wallEdge.interiorStart()
    const end = wallEdge.interiorEnd()

    // Calculate wall direction vector
    const wallDirX = end.x - start.x
    const wallDirY = end.y - start.y
    const wallLength = Math.sqrt(wallDirX * wallDirX + wallDirY * wallDirY)
    const wallDirNormX = wallDirX / wallLength
    const wallDirNormY = wallDirY / wallLength

    // Project the item position onto the wall line
    const toItemX = vec3.x - start.x
    const toItemY = vec3.z - start.y
    const projection = toItemX * wallDirNormX + toItemY * wallDirNormY

    // Clamp projection to wall bounds - use a minimal margin to allow corner placement
    // Just need enough margin to keep the item center within the wall segment
    const margin = 1 // 1cm minimal margin
    const clampedProjection = Math.max(margin, Math.min(wallLength - margin, projection))

    // Calculate the point on the wall
    const wallPointX = start.x + wallDirNormX * clampedProjection
    const wallPointY = start.y + wallDirNormY * clampedProjection

    // Calculate wall normal (perpendicular to wall direction, pointing inward)
    const wallNormalX = -wallDirNormY
    const wallNormalY = wallDirNormX

    // Offset from wall - interiorStart/End are already at wall interior surface
    // So we only need half the item depth to make the back face flush with the wall
    const offsetDistance = this.halfSize.z

    // Position the item offset from the wall
    const snappedX = wallPointX + wallNormalX * offsetDistance
    const snappedZ = wallPointY + wallNormalY * offsetDistance

    // Update rotation to face away from wall (using wall normal, not wall direction)
    // Use the same angle calculation as WallItem does
    const angle = Utils.angle(0, 1, wallNormalX, wallNormalY)
    this.rotation.y = angle

    return new THREE.Vector3(snappedX, vec3.y, snappedZ)
  }

  /**
   * Find a wall perpendicular to the primary wall that the item's side edge might snap to
   * @param vec3 Current position after primary wall snap
   * @param primaryWall The wall the item is currently snapped to
   * @param snapThreshold Maximum distance to consider for snapping
   * @returns The perpendicular wall if found and close enough, otherwise null
   */
  protected findPerpendicularWall(
    vec3: THREE.Vector3,
    primaryWall: HalfEdge,
    snapThreshold: number
  ): HalfEdge | null {
    // Get primary wall direction
    const primaryStart = primaryWall.interiorStart()
    const primaryEnd = primaryWall.interiorEnd()
    const primaryDirX = primaryEnd.x - primaryStart.x
    const primaryDirY = primaryEnd.y - primaryStart.y
    const primaryLength = Math.sqrt(primaryDirX * primaryDirX + primaryDirY * primaryDirY)
    const primaryDirNormX = primaryDirX / primaryLength
    const primaryDirNormY = primaryDirY / primaryLength

    // Calculate item's side edge positions (perpendicular to primary wall)
    // The item is rotated to face away from primary wall, so its sides are parallel to primary wall
    const sideOffset = this.halfSize.x // Half width of the item

    // Left and right side positions
    const leftX = vec3.x - primaryDirNormX * sideOffset
    const leftZ = vec3.z - primaryDirNormY * sideOffset
    const rightX = vec3.x + primaryDirNormX * sideOffset
    const rightZ = vec3.z + primaryDirNormY * sideOffset

    // Find all walls except the primary wall
    const wallEdges = this.model.floorplan.wallEdges()
    let closestPerpendicularWall: HalfEdge | null = null
    let minDistance = snapThreshold

    wallEdges.forEach((edge: HalfEdge) => {
      // Skip the primary wall and walls that are parallel to it
      if (edge === primaryWall) return

      // Check if this wall is roughly perpendicular to primary wall
      const edgeStart = edge.interiorStart()
      const edgeEnd = edge.interiorEnd()
      const edgeDirX = edgeEnd.x - edgeStart.x
      const edgeDirY = edgeEnd.y - edgeStart.y
      const edgeLength = Math.sqrt(edgeDirX * edgeDirX + edgeDirY * edgeDirY)
      const edgeDirNormX = edgeDirX / edgeLength
      const edgeDirNormY = edgeDirY / edgeLength

      // Dot product to check if perpendicular (should be close to 0)
      const dotProduct = primaryDirNormX * edgeDirNormX + primaryDirNormY * edgeDirNormY
      const isPerpendicular = Math.abs(dotProduct) < 0.3 // Allow some tolerance (cos(72°) ≈ 0.3)

      if (!isPerpendicular) return

      // Check distance from both side edges to this wall
      const leftDistance = edge.distanceTo(leftX, leftZ)
      const rightDistance = edge.distanceTo(rightX, rightZ)
      const minSideDistance = Math.min(leftDistance, rightDistance)

      if (minSideDistance < minDistance) {
        minDistance = minSideDistance
        closestPerpendicularWall = edge
      }
    })

    return closestPerpendicularWall
  }

  /**
   * Snap item to corner by positioning it like CornerItem does
   * Uses the same algorithm as CornerItem.positionAtCorner for consistent behavior
   * @param vec3 Current position (already snapped to primary wall)
   * @param primaryWall The main wall the item is snapped to
   * @param secondaryWall The perpendicular wall to snap the side to
   * @returns Adjusted position snapped to corner
   */
  protected snapToCorner(
    vec3: THREE.Vector3,
    primaryWall: HalfEdge,
    secondaryWall: HalfEdge
  ): THREE.Vector3 {
    // Find the corner point where the two walls meet
    const cornerPoint = this.findWallIntersection(primaryWall, secondaryWall)
    if (!cornerPoint) {
      // Walls don't intersect, return original position
      return vec3
    }

    // Get wall directions from the corner point
    // Primary wall direction (the wall item's back is against)
    const primaryStart = primaryWall.interiorStart()
    const primaryEnd = primaryWall.interiorEnd()

    // Determine which direction along primary wall points away from corner
    const distStartToCorner = Utils.distance(primaryStart.x, primaryStart.y, cornerPoint.x, cornerPoint.y)
    const distEndToCorner = Utils.distance(primaryEnd.x, primaryEnd.y, cornerPoint.x, cornerPoint.y)

    let primaryDirX: number, primaryDirY: number
    if (distStartToCorner < distEndToCorner) {
      // Corner is at start, direction points toward end
      primaryDirX = primaryEnd.x - cornerPoint.x
      primaryDirY = primaryEnd.y - cornerPoint.y
    } else {
      // Corner is at end, direction points toward start
      primaryDirX = primaryStart.x - cornerPoint.x
      primaryDirY = primaryStart.y - cornerPoint.y
    }

    // Secondary wall direction
    const secondaryStart = secondaryWall.interiorStart()
    const secondaryEnd = secondaryWall.interiorEnd()

    const distStartToCorner2 = Utils.distance(secondaryStart.x, secondaryStart.y, cornerPoint.x, cornerPoint.y)
    const distEndToCorner2 = Utils.distance(secondaryEnd.x, secondaryEnd.y, cornerPoint.x, cornerPoint.y)

    let secondaryDirX: number, secondaryDirY: number
    if (distStartToCorner2 < distEndToCorner2) {
      secondaryDirX = secondaryEnd.x - cornerPoint.x
      secondaryDirY = secondaryEnd.y - cornerPoint.y
    } else {
      secondaryDirX = secondaryStart.x - cornerPoint.x
      secondaryDirY = secondaryStart.y - cornerPoint.y
    }

    // Normalize directions
    const primaryLen = Math.sqrt(primaryDirX * primaryDirX + primaryDirY * primaryDirY)
    const secondaryLen = Math.sqrt(secondaryDirX * secondaryDirX + secondaryDirY * secondaryDirY)

    if (primaryLen === 0 || secondaryLen === 0) {
      return vec3
    }

    primaryDirX /= primaryLen
    primaryDirY /= primaryLen
    secondaryDirX /= secondaryLen
    secondaryDirY /= secondaryLen

    // Calculate offset from corner (same as CornerItem logic)
    // The item edges should touch both walls
    // vec2 (primary wall direction) × halfSize.x (width along primary wall)
    // + vec1 (secondary wall direction) × halfSize.z (depth perpendicular to primary)
    const offsetX = primaryDirX * this.halfSize.x + secondaryDirX * this.halfSize.z
    const offsetY = primaryDirY * this.halfSize.x + secondaryDirY * this.halfSize.z

    // Position item offset from corner
    const cornerX = cornerPoint.x + offsetX
    const cornerZ = cornerPoint.y + offsetY

    return new THREE.Vector3(cornerX, vec3.y, cornerZ)
  }

  /**
   * Find the intersection point of two walls (their corner)
   * @param wall1 First wall
   * @param wall2 Second wall
   * @returns The corner point if walls intersect, null otherwise
   */
  protected findWallIntersection(
    wall1: HalfEdge,
    wall2: HalfEdge
  ): { x: number; y: number } | null {
    // Check if walls share a common corner
    const w1Start = wall1.interiorStart()
    const w1End = wall1.interiorEnd()
    const w2Start = wall2.interiorStart()
    const w2End = wall2.interiorEnd()

    const threshold = 0.1 // 0.1cm tolerance for considering points as same

    // Check all combinations
    if (Utils.distance(w1Start.x, w1Start.y, w2Start.x, w2Start.y) < threshold) {
      return { x: w1Start.x, y: w1Start.y }
    }
    if (Utils.distance(w1Start.x, w1Start.y, w2End.x, w2End.y) < threshold) {
      return { x: w1Start.x, y: w1Start.y }
    }
    if (Utils.distance(w1End.x, w1End.y, w2Start.x, w2Start.y) < threshold) {
      return { x: w1End.x, y: w1End.y }
    }
    if (Utils.distance(w1End.x, w1End.y, w2End.x, w2End.y) < threshold) {
      return { x: w1End.x, y: w1End.y }
    }

    return null
  }
}

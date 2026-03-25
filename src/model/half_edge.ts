import * as THREE from 'three'
import { Utils } from '../core/utils'
import { EventEmitter } from '../core/events'
import type { Room } from './room'
import type { Wall } from './wall'
import { Corner } from './corner'

/**
 * Half Edges are created by Room.
 *
 * Once rooms have been identified, Half Edges are created for each interior wall.
 *
 * A wall can have two half edges if it is visible from both sides.
 */
export class HalfEdge {
  /** The successor edge in CCW ??? direction. */
  public next: HalfEdge | null = null

  /** The predecessor edge in CCW ??? direction. */
  public prev: HalfEdge | null = null

  /** */
  public offset: number

  /** */
  public height: number

  /** used for intersection testing... not convinced this belongs here */
  public plane: THREE.Mesh | null = null

  /** transform from world coords to wall planes (z=0) */
  public interiorTransform = new THREE.Matrix4()

  /** transform from world coords to wall planes (z=0) */
  public invInteriorTransform = new THREE.Matrix4()

  /** transform from world coords to wall planes (z=0) */
  public exteriorTransform = new THREE.Matrix4()

  /** transform from world coords to wall planes (z=0) */
  public invExteriorTransform = new THREE.Matrix4()

  /** */
  public redrawCallbacks = new EventEmitter<void>()

  /**
   * Constructs a half edge.
   * @param room The associated room.
   * @param wall The corresponding wall.
   * @param front True if front side.
   */
  constructor(
    // @ts-ignore - room is declared but not used, keeping for future use
    private room: Room | null,
    public wall: Wall,
    public front: boolean
  ) {
    this.front = front || false

    this.offset = wall.thickness / 2.0
    this.height = wall.height

    if (this.front) {
      this.wall.frontEdge = this
    } else {
      this.wall.backEdge = this
    }
  }

  /**
   *
   */
  public getTexture(): { url: string; stretch?: boolean; scale: number } {
    if (this.front) {
      return this.wall.frontTexture
    } else {
      return this.wall.backTexture
    }
  }

  /**
   *
   */
  public setTexture(textureUrl: string, textureStretch: boolean, textureScale: number): void {
    const texture = {
      url: textureUrl,
      stretch: textureStretch,
      scale: textureScale
    }
    if (this.front) {
      this.wall.frontTexture = texture
    } else {
      this.wall.backTexture = texture
    }
    this.redrawCallbacks.fire()
  }

  /**
   * this feels hacky, but need wall items
   */
  public generatePlane(): void {
    function transformCorner(corner: { x: number; y: number }): THREE.Vector3 {
      return new THREE.Vector3(corner.x, 0, corner.y)
    }

    const v1 = transformCorner(this.interiorStart())
    const v2 = transformCorner(this.interiorEnd())
    const v3 = v2.clone()
    v3.y = this.wall.height
    const v4 = v1.clone()
    v4.y = this.wall.height

    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array([
      v1.x,
      v1.y,
      v1.z,
      v2.x,
      v2.y,
      v2.z,
      v3.x,
      v3.y,
      v3.z,
      v1.x,
      v1.y,
      v1.z,
      v3.x,
      v3.y,
      v3.z,
      v4.x,
      v4.y,
      v4.z
    ])

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.computeVertexNormals()
    geometry.computeBoundingBox()

    this.plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial())
    this.plane.visible = false
    ;(this.plane as any).edge = this // js monkey patch

    this.computeTransforms(
      this.interiorTransform,
      this.invInteriorTransform,
      this.interiorStart(),
      this.interiorEnd()
    )
    this.computeTransforms(
      this.exteriorTransform,
      this.invExteriorTransform,
      this.exteriorStart(),
      this.exteriorEnd()
    )
  }

  public interiorDistance(): number {
    const start = this.interiorStart()
    const end = this.interiorEnd()
    return Utils.distance(start.x, start.y, end.x, end.y)
  }

  private computeTransforms(
    transform: THREE.Matrix4,
    invTransform: THREE.Matrix4,
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): void {
    const v1 = start
    const v2 = end

    const angle = Utils.angle(1, 0, v2.x - v1.x, v2.y - v1.y)

    const tt = new THREE.Matrix4()
    tt.makeTranslation(-v1.x, 0, -v1.y)
    const tr = new THREE.Matrix4()
    tr.makeRotationY(-angle)
    transform.multiplyMatrices(tr, tt)
    invTransform.copy(transform).invert()
  }

  /** Gets the distance from specified point.
   * @param x X coordinate of the point.
   * @param y Y coordinate of the point.
   * @returns The distance.
   */
  public distanceTo(x: number, y: number): number {
    // x, y, x1, y1, x2, y2
    return Utils.pointDistanceFromLine(
      x,
      y,
      this.interiorStart().x,
      this.interiorStart().y,
      this.interiorEnd().x,
      this.interiorEnd().y
    )
  }

  private getStart(): Corner {
    if (this.front) {
      return this.wall.getStart()
    } else {
      return this.wall.getEnd()
    }
  }

  private getEnd(): Corner {
    if (this.front) {
      return this.wall.getEnd()
    } else {
      return this.wall.getStart()
    }
  }

  // @ts-ignore - getOppositeEdge is declared but not used, keeping for future use
  private getOppositeEdge(): HalfEdge | null {
    if (this.front) {
      return this.wall.backEdge
    } else {
      return this.wall.frontEdge
    }
  }

  // these return an object with attributes x, y
  public interiorEnd(): { x: number; y: number } {
    const vec = this.halfAngleVector(this, this.next)
    return {
      x: this.getEnd().x + vec.x,
      y: this.getEnd().y + vec.y
    }
  }

  public interiorStart(): { x: number; y: number } {
    const vec = this.halfAngleVector(this.prev, this)
    return {
      x: this.getStart().x + vec.x,
      y: this.getStart().y + vec.y
    }
  }

  public interiorCenter(): { x: number; y: number } {
    return {
      x: (this.interiorStart().x + this.interiorEnd().x) / 2.0,
      y: (this.interiorStart().y + this.interiorEnd().y) / 2.0
    }
  }

  public exteriorEnd(): { x: number; y: number } {
    const vec = this.halfAngleVector(this, this.next)
    return {
      x: this.getEnd().x - vec.x,
      y: this.getEnd().y - vec.y
    }
  }

  public exteriorStart(): { x: number; y: number } {
    const vec = this.halfAngleVector(this.prev, this)
    return {
      x: this.getStart().x - vec.x,
      y: this.getStart().y - vec.y
    }
  }

  /** Get the corners of the half edge.
   * @returns An array of x,y pairs.
   */
  public corners(): { x: number; y: number }[] {
    return [this.interiorStart(), this.interiorEnd(), this.exteriorEnd(), this.exteriorStart()]
  }

  /**
   * Gets CCW angle from v1 to v2
   */
  private halfAngleVector(v1: HalfEdge | null, v2: HalfEdge | null): { x: number; y: number } {
    if (!v1 && !v2) {
      return { x: 0, y: 0 }
    }
    // make the best of things if we dont have prev or next
    let v1startX: number
    let v1startY: number
    let v1endX: number
    let v1endY: number
    if (!v1 && v2) {
      v1startX = v2.getStart().x - (v2.getEnd().x - v2.getStart().x)
      v1startY = v2.getStart().y - (v2.getEnd().y - v2.getStart().y)
      v1endX = v2.getStart().x
      v1endY = v2.getStart().y
    } else {
      v1startX = (v1 as HalfEdge).getStart().x
      v1startY = (v1 as HalfEdge).getStart().y
      v1endX = (v1 as HalfEdge).getEnd().x
      v1endY = (v1 as HalfEdge).getEnd().y
    }

    let v2startX: number
    let v2startY: number
    let v2endX: number
    let v2endY: number
    if (!v2 && v1) {
      v2startX = v1.getEnd().x
      v2startY = v1.getEnd().y
      v2endX = v1.getEnd().x + (v1.getEnd().x - v1.getStart().x)
      v2endY = v1.getEnd().y + (v1.getEnd().y - v1.getStart().y)
    } else {
      v2startX = (v2 as HalfEdge).getStart().x
      v2startY = (v2 as HalfEdge).getStart().y
      v2endX = (v2 as HalfEdge).getEnd().x
      v2endY = (v2 as HalfEdge).getEnd().y
    }

    // CCW angle between edges
    const theta = Utils.angle2pi(
      v1startX - v1endX,
      v1startY - v1endY,
      v2endX - v1endX,
      v2endY - v1endY
    )

    // cosine and sine of half angle
    const cs = Math.cos(theta / 2.0)
    const sn = Math.sin(theta / 2.0)

    // rotate v2
    const v2dx = v2endX - v2startX
    const v2dy = v2endY - v2startY

    const vx = v2dx * cs - v2dy * sn
    const vy = v2dx * sn + v2dy * cs

    // normalize
    const mag = Utils.distance(0, 0, vx, vy)
    const desiredMag = this.offset / sn
    const scalar = desiredMag / mag

    const halfAngleVector = {
      x: vx * scalar,
      y: vy * scalar
    }

    return halfAngleVector
  }
}

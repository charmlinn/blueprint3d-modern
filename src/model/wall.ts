import { Configuration, configWallThickness, configWallHeight } from '../core/configuration'
import { Utils } from '../core/utils'
import { EventEmitter } from '../core/events'
import type { Item } from '../items/item'
import type { Corner } from './corner'
import type { HalfEdge } from './half_edge'

/** The default wall texture. */
const defaultWallTexture = {
  url: 'https://cdn-images.lumenfeng.com/models-cover/wallmap.png',
  stretch: true,
  scale: 0
}

/**
 * A Wall is the basic element to create Rooms.
 *
 * Walls consists of two half edges.
 */
export class Wall {
  /** The unique id of each wall. */
  // @ts-ignore - id is declared but not used, keeping for future use
  private id: string

  /** Front is the plane from start to end. */
  public frontEdge: HalfEdge | null = null

  /** Back is the plane from end to start. */
  public backEdge: HalfEdge | null = null

  /** */
  public orphan = false

  /** Items attached to this wall */
  public items: Item[] = []

  /** */
  public onItems: Item[] = []

  /** The front-side texture. */
  public frontTexture = defaultWallTexture

  /** The back-side texture. */
  public backTexture = defaultWallTexture

  /** Wall thickness. */
  public thickness = Configuration.getNumericValue(configWallThickness)

  /** Wall height. */
  public height = Configuration.getNumericValue(configWallHeight)

  /** Actions to be applied after movement. */
  private moved_callbacks = new EventEmitter<void>()

  /** Actions to be applied on removal. */
  private deleted_callbacks = new EventEmitter<Wall>()

  /** Actions to be applied explicitly. */
  private action_callbacks = new EventEmitter<unknown>()

  /**
   * Constructs a new wall.
   * @param start Start corner.
   * @param end End corner.
   */
  constructor(private start: Corner, private end: Corner) {
    this.id = this.getUuid()

    this.start.attachStart(this)
    this.end.attachEnd(this)
  }

  private getUuid(): string {
    return [this.start.id, this.end.id].join()
  }

  public resetFrontBack() {
    this.frontEdge = null
    this.backEdge = null
    this.orphan = false
  }

  public snapToAxis(tolerance: number): void {
    // order here is important, but unfortunately arbitrary
    this.start.snapToAxis(tolerance)
    this.end.snapToAxis(tolerance)
  }

  public fireOnMove(func: () => void): void {
    this.moved_callbacks.add(func)
  }

  public fireOnDelete(func: (wall: Wall) => void): void {
    this.deleted_callbacks.add(func)
  }

  public dontFireOnDelete(func: (wall: Wall) => void): void {
    this.deleted_callbacks.remove(func)
  }

  public fireOnAction(func: (action: unknown) => void): void {
    this.action_callbacks.add(func)
  }

  public fireAction(action: unknown): void {
    this.action_callbacks.fire(action)
  }

  public relativeMove(dx: number, dy: number): void {
    this.start.relativeMove(dx, dy)
    this.end.relativeMove(dx, dy)
  }

  public fireMoved(): void {
    this.moved_callbacks.fire()
  }

  public fireRedraw(): void {
    if (this.frontEdge) {
      this.frontEdge.redrawCallbacks.fire()
    }
    if (this.backEdge) {
      this.backEdge.redrawCallbacks.fire()
    }
  }

  public getStart(): Corner {
    return this.start
  }

  public getEnd(): Corner {
    return this.end
  }

  public getStartX(): number {
    return this.start.getX()
  }

  public getEndX(): number {
    return this.end.getX()
  }

  public getStartY(): number {
    return this.start.getY()
  }

  public getEndY(): number {
    return this.end.getY()
  }

  public remove(): void {
    this.start.detachWall(this)
    this.end.detachWall(this)
    this.deleted_callbacks.fire(this)

    // Clear items arrays to ensure no stale references
    this.items = []
    this.onItems = []
  }

  public setStart(corner: Corner): void {
    this.start.detachWall(this)
    corner.attachStart(this)
    this.start = corner
    this.fireMoved()
  }

  public setEnd(corner: Corner): void {
    this.end.detachWall(this)
    corner.attachEnd(this)
    this.end = corner
    this.fireMoved()
  }

  public distanceFrom(x: number, y: number): number {
    return Utils.pointDistanceFromLine(
      x,
      y,
      this.getStartX(),
      this.getStartY(),
      this.getEndX(),
      this.getEndY()
    )
  }

  /** Return the corner opposite of the one provided.
   * @param corner The given corner.
   * @returns The opposite corner.
   */
  // @ts-ignore - oppositeCorner is declared but not used, keeping for future use
  private oppositeCorner(corner: Corner): Corner | undefined {
    if (this.start === corner) {
      return this.end
    } else if (this.end === corner) {
      return this.start
    } else {
      console.log('Wall does not connect to corner')
      return undefined
    }
  }
}

import * as THREE from 'three'
import { Floorplan } from './floorplan'
import { Scene } from './scene'
import { EventEmitter } from '../core/events'
import type { SavedFloorplan } from './floorplan'

export interface SerializedItem {
  item_name: string
  item_type: number
  model_url: string
  xpos: number
  ypos: number
  zpos: number
  rotation: number
  scale_x: number
  scale_y: number
  scale_z: number
  fixed: boolean
  resizable?: boolean
  description?: string // Description for AI understanding
}

/**
 * A Model connects a Floorplan and a Scene.
 */
export class Model {
  /** */
  public floorplan: Floorplan

  /** */
  public scene: Scene

  /** */
  private roomLoadingCallbacks = new EventEmitter<void>()

  /** */
  private roomLoadedCallbacks = new EventEmitter<void>()

  /** name */
  // @ts-ignore - roomSavedCallbacks is declared but not used, keeping for future use
  private roomSavedCallbacks = new EventEmitter<void>()

  /** success (bool), copy (bool) */
  // @ts-ignore - roomDeletedCallbacks is declared but not used, keeping for future use
  private roomDeletedCallbacks = new EventEmitter<{ success: boolean; copy: boolean }>()

  /** Constructs a new model.
   * @param textureDir The directory containing the textures.
   */
  constructor(textureDir: string) {
    this.floorplan = new Floorplan()
    this.scene = new Scene(this, textureDir)
  }

  public loadSerialized(json: string): void {
    // TODO: better documentation on serialization format.
    // TODO: a much better serialization format.
    this.roomLoadingCallbacks.fire()

    const data = JSON.parse(json) as { floorplan: SavedFloorplan; items: SerializedItem[] }
    this.newRoom(data.floorplan, data.items)

    this.roomLoadedCallbacks.fire()
  }

  public exportSerialized(): string {
    const items_arr: SerializedItem[] = []
    const objects = this.scene.getItems()
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i]
      const metadata = object.metadata
      items_arr[i] = {
        item_name: metadata.itemName ?? '',
        item_type: metadata.itemType ?? 0,
        model_url: metadata.modelUrl ?? '',
        xpos: object.position.x,
        ypos: object.position.y,
        zpos: object.position.z,
        rotation: object.rotation.y,
        scale_x: object.scale.x,
        scale_y: object.scale.y,
        scale_z: object.scale.z,
        fixed: object.fixed,
        resizable: metadata.resizable,
        description: metadata.description
      }
    }

    const room = {
      floorplan: this.floorplan.saveFloorplan(),
      items: items_arr
    }

    return JSON.stringify(room)
  }

  private newRoom(floorplan: SavedFloorplan, items: SerializedItem[]): void {
    this.scene.clearItems()
    this.floorplan.loadFloorplan(floorplan)
    items.forEach((item) => {
      const position = new THREE.Vector3(item.xpos, item.ypos, item.zpos)
      const metadata = {
        itemName: item.item_name,
        resizable: item.resizable,
        itemType: item.item_type,
        modelUrl: item.model_url,
        description: item.description
      }
      const scale = new THREE.Vector3(item.scale_x, item.scale_y, item.scale_z)
      this.scene.addItem(
        item.item_type,
        item.model_url,
        metadata,
        position,
        item.rotation,
        scale,
        item.fixed
      )
    })
  }
}

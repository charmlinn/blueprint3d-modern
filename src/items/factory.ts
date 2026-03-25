import type { Item } from './item'
import type { Model } from '../model/model'
import type { Metadata } from './metadata'
import * as THREE from 'three'
import { CornerItem } from './corner_item'
import { FloorItem } from './floor_item'
import { InWallFloorItem } from './in_wall_floor_item'
import { InWallItem } from './in_wall_item'
import { OnFloorItem } from './on_floor_item'
import { WallFloorItem } from './wall_floor_item'
import { WallItem } from './wall_item'

/** Item constructor type */
type ItemConstructor = new (
  model: Model,
  metadata: Metadata,
  geometry: THREE.BufferGeometry,
  material: THREE.Material | THREE.Material[],
  position?: THREE.Vector3,
  rotation?: number,
  scale?: THREE.Vector3
) => Item

/** Enumeration of item types. */
const item_types: Record<number, ItemConstructor> = {
  1: FloorItem as any, // FloorItem is abstract
  2: WallItem as any, // WallItem is abstract
  3: InWallItem,
  7: InWallFloorItem,
  8: OnFloorItem,
  9: WallFloorItem,
  10: CornerItem
}

/** Factory class to create items. */
export class Factory {
  /** Gets the class for the specified item. */
  public static getClass(itemType: number): ItemConstructor {
    return item_types[itemType]
  }
}

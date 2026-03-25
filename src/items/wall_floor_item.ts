import * as THREE from 'three'
import { Model } from '../model/model'
import { WallItem } from './wall_item'
import { Metadata } from './metadata'

/** */
export class WallFloorItem extends WallItem {
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
    this.boundToFloor = true
  }
}

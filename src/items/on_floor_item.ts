import * as THREE from 'three'
import { Model } from '../model/model'
import { FloorItem } from './floor_item'
import { Metadata } from './metadata'

/** */
export class OnFloorItem extends FloorItem {
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
    this.obstructFloorMoves = false
    this.receiveShadow = true
  }
}

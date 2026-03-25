import * as THREE from 'three'
import { Utils } from '../core/utils'
import { Model } from '../model/model'
import { Scene } from '../model/scene'
import { Metadata } from './metadata'

/**
 * An Item is an abstract entity for all things placed in the scene,
 * e.g. at walls or on the floor.
 */
export abstract class Item extends THREE.Mesh {
  /** */
  private scene: Scene

  /** */
  private errorGlow = new THREE.Mesh()

  /** */
  private hover = false

  /** */
  private selected = false

  /** */
  // @ts-ignore - highlighted is declared but not used, keeping for future use
  private highlighted = false

  /** */
  private error = false

  /** */
  private emissiveColor = 0x444444

  /** */
  private errorColor = 0xff0000

  /** */
  // @ts-ignore - resizable is declared but not used, keeping for future use
  private resizable: boolean

  /** Does this object affect other floor items */
  public obstructFloorMoves = true

  /** */
  public position_set: boolean

  /** Show rotate option in context menu */
  public allowRotate = true

  /** */
  public fixed = false

  /** dragging */
  private dragOffset = new THREE.Vector3()

  /** */
  public halfSize: THREE.Vector3

  /** Constructs an item.
   * @param model TODO
   * @param metadata TODO
   * @param geometry TODO
   * @param material TODO
   * @param position TODO
   * @param rotation TODO
   * @param scale TODO
   */
  constructor(
    protected model: Model,
    public metadata: Metadata,
    geometry: THREE.BufferGeometry,
    material: THREE.Material | THREE.Material[],
    position?: THREE.Vector3,
    rotation?: number,
    scale?: THREE.Vector3
  ) {
    // Center geometry in its bounding box BEFORE calling super
    geometry.computeBoundingBox()

    if (geometry.boundingBox) {
      const centerTranslation = new THREE.Matrix4().makeTranslation(
        -0.5 * (geometry.boundingBox.max.x + geometry.boundingBox.min.x),
        -0.5 * (geometry.boundingBox.max.y + geometry.boundingBox.min.y),
        -0.5 * (geometry.boundingBox.max.z + geometry.boundingBox.min.z)
      )
      geometry.applyMatrix4(centerTranslation)

      // Recompute after transformation
      geometry.computeBoundingBox()
      geometry.computeBoundingSphere()
    }

    // Call super with geometry and material (required in r181)
    super(geometry, material)

    this.scene = this.model.scene
    this.errorColor = 0xff0000
    this.resizable = metadata.resizable || false

    this.castShadow = true
    this.receiveShadow = true  // Enable shadow receiving for realistic depth perception

    if (position) {
      this.position.copy(position)
      this.position_set = true
    } else {
      this.position_set = false
    }

    this.halfSize = this.objectHalfSize()

    if (rotation) {
      this.rotation.y = rotation
    }

    if (scale != null) {
      this.setScale(scale.x, scale.y, scale.z)
    }
  }

  /** */
  public removeFromScene(): void {
    this.scene.removeItem(this)
  }

  /** */
  public resize(height: number, width: number, depth: number) {
    const x = width / this.getWidth()
    const y = height / this.getHeight()
    const z = depth / this.getDepth()
    this.setScale(x, y, z)
  }

  /** */
  public setScale(x: number, y: number, z: number) {
    const scaleVec = new THREE.Vector3(x, y, z)
    this.halfSize.multiply(scaleVec)
    scaleVec.multiply(this.scale)
    this.scale.set(scaleVec.x, scaleVec.y, scaleVec.z)
    this.resized()
    this.scene.needsUpdate = true
  }

  /** */
  public setFixed(fixed: boolean) {
    this.fixed = fixed
  }

  /** Subclass can define to take action after a resize. */
  protected abstract resized(): void

  /** */
  public getHeight = function (this: Item): number {
    return this.halfSize.y * 2.0
  }

  /** */
  public getWidth = function (this: Item): number {
    return this.halfSize.x * 2.0
  }

  /** */
  public getDepth = function (this: Item): number {
    return this.halfSize.z * 2.0
  }

  /** */
  public abstract placeInRoom(): void

  /** */
  public initObject = function (this: Item): void {
    this.placeInRoom()
    // select and stuff
    this.scene.needsUpdate = true
  }

  /** */
  public removed() {}

  /** on is a bool */
  public updateHighlight() {
    const on = this.hover || this.selected
    this.highlighted = on
    const hex = on ? this.emissiveColor : 0x000000
    const materials = Array.isArray(this.material) ? this.material : [this.material]
    materials.forEach((material) => {
      if ('emissive' in material && material.emissive) {
        ;(material as any).emissive.setHex(hex)
        // Increase emissive intensity for Three.js r181
        if ('emissiveIntensity' in material) {
          ;(material as any).emissiveIntensity = on ? 2.0 : 1.0
        }
      }
    })
  }

  /** */
  public mouseOver() {
    this.hover = true
    this.updateHighlight()
  }

  /** */
  public mouseOff() {
    this.hover = false
    this.updateHighlight()
  }

  /** */
  public setSelected() {
    this.selected = true
    this.updateHighlight()
  }

  /** */
  public setUnselected() {
    this.selected = false
    this.updateHighlight()
  }

  /** intersection has attributes point (vec3) and object (THREE.Mesh) */
  public clickPressed(intersection: THREE.Intersection): void {
    this.dragOffset.copy(intersection.point).sub(this.position)
  }

  /** */
  public clickDragged(intersection: THREE.Intersection | null): void {
    if (intersection) {
      this.moveToPosition(intersection.point.sub(this.dragOffset), intersection)
    }
  }

  /** */
  public rotate(intersection: THREE.Intersection | null): void {
    if (intersection) {
      let angle = Utils.angle(
        0,
        1,
        intersection.point.x - this.position.x,
        intersection.point.z - this.position.z
      )

      const snapTolerance = Math.PI / 16.0

      // snap to intervals near Math.PI/2
      for (let i = -4; i <= 4; i++) {
        if (Math.abs(angle - i * (Math.PI / 2)) < snapTolerance) {
          angle = i * (Math.PI / 2)
          break
        }
      }

      this.rotation.y = angle
    }
  }

  /** */
  public moveToPosition(vec3: THREE.Vector3, intersection: THREE.Intersection | null): void {
    this.position.copy(vec3)
  }

  /** */
  public clickReleased() {
    if (this.error) {
      this.hideError()
    }
  }

  /**
   * Returns an array of planes to use other than the ground plane
   * for passing intersection to clickPressed and clickDragged
   */
  public customIntersectionPlanes(): THREE.Mesh[] {
    return []
  }

  /**
   * returns the 2d corners of the bounding polygon
   *
   * offset is Vector3 (used for getting corners of object at a new position)
   *
   * TODO: handle rotated objects better!
   */
  public getCorners(
    xDim: string,
    yDim: string,
    position?: THREE.Vector3
  ): { x: number; y: number }[] {
    position = position || this.position

    const halfSize = this.halfSize.clone()

    const c1 = new THREE.Vector3(-halfSize.x, 0, -halfSize.z)
    const c2 = new THREE.Vector3(halfSize.x, 0, -halfSize.z)
    const c3 = new THREE.Vector3(halfSize.x, 0, halfSize.z)
    const c4 = new THREE.Vector3(-halfSize.x, 0, halfSize.z)

    const transform = new THREE.Matrix4()
    //console.log(this.rotation.y);
    transform.makeRotationY(this.rotation.y) //  + Math.PI/2)

    c1.applyMatrix4(transform)
    c2.applyMatrix4(transform)
    c3.applyMatrix4(transform)
    c4.applyMatrix4(transform)

    c1.add(position)
    c2.add(position)
    c3.add(position)
    c4.add(position)

    //halfSize.applyMatrix4(transform);

    //const min = position.clone().sub(halfSize);
    //const max = position.clone().add(halfSize);

    const corners = [
      { x: c1.x, y: c1.z },
      { x: c2.x, y: c2.z },
      { x: c3.x, y: c3.z },
      { x: c4.x, y: c4.z }
    ]

    return corners
  }

  /** */
  public abstract isValidPosition(vec3: THREE.Vector3): boolean

  /** */
  public showError(vec3?: THREE.Vector3): void {
    vec3 = vec3 || this.position
    if (!this.error) {
      this.error = true
      this.errorGlow = this.createGlow(this.errorColor, 0.8, true)
      this.scene.add(this.errorGlow)
    }
    this.errorGlow.position.copy(vec3)
  }

  /** */
  public hideError() {
    if (this.error) {
      this.error = false
      this.scene.remove(this.errorGlow)
    }
  }

  /** */
  private objectHalfSize(): THREE.Vector3 {
    const objectBox = new THREE.Box3()
    objectBox.setFromObject(this)
    return objectBox.max.clone().sub(objectBox.min).divideScalar(2)
  }

  /** */
  public createGlow(color: number, opacity?: number, ignoreDepth?: boolean): THREE.Mesh {
    ignoreDepth = ignoreDepth || false
    opacity = opacity || 0.2
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      blending: THREE.AdditiveBlending,
      opacity: 0.2,
      transparent: true,
      depthTest: !ignoreDepth
    })

    const glow = new THREE.Mesh(this.geometry.clone(), glowMaterial)
    glow.position.copy(this.position)
    glow.rotation.copy(this.rotation)
    glow.scale.copy(this.scale)
    return glow
  }
}

import * as THREE from 'three'
import type { Item } from '../items/item'
import type { Main } from './main'

/**
 * Drawings on "top" of the scene. e.g. rotate arrows
 */
export class HUD {
  private readonly three: Main
  private readonly scene: THREE.Scene
  private selectedItem: Item | null = null
  private rotating = false
  private mouseover = false
  // @ts-ignore - tolerance is declared but not used, keeping for future use
  private readonly tolerance = 10
  private readonly height = 5
  private readonly distance = 20
  private readonly color = '#ffffff'
  private readonly hoverColor = '#f1c40f'
  private activeObject: THREE.Object3D | null = null

  // Mobile detection for larger touch targets
  private readonly isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  private readonly scaleFactor = this.isMobile ? 1.8 : 1.0 // Make 80% larger on mobile

  constructor(three: Main) {
    this.three = three
    this.scene = new THREE.Scene()
    this.init()
  }

  public getScene(): THREE.Scene {
    return this.scene
  }

  public getObject(): THREE.Object3D | null {
    return this.activeObject
  }

  private init(): void {
    this.three.itemSelectedCallbacks.add(this.itemSelected.bind(this))
    this.three.itemUnselectedCallbacks.add(this.itemUnselected.bind(this))
  }

  private resetSelectedItem(): void {
    this.selectedItem = null
    if (this.activeObject) {
      this.scene.remove(this.activeObject)
      this.activeObject = null
    }
  }

  private itemSelected(item: Item): void {
    if (this.selectedItem !== item) {
      this.resetSelectedItem()
      if (item.allowRotate && !item.fixed) {
        this.selectedItem = item
        this.activeObject = this.makeObject(this.selectedItem)
        this.scene.add(this.activeObject)
      }
    }
  }

  private itemUnselected(): void {
    this.resetSelectedItem()
  }

  public setRotating(isRotating: boolean): void {
    this.rotating = isRotating
    this.setColor()
  }

  public setMouseover(isMousedOver: boolean): void {
    this.mouseover = isMousedOver
    this.setColor()
  }

  private setColor(): void {
    if (this.activeObject) {
      this.activeObject.children.forEach((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          ;(obj.material as THREE.Material & { color?: THREE.Color }).color?.set(this.getColor())
        }
      })
    }
    this.three.needsUpdate()
  }

  private getColor(): string {
    return this.mouseover || this.rotating ? this.hoverColor : this.color
  }

  public update(): void {
    if (this.activeObject && this.selectedItem) {
      this.activeObject.rotation.y = this.selectedItem.rotation.y
      this.activeObject.position.x = this.selectedItem.position.x
      this.activeObject.position.z = this.selectedItem.position.z
    }
  }

  private makeLineGeometry(item: Item): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry()

    const rotVec = this.rotateVector(item)
    const positions = new Float32Array([0, 0, 0, rotVec.x, rotVec.y, rotVec.z])

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    return geometry
  }

  private rotateVector(item: Item): THREE.Vector3 {
    const vec = new THREE.Vector3(
      0,
      0,
      Math.max(item.halfSize.x, item.halfSize.z) + 1.4 + this.distance
    )
    return vec
  }

  private makeLineMaterial(): THREE.LineBasicMaterial {
    const mat = new THREE.LineBasicMaterial({
      color: this.getColor(),
      linewidth: 3
    })
    return mat
  }

  private makeCone(item: Item): THREE.Mesh {
    // Larger cone on mobile for easier touch interaction
    const coneRadius = 5 * this.scaleFactor
    const coneHeight = 10 * this.scaleFactor
    const coneGeo = new THREE.CylinderGeometry(coneRadius, 0, coneHeight)
    const coneMat = new THREE.MeshBasicMaterial({
      color: this.getColor()
    })
    const cone = new THREE.Mesh(coneGeo, coneMat)
    cone.position.copy(this.rotateVector(item))

    cone.rotation.x = -Math.PI / 2.0

    return cone
  }

  private makeSphere(): THREE.Mesh {
    // Larger sphere on mobile for easier touch interaction
    const sphereRadius = 4 * this.scaleFactor
    const geometry = new THREE.SphereGeometry(sphereRadius, 16, 16)
    const material = new THREE.MeshBasicMaterial({
      color: this.getColor()
    })
    const sphere = new THREE.Mesh(geometry, material)
    return sphere
  }

  private makeObject(item: Item): THREE.Object3D {
    const object = new THREE.Object3D()
    const line = new THREE.Line(this.makeLineGeometry(item), this.makeLineMaterial())

    const cone = this.makeCone(item)
    const sphere = this.makeSphere()

    object.add(line)
    object.add(cone)
    object.add(sphere)

    object.rotation.y = item.rotation.y
    object.position.x = item.position.x
    object.position.z = item.position.z
    object.position.y = this.height

    return object
  }
}

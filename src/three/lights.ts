import * as THREE from 'three'
import type { Floorplan } from '../model/floorplan'

export class Lights {
  private readonly scene: THREE.Scene
  private readonly floorplan: Floorplan
  private readonly tol = 1
  private readonly height = 300 // TODO: share with Blueprint.Wall
  private dirLight!: THREE.DirectionalLight

  constructor(scene: THREE.Scene, floorplan: Floorplan) {
    this.scene = scene
    this.floorplan = floorplan
    this.init()
  }

  public getDirLight(): THREE.DirectionalLight {
    return this.dirLight
  }

  private init(): void {
    // Increased intensity for Three.js r181 physically correct rendering
    const light = new THREE.HemisphereLight(0xffffff, 0x888888, 3.0)
    light.position.set(0, this.height, 0)
    this.scene.add(light)

    // Fixed: Set intensity to 0.5 instead of 0 (was causing items to be invisible)
    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    this.dirLight.color.setHSL(1, 1, 0.1)

    this.dirLight.castShadow = true

    // Updated for Three.js r181: Use shadow.mapSize instead of shadowMapWidth/Height
    this.dirLight.shadow.mapSize.width = 1024
    this.dirLight.shadow.mapSize.height = 1024

    // Updated for Three.js r181: Use shadow.camera.far instead of shadowCameraFar
    this.dirLight.shadow.camera.far = this.height + this.tol
    // Updated for Three.js r181: Use shadow.bias instead of shadowBias
    this.dirLight.shadow.bias = -0.0001
    // shadowDarkness was removed in Three.js r181
    this.dirLight.visible = true

    this.scene.add(this.dirLight)
    this.scene.add(this.dirLight.target)

    this.floorplan.fireOnUpdatedRooms(this.updateShadowCamera.bind(this))
  }

  private updateShadowCamera(): void {
    const size = this.floorplan.getSize()
    const d = (Math.max(size.z, size.x) + this.tol) / 2.0

    const center = this.floorplan.getCenter()
    const pos = new THREE.Vector3(center.x, this.height, center.z)
    this.dirLight.position.copy(pos)
    this.dirLight.target.position.copy(center)

    // Updated for Three.js r181: Use shadow.camera properties directly
    this.dirLight.shadow.camera.left = -d
    this.dirLight.shadow.camera.right = d
    this.dirLight.shadow.camera.top = d
    this.dirLight.shadow.camera.bottom = -d
    this.dirLight.shadow.camera.updateProjectionMatrix()
  }
}

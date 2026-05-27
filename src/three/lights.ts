import * as THREE from 'three'
import type { Floorplan } from '../model/floorplan'
import type { Scene3DTheme } from './scene_theme'

export class Lights {
  private readonly scene: THREE.Scene
  private readonly floorplan: Floorplan
  private readonly tol = 1
  private readonly height = 300 // TODO: share with Blueprint.Wall
  private dirLight!: THREE.DirectionalLight
  private hemiLight!: THREE.HemisphereLight

  constructor(scene: THREE.Scene, floorplan: Floorplan) {
    this.scene = scene
    this.floorplan = floorplan
    this.init()
  }

  public getDirLight(): THREE.DirectionalLight {
    return this.dirLight
  }

  private init(): void {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 3.0)
    this.hemiLight.position.set(0, this.height, 0)
    this.scene.add(this.hemiLight)

    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.5)

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

  public setTheme(theme: Scene3DTheme): void {
    this.hemiLight.color.setHex(theme.hemisphereSky)
    this.hemiLight.groundColor.setHex(theme.hemisphereGround)
    this.hemiLight.intensity = theme.hemisphereIntensity
    this.dirLight.color.setHex(theme.directionalColor)
    this.dirLight.intensity = theme.directionalIntensity
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

import * as THREE from 'three'

export class Skybox {
  private readonly scene: THREE.Scene
  private readonly topColor: number
  private readonly bottomColor: number
  private readonly verticalOffset = 500
  private readonly sphereRadius = 4000
  private readonly widthSegments = 32
  private readonly heightSegments = 15

  private readonly vertexShader = [
    'varying vec3 vWorldPosition;',
    'void main() {',
    '  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
    '  vWorldPosition = worldPosition.xyz;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join('\n')

  private readonly fragmentShader = [
    'uniform vec3 topColor;',
    'uniform vec3 bottomColor;',
    'uniform float offset;',
    'varying vec3 vWorldPosition;',
    'void main() {',
    '  float h = normalize( vWorldPosition + offset ).y;',
    '  gl_FragColor = vec4( mix( bottomColor, topColor, (h + 1.0) / 2.0), 1.0 );',
    '}'
  ].join('\n')

  /**
   * @param scene - THREE.Scene to add skybox to
   * @param topColor - Top gradient color (hex number, e.g., 0xFFFFFF). Defaults to white.
   * @param bottomColor - Bottom gradient color (hex number, e.g., 0xF9F5F1). Defaults to cream white.
   */
  constructor(scene: THREE.Scene, topColor = 0xffffff, bottomColor = 0xf9f5f1) {
    this.scene = scene
    this.topColor = topColor
    this.bottomColor = bottomColor
    this.init()
  }

  private init(): void {
    const uniforms = {
      topColor: {
        type: 'c',
        value: new THREE.Color(this.topColor)
      },
      bottomColor: {
        type: 'c',
        value: new THREE.Color(this.bottomColor)
      },
      offset: {
        type: 'f',
        value: this.verticalOffset
      }
    }

    const skyGeo = new THREE.SphereGeometry(
      this.sphereRadius,
      this.widthSegments,
      this.heightSegments
    )
    const skyMat = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: uniforms,
      side: THREE.BackSide
    })

    const sky = new THREE.Mesh(skyGeo, skyMat)
    this.scene.add(sky)
  }
}

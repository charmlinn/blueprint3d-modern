import * as THREE from 'three'
import { Utils } from '../core/utils'
import type { HalfEdge } from '../model/half_edge'
import type { Controls } from './controls'

export class Edge {
  private readonly scene: THREE.Scene
  private readonly edge: HalfEdge
  private readonly controls: Controls
  private readonly renderer: THREE.WebGLRenderer
  private readonly wall
  private readonly front: boolean
  private planes: THREE.Mesh[] = []
  private basePlanes: THREE.Mesh[] = [] // always visible
  private texture: THREE.Texture | null = null
  private currentTextureUrl: string = ''
  private readonly textureLoader = new THREE.TextureLoader()
  private readonly lightMap: THREE.Texture
  // Brightened colors for Three.js r181
  private readonly fillerColor = 0xffffff
  private readonly sideColor = 0xeeeeee
  private readonly baseColor = 0xffffff

  public visible = false

  // Store bound function references for proper callback removal
  private readonly boundRedraw: () => void
  private readonly boundUpdateVisibility: () => void

  constructor(scene: THREE.Scene, edge: HalfEdge, controls: Controls, renderer: THREE.WebGLRenderer) {
    this.scene = scene
    this.edge = edge
    this.controls = controls
    this.renderer = renderer
    this.wall = edge.wall
    this.front = edge.front
    this.lightMap = this.textureLoader.load('https://cdn-images.lumenfeng.com/models-cover/walllightmap.png')
    this.lightMap.colorSpace = THREE.SRGBColorSpace

    // Bind functions once and store references
    this.boundRedraw = this.redraw.bind(this)
    this.boundUpdateVisibility = this.updateVisibility.bind(this)

    this.init()
  }

  public remove(): void {
    this.edge.redrawCallbacks.remove(this.boundRedraw)
    this.controls.cameraMovedCallbacks.remove(this.boundUpdateVisibility)
    this.removeFromScene()
  }

  private init(): void {
    this.edge.redrawCallbacks.add(this.boundRedraw)
    this.controls.cameraMovedCallbacks.add(this.boundUpdateVisibility)
    this.updateTexture()
    this.updatePlanes()
    this.addToScene()
  }

  private redraw(): void {
    this.removeFromScene()
    this.updateTexture()
    this.updatePlanes()
    this.addToScene()
  }

  private removeFromScene(): void {
    this.planes.forEach((plane) => {
      this.scene.remove(plane)
    })
    this.basePlanes.forEach((plane) => {
      this.scene.remove(plane)
    })
    this.planes = []
    this.basePlanes = []
  }

  private addToScene(): void {
    this.planes.forEach((plane) => {
      this.scene.add(plane)
    })
    this.basePlanes.forEach((plane) => {
      this.scene.add(plane)
    })
    this.updateVisibility()
  }

  private updateVisibility(): void {
    // finds the normal from the specified edge
    const start = this.edge.interiorStart()
    const end = this.edge.interiorEnd()
    const x = end.x - start.x
    const y = end.y - start.y
    // rotate 90 degrees CCW
    const normal = new THREE.Vector3(-y, 0, x)
    normal.normalize()

    // setup camera
    const position = this.controls.object.position.clone()
    const focus = new THREE.Vector3((start.x + end.x) / 2.0, 0, (start.y + end.y) / 2.0)
    const direction = position.sub(focus).normalize()

    // find dot
    const dot = normal.dot(direction)

    // update visible
    this.visible = dot >= 0

    // show or hide plans
    this.planes.forEach((plane) => {
      plane.visible = this.visible
    })

    this.updateObjectVisibility()
  }

  private updateObjectVisibility(): void {
    this.wall.items.forEach((item: any) => {
      item.updateEdgeVisibility(this.visible, this.front)
    })
    this.wall.onItems.forEach((item: any) => {
      item.updateEdgeVisibility(this.visible, this.front)
    })
  }

  private updateTexture(callback?: () => void): void {
    // callback is fired when texture loads
    const cb =
      callback ||
      (() => {
        ;(this.scene as any).needsUpdate = true
      })
    const textureData = this.edge.getTexture()
    const stretch = textureData.stretch
    const url = textureData.url
    const scale = textureData.scale

    // Only reload texture if URL has changed
    if (url !== this.currentTextureUrl) {
      this.currentTextureUrl = url
      const loader = new THREE.TextureLoader()
      this.texture = loader.load(url, cb)
      this.texture.colorSpace = THREE.SRGBColorSpace
      // Apply anisotropic filtering for sharper textures at angles
      this.texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
      this.texture.minFilter = THREE.LinearMipmapLinearFilter
      this.texture.magFilter = THREE.LinearFilter
    }

    // Always update texture parameters (stretch, scale, etc.)
    if (this.texture) {
      if (!stretch) {
        const height = this.wall.height
        const width = this.edge.interiorDistance()
        this.texture.wrapT = THREE.RepeatWrapping
        this.texture.wrapS = THREE.RepeatWrapping
        this.texture.repeat.set(width / scale, height / scale)
        this.texture.needsUpdate = true
      }
    }
  }

  private updatePlanes(): void {
    // Switched to MeshLambertMaterial for proper lighting interaction
    const wallMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
      map: this.texture,
      emissive: 0xffffff,       // Keeps walls bright
      emissiveIntensity: 0.3    // While showing depth from lighting
    })

    const fillerMaterial = new THREE.MeshBasicMaterial({
      color: this.fillerColor,
      side: THREE.DoubleSide,
      toneMapped: false
    })

    // exterior plane
    this.planes.push(
      this.makeWall(
        this.edge.exteriorStart(),
        this.edge.exteriorEnd(),
        this.edge.exteriorTransform,
        this.edge.invExteriorTransform,
        fillerMaterial
      )
    )

    // interior plane
    this.planes.push(
      this.makeWall(
        this.edge.interiorStart(),
        this.edge.interiorEnd(),
        this.edge.interiorTransform,
        this.edge.invInteriorTransform,
        wallMaterial
      )
    )

    // bottom
    // put into basePlanes since this is always visible
    this.basePlanes.push(this.buildFiller(this.edge, 0, THREE.BackSide, this.baseColor))

    // top
    this.planes.push(
      this.buildFiller(this.edge, this.wall.height, THREE.DoubleSide, this.fillerColor)
    )

    // sides
    this.planes.push(
      this.buildSideFillter(
        this.edge.interiorStart(),
        this.edge.exteriorStart(),
        this.wall.height,
        this.sideColor
      )
    )

    this.planes.push(
      this.buildSideFillter(
        this.edge.interiorEnd(),
        this.edge.exteriorEnd(),
        this.wall.height,
        this.sideColor
      )
    )
  }

  // start, end have x and y attributes (i.e. corners)
  private makeWall(
    start: { x: number; y: number },
    end: { x: number; y: number },
    transform: THREE.Matrix4,
    invTransform: THREE.Matrix4,
    material: THREE.Material
  ): THREE.Mesh {
    const v1 = this.toVec3(start)
    const v2 = this.toVec3(end)
    const v3 = v2.clone()
    v3.y = this.wall.height
    const v4 = v1.clone()
    v4.y = this.wall.height

    const points = [v1.clone(), v2.clone(), v3.clone(), v4.clone()]

    points.forEach((p) => {
      p.applyMatrix4(transform)
    })

    const shape = new THREE.Shape([
      new THREE.Vector2(points[0].x, points[0].y),
      new THREE.Vector2(points[1].x, points[1].y),
      new THREE.Vector2(points[2].x, points[2].y),
      new THREE.Vector2(points[3].x, points[3].y)
    ])

    // add holes for each wall item
    this.wall.items.forEach((item: any) => {
      const pos = item.position.clone()
      pos.applyMatrix4(transform)
      const halfSize = item.halfSize
      const min = halfSize.clone().multiplyScalar(-1)
      const max = halfSize.clone()
      min.add(pos)
      max.add(pos)

      const holePoints = [
        new THREE.Vector2(min.x, min.y),
        new THREE.Vector2(max.x, min.y),
        new THREE.Vector2(max.x, max.y),
        new THREE.Vector2(min.x, max.y)
      ]

      shape.holes.push(new THREE.Path(holePoints))
    })

    const geometry = new THREE.ShapeGeometry(shape)

    // Transform vertices
    geometry.applyMatrix4(invTransform)

    // make UVs
    const totalDistance = Utils.distance(v1.x, v1.z, v2.x, v2.z)
    const height = this.wall.height

    // Get position attribute
    const positionAttribute = geometry.getAttribute('position')
    const uvs: number[] = []

    // Calculate UVs based on vertex positions
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i)
      const y = positionAttribute.getY(i)
      const z = positionAttribute.getZ(i)

      const vertex = new THREE.Vector3(x, y, z)
      const u = Utils.distance(v1.x, v1.z, vertex.x, vertex.z) / totalDistance
      const v = vertex.y / height

      uvs.push(u, v)
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    // Compute vertex normals for proper lighting
    geometry.computeVertexNormals()

    // Normalize all normals to ensure consistent shading
    const normalAttribute = geometry.getAttribute('normal')
    for (let i = 0; i < normalAttribute.count; i++) {
      const normal = new THREE.Vector3(
        normalAttribute.getX(i),
        normalAttribute.getY(i),
        normalAttribute.getZ(i)
      )
      normal.normalize()
      normalAttribute.setXYZ(i, normal.x, normal.y, normal.z)
    }
    normalAttribute.needsUpdate = true

    const mesh = new THREE.Mesh(geometry, material)

    return mesh
  }

  private buildSideFillter(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    height: number,
    color: number
  ): THREE.Mesh {
    const points = [
      this.toVec3(p1),
      this.toVec3(p2),
      this.toVec3(p2, height),
      this.toVec3(p1, height)
    ]

    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array([
      points[0].x,
      points[0].y,
      points[0].z,
      points[1].x,
      points[1].y,
      points[1].z,
      points[2].x,
      points[2].y,
      points[2].z,
      points[0].x,
      points[0].y,
      points[0].z,
      points[2].x,
      points[2].y,
      points[2].z,
      points[3].x,
      points[3].y,
      points[3].z
    ])

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.computeVertexNormals()

    const fillerMaterial = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      toneMapped: false
    })

    const filler = new THREE.Mesh(geometry, fillerMaterial)
    return filler
  }

  private buildFiller(edge: HalfEdge, height: number, side: THREE.Side, color: number): THREE.Mesh {
    const points = [
      this.toVec2(edge.exteriorStart()),
      this.toVec2(edge.exteriorEnd()),
      this.toVec2(edge.interiorEnd()),
      this.toVec2(edge.interiorStart())
    ]

    const fillerMaterial = new THREE.MeshBasicMaterial({
      color: color,
      side: side,
      toneMapped: false
    })

    const shape = new THREE.Shape(points)
    const geometry = new THREE.ShapeGeometry(shape)

    const filler = new THREE.Mesh(geometry, fillerMaterial)
    filler.rotation.set(Math.PI / 2, 0, 0)
    filler.position.y = height
    return filler
  }

  private toVec2(pos: { x: number; y: number }): THREE.Vector2 {
    return new THREE.Vector2(pos.x, pos.y)
  }

  private toVec3(pos: { x: number; y: number }, height?: number): THREE.Vector3 {
    const h = height ?? 0
    return new THREE.Vector3(pos.x, h, pos.y)
  }
}

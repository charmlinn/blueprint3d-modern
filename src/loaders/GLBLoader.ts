import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * GLBLoader wrapper for loading GLB/GLTF models with Draco compression support.
 * Provides a similar interface to JSONLoader for easy migration.
 */
export class GLBLoader {
  private loader: GLTFLoader
  private dracoLoader: DRACOLoader
  private manager: THREE.LoadingManager

  constructor(manager?: THREE.LoadingManager) {
    this.manager = manager || THREE.DefaultLoadingManager

    // Initialize Draco loader
    this.dracoLoader = new DRACOLoader(this.manager)
    this.dracoLoader.setDecoderPath('/draco/')

    // Initialize GLTF loader with Draco support
    this.loader = new GLTFLoader(this.manager)
    this.loader.setDRACOLoader(this.dracoLoader)
  }

  /**
   * Load a GLB/GLTF file and extract geometry and materials.
   * Interface matches JSONLoader for compatibility with existing code.
   */
  load(
    url: string,
    onLoad: (geometry: THREE.BufferGeometry, materials: THREE.Material[]) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: Error) => void
  ): void {
    this.manager.itemStart(url)

    this.loader.load(
      url,
      (gltf) => {
        try {
          const { geometry, materials } = this.extractGeometryAndMaterials(gltf)
          onLoad(geometry, materials)
          this.manager.itemEnd(url)
        } catch (e) {
          console.error('GLBLoader extraction error:', e)
          if (onError) {
            onError(e as Error)
          }
          this.manager.itemError(url)
          this.manager.itemEnd(url)
        }
      },
      onProgress as (event: ProgressEvent<EventTarget>) => void,
      (error: unknown) => {
        console.error('GLBLoader load error:', error)
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)))
        }
        this.manager.itemError(url)
        this.manager.itemEnd(url)
      }
    )
  }

  /**
   * Extract merged geometry and materials from GLTF scene.
   * GLB models may contain multiple meshes, so we merge them.
   */
  private extractGeometryAndMaterials(gltf: { scene: THREE.Group }): {
    geometry: THREE.BufferGeometry
    materials: THREE.Material[]
  } {
    const geometries: THREE.BufferGeometry[] = []
    const materials: THREE.Material[] = []
    const materialMap = new Map<THREE.Material, number>()

    // Traverse the scene to find all meshes
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mesh = child as THREE.Mesh

        // Clone and apply world transform to geometry
        const geom = mesh.geometry.clone()
        mesh.updateWorldMatrix(true, false)
        geom.applyMatrix4(mesh.matrixWorld)

        // Handle materials (single or array)
        const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

        // Update geometry groups to use correct material indices
        if (geom.groups.length === 0) {
          // No groups defined, create one for the entire geometry
          const matIndex = this.getOrAddMaterial(meshMaterials[0], materials, materialMap)
          geom.addGroup(0, geom.index ? geom.index.count : geom.attributes.position.count, matIndex)
        } else {
          // Update existing group material indices
          for (const group of geom.groups) {
            const originalMat = meshMaterials[group.materialIndex || 0]
            group.materialIndex = this.getOrAddMaterial(originalMat, materials, materialMap)
          }
        }

        geometries.push(geom)
      }
    })

    if (geometries.length === 0) {
      throw new Error('No meshes found in GLB file')
    }

    // Merge all geometries
    let mergedGeometry: THREE.BufferGeometry

    if (geometries.length === 1) {
      mergedGeometry = geometries[0]
    } else {
      mergedGeometry = this.mergeGeometries(geometries)
    }

    // Scale from meters to centimeters (GLB typically uses meters, this project uses cm)
    // Apply scale factor of 100 to convert m -> cm
    const scaleFactor = 100
    mergedGeometry.scale(scaleFactor, scaleFactor, scaleFactor)

    // Ensure bounding box and sphere are computed
    mergedGeometry.computeBoundingBox()
    mergedGeometry.computeBoundingSphere()

    // Configure materials for visibility and convert to MeshPhongMaterial if needed
    const processedMaterials = materials.map((mat) => {
      // Convert MeshStandardMaterial to MeshPhongMaterial for better compatibility
      // with the existing lighting setup (no environment map)
      if (mat instanceof THREE.MeshStandardMaterial) {
        const phongMat = new THREE.MeshPhongMaterial({
          color: mat.color,
          map: mat.map,
          normalMap: mat.normalMap,
          emissive: mat.emissive,
          emissiveMap: mat.emissiveMap,
          emissiveIntensity: mat.emissiveIntensity,
          specular: new THREE.Color(0x222222),  // Very subtle specular to avoid moiré
          shininess: 5,  // Very matte finish
          side: THREE.DoubleSide,
          transparent: mat.transparent,
          opacity: mat.opacity,
          alphaTest: mat.alphaTest
        })

        // Copy texture properties
        if (mat.map) {
          phongMat.map = mat.map
        }

        return phongMat
      }

      // For other materials, just configure side and depth
      mat.side = THREE.DoubleSide
      mat.depthTest = true
      mat.depthWrite = true
      return mat
    })

    return { geometry: mergedGeometry, materials: processedMaterials }
  }

  /**
   * Get existing material index or add new material to array.
   */
  private getOrAddMaterial(
    material: THREE.Material,
    materials: THREE.Material[],
    materialMap: Map<THREE.Material, number>
  ): number {
    if (materialMap.has(material)) {
      return materialMap.get(material)!
    }
    const index = materials.length
    materials.push(material)
    materialMap.set(material, index)
    return index
  }

  /**
   * Merge multiple geometries into one, preserving material groups.
   */
  private mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
    const merged = new THREE.BufferGeometry()

    // Collect all attributes
    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    const groups: { start: number; count: number; materialIndex: number }[] = []

    let indexOffset = 0
    let vertexOffset = 0

    for (const geom of geometries) {
      const posAttr = geom.attributes.position
      const normAttr = geom.attributes.normal
      const uvAttr = geom.attributes.uv

      // Add positions
      for (let i = 0; i < posAttr.count; i++) {
        positions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
      }

      // Add normals
      if (normAttr) {
        for (let i = 0; i < normAttr.count; i++) {
          normals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i))
        }
      }

      // Add UVs
      if (uvAttr) {
        for (let i = 0; i < uvAttr.count; i++) {
          uvs.push(uvAttr.getX(i), uvAttr.getY(i))
        }
      }

      // Add indices with offset
      if (geom.index) {
        const indexArray = geom.index.array
        for (let i = 0; i < indexArray.length; i++) {
          indices.push(indexArray[i] + vertexOffset)
        }
      } else {
        // Generate indices for non-indexed geometry
        for (let i = 0; i < posAttr.count; i++) {
          indices.push(i + vertexOffset)
        }
      }

      // Add groups with offset
      for (const group of geom.groups) {
        groups.push({
          start: group.start + indexOffset,
          count: group.count,
          materialIndex: group.materialIndex || 0
        })
      }

      indexOffset += geom.index ? geom.index.count : posAttr.count
      vertexOffset += posAttr.count
    }

    // Set attributes
    merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    if (normals.length > 0) {
      merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    }
    if (uvs.length > 0) {
      merged.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    }
    merged.setIndex(indices)

    // Set groups
    for (const group of groups) {
      merged.addGroup(group.start, group.count, group.materialIndex)
    }

    return merged
  }

  /**
   * Dispose of the Draco loader to free resources.
   */
  dispose(): void {
    this.dracoLoader.dispose()
  }
}

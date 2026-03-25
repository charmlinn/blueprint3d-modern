/**
 * IndexedDB utility for Blueprint3D template storage
 * Stores selected template data for seamless navigation between pages
 */

import { SavedFloorplan } from "../model/floorplan"
import { SerializedItem } from "../model/model"

export interface Blueprint3DTemplate {
  floorplan: SavedFloorplan
  items: SerializedItem[]
}

export interface BedSize {
  width: number  // cm
  length: number // cm
  unit: 'cm' | 'm'
}

const DB_NAME = 'blueprint3d_templates'
const DB_VERSION = 1
const STORE_NAME = 'selected_template'

class Blueprint3DTemplateDB {
  private db: IDBDatabase | null = null

  /**
   * Initialize IndexedDB connection
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
    })
  }

  /**
   * Save template to IndexedDB
   */
  async saveTemplate(template: Blueprint3DTemplate): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put({
        id: 'current',
        template,
        timestamp: Date.now()
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Get template from IndexedDB
   */
  async getTemplate(): Promise<Blueprint3DTemplate | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get('current')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.template : null)
      }
    })
  }

  /**
   * Clear template from IndexedDB
   */
  async clearTemplate(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete('current')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Save bed size to IndexedDB
   */
  async saveBedSize(bedSize: BedSize): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put({
        id: 'bed_size',
        bedSize,
        timestamp: Date.now()
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Get bed size from IndexedDB
   */
  async getBedSize(): Promise<BedSize | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get('bed_size')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.bedSize : null)
      }
    })
  }

  /**
   * Clear bed size from IndexedDB
   */
  async clearBedSize(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete('bed_size')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

// Singleton instance
export const blueprintTemplateDB = new Blueprint3DTemplateDB()

/**
 * IndexedDB-based storage service for floorplans
 * Replaces API-based blueprintService for the open-source demo
 */
import { RoomType } from '@blueprint3d/types/room_types'
import type { BlueprintListItem, BlueprintDetail, BlueprintPayload } from '@/types/blueprint'

const DB_NAME = 'blueprint3d_floorplans'
const STORE_NAME = 'floorplans'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('roomType', 'roomType', { unique: false })
        store.createIndex('updatedAt', 'updatedAt', { unique: false })
        store.createIndex('name', 'name', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export interface ListOptions {
  roomType?: RoomType | 'all'
  search?: string
  sort?: 'newest' | 'oldest' | 'name'
}

async function list(options: ListOptions = {}): Promise<BlueprintListItem[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      let results: BlueprintDetail[] = request.result

      // Filter by room type
      if (options.roomType && options.roomType !== 'all') {
        results = results.filter((r) => r.roomType === options.roomType)
      }

      // Filter by search
      if (options.search) {
        const q = options.search.toLowerCase()
        results = results.filter((r) => r.name.toLowerCase().includes(q))
      }

      // Sort
      const sort = options.sort || 'newest'
      if (sort === 'newest') {
        results.sort((a, b) => b.updatedAt - a.updatedAt)
      } else if (sort === 'oldest') {
        results.sort((a, b) => a.updatedAt - b.updatedAt)
      } else if (sort === 'name') {
        results.sort((a, b) => a.name.localeCompare(b.name))
      }

      // Return list items (without heavy layoutData)
      resolve(
        results.map(({ layoutData: _ld, layoutDataSimple: _lds, ...item }) => item)
      )
    }
    request.onerror = () => reject(request.error)
  })
}

async function get(id: string): Promise<BlueprintDetail | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
}

async function create(payload: BlueprintPayload): Promise<BlueprintDetail> {
  const db = await openDB()
  const now = Math.floor(Date.now() / 1000)
  const record: BlueprintDetail = {
    id: generateId(),
    name: payload.name,
    description: payload.description ?? null,
    thumbnailUrl: payload.thumbnailBase64 ?? null,
    previewCleanUrl: payload.thumbnailBase64 ?? null,
    roomType: payload.roomType ?? RoomType.BEDROOM,
    layoutData: payload.layoutData,
    layoutDataSimple: null,
    createdAt: now,
    updatedAt: now
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.add(record)

    request.onsuccess = () => resolve(record)
    request.onerror = () => reject(request.error)
  })
}

async function update(
  id: string,
  partial: Partial<BlueprintPayload>
): Promise<BlueprintDetail> {
  const db = await openDB()
  const existing = await get(id)
  if (!existing) throw new Error(`Blueprint ${id} not found`)

  const now = Math.floor(Date.now() / 1000)
  const updated: BlueprintDetail = {
    ...existing,
    name: partial.name ?? existing.name,
    description: partial.description ?? existing.description,
    thumbnailUrl: partial.thumbnailBase64 ?? existing.thumbnailUrl,
    previewCleanUrl: partial.thumbnailBase64 ?? existing.previewCleanUrl,
    roomType: partial.roomType ?? existing.roomType,
    layoutData: partial.layoutData ?? existing.layoutData,
    updatedAt: now
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(updated)

    request.onsuccess = () => resolve(updated)
    request.onerror = () => reject(request.error)
  })
}

async function remove(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const blueprintStorage = { list, get, create, update, delete: remove }

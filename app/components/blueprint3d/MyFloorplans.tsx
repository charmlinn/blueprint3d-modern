'use client'

import { useEffect, useState } from 'react'
import { Trash2, FolderOpen, Grid3x3, List, MoreVertical, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { blueprintStorage } from '@/services/storage'
import type { BlueprintListItem } from '@/types/blueprint'
import { RoomType } from '@blueprint3d/types/room_types'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface MyFloorplansProps {
  onLoadFloorplan: (data: string, roomType?: RoomType, id?: string, name?: string) => void
}

type ViewMode = 'grid' | 'list'

export function MyFloorplans({ onLoadFloorplan }: MyFloorplansProps) {
  const locale = useLocale()
  const t = useTranslations('BluePrint.myFloorplans')
  const [floorplans, setFloorplans] = useState<BlueprintListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedRoomType, setSelectedRoomType] = useState<string>('all')

  useEffect(() => {
    loadFloorplans()
  }, [])

  const loadFloorplans = async () => {
    try {
      const results = await blueprintStorage.list({ sort: 'newest' })
      setFloorplans(results)
    } catch (error) {
      console.error('Failed to load floorplans:', error)
      setFloorplans([])
    } finally {
      setLoading(false)
    }
  }

  const handleLoad = async (id: string, name: string) => {
    const toastId = toast.loading(t('loadingItem', { name }))
    try {
      const result = await blueprintStorage.get(id)
      if (!result) {
        toast.error(t('loadNotFound'), { id: toastId })
        return
      }
      onLoadFloorplan(
        JSON.stringify(result.layoutData),
        result.roomType || RoomType.BEDROOM,
        id,
        name
      )
      toast.success(t('loadedSuccess', { name }), { id: toastId })
    } catch (error) {
      console.error('Failed to load floorplan:', error)
      toast.error(t('loadError'), { id: toastId })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t('deleteConfirm'))) return
    const toastId = toast.loading(t('deletingItem', { name }))
    try {
      await blueprintStorage.delete(id)
      await loadFloorplans()
      toast.success(t('deleteSuccess', { name }), { id: toastId })
    } catch (error) {
      console.error('Failed to delete floorplan:', error)
      toast.error(t('deleteError') || 'Failed to delete floorplan', { id: toastId })
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{t('loading')}</div>
      </div>
    )
  }

  if (floorplans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FolderOpen className="h-16 w-16 text-muted mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">{t('noFloorplans')}</h3>
        <p className="text-sm text-muted-foreground">{t('saveFirst')}</p>
      </div>
    )
  }

  const filteredFloorplans =
    selectedRoomType === 'all'
      ? floorplans
      : floorplans.filter((fp) => fp.roomType === selectedRoomType)

  const roomTypes = Array.from(
    new Set(floorplans.map((fp) => fp.roomType).filter(Boolean))
  ) as RoomType[]

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-3">
        <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filterAll') || 'All Rooms'}</SelectItem>
            {roomTypes.map((roomType) => (
              <SelectItem key={roomType} value={roomType}>
                {t(`roomTypes.${roomType}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1 border border-border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
            title={t('gridView') || 'Grid View'}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
            title={t('listView') || 'List View'}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {t('savedCount', { count: filteredFloorplans.length })}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 gap-3">
          {filteredFloorplans.map((floorplan) => (
            <div
              key={floorplan.id}
              className="group relative border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-card cursor-pointer"
              onClick={() => handleLoad(floorplan.id, floorplan.name)}
            >
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLoad(floorplan.id, floorplan.name)
                      }}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      {t('editButton') || 'Edit'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(floorplan.id, floorplan.name)
                      }}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('deleteButton') || 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Thumbnail */}
              {floorplan.thumbnailUrl ? (
                <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: '3/2' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={floorplan.thumbnailUrl}
                    alt={floorplan.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {floorplan.roomType && (
                    <span className="absolute top-2 left-2 text-xs px-2 py-1 bg-primary/90 text-primary-foreground rounded-full backdrop-blur-sm">
                      {t(`roomTypes.${floorplan.roomType}`)}
                    </span>
                  )}
                </div>
              ) : (
                <div
                  className="bg-muted flex items-center justify-center"
                  style={{ aspectRatio: '3/2' }}
                >
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              <div className="p-2">
                <h3 className="font-medium text-sm text-foreground truncate">{floorplan.name}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(floorplan.updatedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {filteredFloorplans.map((floorplan) => (
            <div
              key={floorplan.id}
              className="group flex items-center gap-3 border border-border rounded-lg p-3 hover:shadow-md transition-all duration-200 bg-card cursor-pointer"
              onClick={() => handleLoad(floorplan.id, floorplan.name)}
            >
              <div className="flex-shrink-0">
                {floorplan.thumbnailUrl ? (
                  <div className="w-16 h-16 rounded overflow-hidden bg-muted relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={floorplan.thumbnailUrl}
                      alt={floorplan.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">{floorplan.name}</h3>
                  {floorplan.roomType && (
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full whitespace-nowrap flex-shrink-0">
                      {t(`roomTypes.${floorplan.roomType}`)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('lastModified')}: {formatDate(floorplan.updatedAt)}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      handleLoad(floorplan.id, floorplan.name)
                    }}
                    className="cursor-pointer"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    {t('editButton') || 'Edit'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      handleDelete(floorplan.id, floorplan.name)
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('deleteButton') || 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

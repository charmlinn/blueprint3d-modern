'use client'

import { RoomType } from '@blueprint3d/types/room_types'
import { MyFloorplans } from './MyFloorplans'

interface ProjectsViewProps {
  onBlueprintLoad: (layoutData: string, roomType: RoomType, id?: string, name?: string) => void
}

export function ProjectsView({ onBlueprintLoad }: ProjectsViewProps) {

  return (
    <div className="h-full w-full bg-card overflow-hidden flex flex-col">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 px-6 pt-14 pb-3 text-sm text-muted-foreground border-b">

      </div>

      {/* Blueprint List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <MyFloorplans
          onLoadFloorplan={(data, roomType, id, name) =>
            onBlueprintLoad(data, roomType ?? RoomType.BEDROOM, id, name)
          }
        />
      </div>
    </div>
  )
}

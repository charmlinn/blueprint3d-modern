import { Floorplan } from '../model/floorplan'
import { Wall } from '../model/wall'
import { Corner } from '../model/corner'
import { Room } from '../model/room'
import { HalfEdge } from '../model/half_edge'
import { Dimensioning } from '../core/dimensioning'
import { Utils } from '../core/utils'
import type { Floorplanner } from './floorplanner'

/** */
export const floorplannerModes = {
  MOVE: 0,
  DRAW: 1,
  DELETE: 2
}

// grid parameters
const gridSpacing = 20 // pixels

// corner config
const cornerRadius = 0
const cornerRadiusHover = 7

/** Theme color palette for the 2D floorplan canvas */
interface FloorplanColors {
  grid: string
  room: string
  wallNormal: string
  wallHover: string
  wallWidthNormal: number
  wallWidthHover: number
  edge: string
  edgeHover: string
  delete: string
  corner: string
  cornerHover: string
  labelFill: string
  labelStroke: string
  target: string
}

const DARK_COLORS: FloorplanColors = {
  grid: 'rgba(184,149,90,0.16)',
  room: '#1A1D2C',
  wallNormal: '#5A6B8A',
  wallHover: '#C8A870',
  wallWidthNormal: 5,
  wallWidthHover: 7,
  edge: '#3A4860',
  edgeHover: '#C8A870',
  delete: '#A04040',
  corner: '#4E6178',
  cornerHover: '#C8A870',
  labelFill: '#C8A870',
  labelStroke: '#0A0A0F',
  target: '#C8A870',
}

const LIGHT_COLORS: FloorplanColors = {
  grid: 'rgba(46,59,76,0.12)',
  room: '#E8E3D8',
  wallNormal: '#6A8090',
  wallHover: '#2E3B4C',
  wallWidthNormal: 5,
  wallWidthHover: 7,
  edge: '#9AB0BC',
  edgeHover: '#2E3B4C',
  delete: '#9E4444',
  corner: '#7A96A8',
  cornerHover: '#2E3B4C',
  labelFill: '#3A4C5E',
  labelStroke: '#F5F1E8',
  target: '#2E3B4C',
}

/**
 * The View to be used by a Floorplanner to render in/interact with.
 */
export class FloorplannerView {
  /** The canvas element. */
  private canvasElement: HTMLCanvasElement

  /** The 2D context. */
  private context: CanvasRenderingContext2D

  /** Resize handler reference for cleanup */
  private resizeHandler: () => void

  /** Active color palette */
  private colors: FloorplanColors = DARK_COLORS

  /** Item rects for 2D overlay (position & size in cm, angle in radians) */
  private itemRects: Array<{x: number, z: number, w: number, d: number, angle: number, name: string}> = []

  /** */
  constructor(
    private floorplan: Floorplan,
    private viewmodel: Floorplanner,
    private canvas: string
  ) {
    this.canvasElement = document.getElementById(canvas) as HTMLCanvasElement
    this.context = this.canvasElement.getContext('2d') as CanvasRenderingContext2D

    this.resizeHandler = () => { this.handleWindowResize() }
    window.addEventListener('resize', this.resizeHandler)
    this.handleWindowResize()
  }

  public setTheme(isLight: boolean): void {
    this.colors = isLight ? LIGHT_COLORS : DARK_COLORS
    this.draw()
  }

  public destroy() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
  }

  /** */
  public handleWindowResize() {
    const canvasElement = document.getElementById(this.canvas) as HTMLCanvasElement
    if (!canvasElement) {
      console.warn('Canvas element not found:', this.canvas)
      return
    }
    const parent = canvasElement.parentElement
    if (parent) {
      const parentHeight = parent.clientHeight
      const parentWidth = parent.clientWidth
      canvasElement.style.height = parentHeight + 'px'
      canvasElement.style.width = parentWidth + 'px'
      this.canvasElement.height = parentHeight
      this.canvasElement.width = parentWidth
    }
    this.draw()
  }

  public updateItemRects(rects: Array<{x: number, z: number, w: number, d: number, angle: number, name: string}>): void {
    this.itemRects = rects
    this.draw()
  }

  /** */
  public draw() {
    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
    this.drawGrid()

    this.floorplan.getRooms().forEach((room) => { this.drawRoom(room) })
    this.floorplan.getWalls().forEach((wall) => { this.drawWall(wall) })
    this.floorplan.getCorners().forEach((corner) => { this.drawCorner(corner) })

    if (this.viewmodel.mode == floorplannerModes.DRAW) {
      this.drawTarget(this.viewmodel.targetX, this.viewmodel.targetY, this.viewmodel.lastNode)
    }

    this.floorplan.getWalls().forEach((wall) => { this.drawWallLabels(wall) })
    this.drawItems()
  }

  private drawItems(): void {
    if (!this.itemRects.length) return
    const ppcm = this.viewmodel.convertX(1) - this.viewmodel.convertX(0)
    this.itemRects.forEach(r => {
      const cx = this.viewmodel.convertX(r.x)
      const cy = this.viewmodel.convertY(r.z)
      const pw = r.w * ppcm
      const pd = r.d * ppcm
      this.context.save()
      this.context.translate(cx, cy)
      this.context.rotate(-r.angle)
      this.context.globalAlpha = 0.09
      this.context.fillStyle = this.colors.labelFill
      this.context.fillRect(-pw / 2, -pd / 2, pw, pd)
      this.context.globalAlpha = 0.65
      this.context.strokeStyle = this.colors.labelFill
      this.context.lineWidth = 1.5
      this.context.setLineDash([4, 3])
      this.context.strokeRect(-pw / 2, -pd / 2, pw, pd)
      this.context.setLineDash([])
      this.context.globalAlpha = 1
      if (pw > 28 && pd > 14) {
        this.context.fillStyle = this.colors.labelFill
        this.context.font = '10px "SF Mono", "Fira Code", monospace'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.fillText(r.name.slice(0, 6), 0, 0)
      }
      this.context.restore()
    })
  }

  /** */
  private drawWallLabels(wall: Wall) {
    if (wall.backEdge && wall.frontEdge) {
      if (wall.backEdge.interiorDistance() < wall.frontEdge.interiorDistance()) {
        this.drawEdgeLabel(wall.backEdge)
      } else {
        this.drawEdgeLabel(wall.frontEdge)
      }
    } else if (wall.backEdge) {
      this.drawEdgeLabel(wall.backEdge)
    } else if (wall.frontEdge) {
      this.drawEdgeLabel(wall.frontEdge)
    }
  }

  /** */
  private drawWall(wall: Wall) {
    const hover = wall === this.viewmodel.activeWall
    let color = this.colors.wallNormal
    if (hover && this.viewmodel.mode == floorplannerModes.DELETE) {
      color = this.colors.delete
    } else if (hover) {
      color = this.colors.wallHover
    }
    this.drawLine(
      this.viewmodel.convertX(wall.getStartX()),
      this.viewmodel.convertY(wall.getStartY()),
      this.viewmodel.convertX(wall.getEndX()),
      this.viewmodel.convertY(wall.getEndY()),
      hover ? this.colors.wallWidthHover : this.colors.wallWidthNormal,
      color
    )
    if (!hover && wall.frontEdge) { this.drawEdge(wall.frontEdge, hover) }
    if (!hover && wall.backEdge) { this.drawEdge(wall.backEdge, hover) }
  }

  /** */
  private drawEdgeLabel(edge: HalfEdge) {
    const pos = edge.interiorCenter()
    const length = edge.interiorDistance()
    if (length < 60) return
    this.context.font = '10px "SF Mono", "Fira Code", monospace'
    this.context.fillStyle = this.colors.labelFill
    this.context.textBaseline = 'middle'
    this.context.textAlign = 'center'
    this.context.strokeStyle = this.colors.labelStroke
    this.context.lineWidth = 4
    this.context.strokeText(
      Dimensioning.cmToMeasure(length),
      this.viewmodel.convertX(pos.x),
      this.viewmodel.convertY(pos.y)
    )
    this.context.fillText(
      Dimensioning.cmToMeasure(length),
      this.viewmodel.convertX(pos.x),
      this.viewmodel.convertY(pos.y)
    )
  }

  /** */
  private drawEdge(edge: HalfEdge, hover: boolean) {
    let color = this.colors.edge
    if (hover && this.viewmodel.mode == floorplannerModes.DELETE) {
      color = this.colors.delete
    } else if (hover) {
      color = this.colors.edgeHover
    }
    const corners = edge.corners()
    this.drawPolygon(
      Utils.map(corners, (corner) => this.viewmodel.convertX(corner.x)),
      Utils.map(corners, (corner) => this.viewmodel.convertY(corner.y)),
      false, null, true, color, 1
    )
  }

  /** */
  private drawRoom(room: Room) {
    this.drawPolygon(
      Utils.map(room.corners, (corner: Corner) => this.viewmodel.convertX(corner.x)),
      Utils.map(room.corners, (corner: Corner) => this.viewmodel.convertY(corner.y)),
      true, this.colors.room
    )
  }

  /** */
  private drawCorner(corner: Corner) {
    const hover = corner === this.viewmodel.activeCorner
    let color = this.colors.corner
    if (hover && this.viewmodel.mode == floorplannerModes.DELETE) {
      color = this.colors.delete
    } else if (hover) {
      color = this.colors.cornerHover
    }
    this.drawCircle(
      this.viewmodel.convertX(corner.x),
      this.viewmodel.convertY(corner.y),
      hover ? cornerRadiusHover : cornerRadius,
      color
    )
  }

  /** */
  private drawTarget(x: number, y: number, lastNode: Corner | null) {
    this.drawCircle(
      this.viewmodel.convertX(x),
      this.viewmodel.convertY(y),
      cornerRadiusHover,
      this.colors.target
    )
    if (this.viewmodel.lastNode) {
      this.drawLine(
        this.viewmodel.convertX(lastNode!.x),
        this.viewmodel.convertY(lastNode!.y),
        this.viewmodel.convertX(x),
        this.viewmodel.convertY(y),
        this.colors.wallWidthHover,
        this.colors.wallHover
      )
    }
  }

  /** */
  private drawLine(startX: number, startY: number, endX: number, endY: number, width: number, color: string) {
    this.context.beginPath()
    this.context.moveTo(startX, startY)
    this.context.lineTo(endX, endY)
    this.context.lineWidth = width
    this.context.strokeStyle = color
    this.context.stroke()
  }

  /** */
  private drawPolygon(
    xArr: number[], yArr: number[],
    fill?: boolean, fillColor?: string | null,
    stroke?: boolean, strokeColor?: string, strokeWidth?: number
  ) {
    fill = fill || false
    stroke = stroke || false
    this.context.beginPath()
    this.context.moveTo(xArr[0], yArr[0])
    for (let i = 1; i < xArr.length; i++) { this.context.lineTo(xArr[i], yArr[i]) }
    this.context.closePath()
    if (fill && fillColor) {
      this.context.fillStyle = fillColor
      this.context.fill()
    }
    if (stroke && strokeColor) {
      this.context.lineWidth = strokeWidth!
      this.context.strokeStyle = strokeColor
      this.context.stroke()
    }
  }

  /** */
  private drawCircle(centerX: number, centerY: number, radius: number, fillColor: string) {
    this.context.beginPath()
    this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    this.context.fillStyle = fillColor
    this.context.fill()
  }

  /** returns n where -gridSize/2 < n <= gridSize/2 */
  private calculateGridOffset(n: number): number {
    if (n >= 0) {
      return ((n + gridSpacing / 2.0) % gridSpacing) - gridSpacing / 2.0
    } else {
      return ((n - gridSpacing / 2.0) % gridSpacing) + gridSpacing / 2.0
    }
  }

  /** */
  private drawGrid() {
    const offsetX = this.calculateGridOffset(-this.viewmodel.originX)
    const offsetY = this.calculateGridOffset(-this.viewmodel.originY)
    const width = this.canvasElement.width
    const height = this.canvasElement.height
    for (let x = 0; x <= width / gridSpacing; x++) {
      this.drawLine(gridSpacing * x + offsetX, 0, gridSpacing * x + offsetX, height, 1, this.colors.grid)
    }
    for (let y = 0; y <= height / gridSpacing; y++) {
      this.drawLine(0, gridSpacing * y + offsetY, width, gridSpacing * y + offsetY, 1, this.colors.grid)
    }
  }
}

/**
This file is a modified version of THREE.OrbitControls
Contributors:
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

import * as THREE from 'three'
import { EventEmitter } from '../core/events'

enum STATE {
  NONE = -1,
  ROTATE = 0,
  DOLLY = 1,
  PAN = 2,
  TOUCH_ROTATE = 3,
  TOUCH_DOLLY = 4,
  TOUCH_PAN = 5
}

export class Controls {
  public object: THREE.Camera
  public domElement: HTMLElement | Document

  // Set to false to disable this control
  public enabled = true

  // "target" sets the location of focus, where the control orbits around
  // and where it pans with respect to.
  public target = new THREE.Vector3()
  // center is old, deprecated; use "target" instead
  public center = this.target

  // This option actually enables dollying in and out; left as "zoom" for
  // backwards compatibility
  public noZoom = false
  public zoomSpeed = 1.0
  // Limits to how far you can dolly in and out
  public minDistance = 0
  public maxDistance = 1500 //Infinity;

  // Enable/disable wheel zoom (for controlling page scroll vs zoom behavior)
  public enableWheelZoom = true

  // Mobile touch: allow page scroll with single finger vertical swipe
  // Note: Single finger touch is primarily handled by Controller for object interaction
  // Controls only handles camera rotation when no object is being manipulated
  public allowPageScroll = true
  private touchStartY = 0
  private touchStartX = 0
  private touchMoveThreshold = 15 // pixels to move before deciding if it's a 3D interaction (increased for better detection)

  // Set to true to disable this control
  public noRotate = false
  public rotateSpeed = 0.5  // Reduced for more controlled, fluid rotation

  // Set to true to disable this control
  public noPan = false
  public keyPanSpeed = 40.0 // pixels moved per arrow key push

  // Set to true to automatically rotate around the target
  public autoRotate = false
  public autoRotateSpeed = 2.0 // 30 seconds per round when fps is 60

  // How far you can orbit vertically, upper and lower limits.
  // Range is 0 to Math.PI radians.
  public minPolarAngle = 0 // radians
  public maxPolarAngle = Math.PI / 2 // radians

  // Set to true to disable use of the keys
  public noKeys = false
  // The four arrow keys
  public keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }

  public cameraMovedCallbacks = new EventEmitter()

  public needsUpdate = true

  // internals
  private readonly EPS = 0.000001

  private rotateStart = new THREE.Vector2()
  private rotateEnd = new THREE.Vector2()
  private rotateDelta = new THREE.Vector2()

  private panStart = new THREE.Vector2()
  private panEnd = new THREE.Vector2()
  private panDelta = new THREE.Vector2()

  private dollyStart = new THREE.Vector2()
  private dollyEnd = new THREE.Vector2()
  private dollyDelta = new THREE.Vector2()

  private phiDelta = 0
  private thetaDelta = 0
  private scale = 1
  private panVector = new THREE.Vector3()
  private state = STATE.NONE

  constructor(object: THREE.Camera, domElement?: HTMLElement | Document, enableWheelZoom = true) {
    this.object = object
    this.domElement = domElement !== undefined ? domElement : document
    this.enableWheelZoom = enableWheelZoom

    // Respect prefers-reduced-motion for accessibility
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        this.rotateSpeed = 0.3  // Even slower for reduced motion
        this.autoRotateSpeed = 0.5  // Reduce auto-rotation speed
      }
    }

    this.domElement.addEventListener('contextmenu', (event) => event.preventDefault(), false)
    this.domElement.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this) as EventListener,
      false
    )
    this.domElement.addEventListener(
      'mousewheel',
      this.onMouseWheel.bind(this) as EventListener,
      false
    )
    this.domElement.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), false) // firefox
    this.domElement.addEventListener(
      'touchstart',
      this.touchstart.bind(this) as EventListener,
      false
    )
    this.domElement.addEventListener('touchend', this.touchend.bind(this) as EventListener, false)
    this.domElement.addEventListener('touchmove', this.touchmove.bind(this) as EventListener, false)

    window.addEventListener('keydown', this.onKeyDown.bind(this), false)
  }

  public controlsActive(): boolean {
    return this.state === STATE.NONE
  }

  public setPan(vec3: THREE.Vector3): void {
    this.panVector = vec3
  }

  public panTo(vec3: THREE.Vector3): void {
    const newTarget = new THREE.Vector3(vec3.x, this.target.y, vec3.z)
    const delta = this.target.clone().sub(newTarget)
    this.panVector.sub(delta)
    this.update()
  }

  public rotateLeft(angle?: number): void {
    if (angle === undefined) {
      angle = this.getAutoRotationAngle()
    }
    this.thetaDelta -= angle
  }

  public rotateUp(angle?: number): void {
    if (angle === undefined) {
      angle = this.getAutoRotationAngle()
    }
    this.phiDelta -= angle
  }

  // pass in distance in world space to move left
  public panLeft(distance: number): void {
    const panOffset = new THREE.Vector3()
    const te = this.object.matrix.elements
    // get X column of matrix
    panOffset.set(te[0], 0, te[2])
    panOffset.normalize()

    panOffset.multiplyScalar(-distance)

    this.panVector.add(panOffset)
  }

  // pass in distance in world space to move up
  public panUp(distance: number): void {
    const panOffset = new THREE.Vector3()
    const te = this.object.matrix.elements
    // get Y column of matrix
    panOffset.set(te[4], 0, te[6])
    panOffset.normalize()
    panOffset.multiplyScalar(distance)

    this.panVector.add(panOffset)
  }

  // main entry point; pass in Vector2 of change desired in pixel space,
  // right and down are positive
  public pan(delta: THREE.Vector2): void {
    const element =
      this.domElement === document
        ? (this.domElement as Document).body
        : (this.domElement as HTMLElement)

    if ('fov' in this.object) {
      // perspective
      const perspectiveCamera = this.object as THREE.PerspectiveCamera
      const position = perspectiveCamera.position
      const offset = position.clone().sub(this.target)
      let targetDistance = offset.length()

      // half of the fov is center to top of screen
      targetDistance *= Math.tan(((perspectiveCamera.fov / 2) * Math.PI) / 180.0)
      // we actually don't use screenWidth, since perspective camera is fixed to screen height
      this.panLeft((2 * delta.x * targetDistance) / element.clientHeight)
      this.panUp((2 * delta.y * targetDistance) / element.clientHeight)
    } else if ('top' in this.object) {
      // orthographic
      const orthoCamera = this.object as THREE.OrthographicCamera
      this.panLeft((delta.x * (orthoCamera.right - orthoCamera.left)) / element.clientWidth)
      this.panUp((delta.y * (orthoCamera.top - orthoCamera.bottom)) / element.clientHeight)
    } else {
      // camera neither orthographic or perspective - warn user
      console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.')
    }

    this.update()
  }

  public panXY(x: number, y: number): void {
    this.pan(new THREE.Vector2(x, y))
  }

  public dollyIn(dollyScale?: number): void {
    if (dollyScale === undefined) {
      dollyScale = this.getZoomScale()
    }

    this.scale /= dollyScale
  }

  public dollyOut(dollyScale?: number): void {
    if (dollyScale === undefined) {
      dollyScale = this.getZoomScale()
    }

    this.scale *= dollyScale
  }

  public update(): void {
    const position = this.object.position
    const offset = position.clone().sub(this.target)

    // angle from z-axis around y-axis
    let theta = Math.atan2(offset.x, offset.z)

    // angle from y-axis
    let phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y)

    if (this.autoRotate) {
      this.rotateLeft(this.getAutoRotationAngle())
    }

    theta += this.thetaDelta
    phi += this.phiDelta

    // restrict phi to be between desired limits
    phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi))

    // restrict phi to be between EPS and PI-EPS
    phi = Math.max(this.EPS, Math.min(Math.PI - this.EPS, phi))

    let radius = offset.length() * this.scale

    // restrict radius to be between desired limits
    radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius))

    // move target to panned location
    this.target.add(this.panVector)

    offset.x = radius * Math.sin(phi) * Math.sin(theta)
    offset.y = radius * Math.cos(phi)
    offset.z = radius * Math.sin(phi) * Math.cos(theta)

    position.copy(this.target).add(offset)

    this.object.lookAt(this.target)

    this.thetaDelta = 0
    this.phiDelta = 0
    this.scale = 1
    this.panVector.set(0, 0, 0)

    this.cameraMovedCallbacks.fire()
    this.needsUpdate = true
  }

  private getAutoRotationAngle(): number {
    return ((2 * Math.PI) / 60 / 60) * this.autoRotateSpeed
  }

  private getZoomScale(): number {
    return Math.pow(0.95, this.zoomSpeed)
  }

  private onMouseDown(event: MouseEvent): void {
    if (this.enabled === false) {
      return
    }
    event.preventDefault()

    if (event.button === 0) {
      if (this.noRotate === true) {
        return
      }

      this.state = STATE.ROTATE

      this.rotateStart.set(event.clientX, event.clientY)
    } else if (event.button === 1) {
      if (this.noZoom === true) {
        return
      }

      this.state = STATE.DOLLY

      this.dollyStart.set(event.clientX, event.clientY)
    } else if (event.button === 2) {
      if (this.noPan === true) {
        return
      }

      this.state = STATE.PAN

      this.panStart.set(event.clientX, event.clientY)
    }

    // Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
    this.domElement.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this) as EventListener,
      false
    )
    this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this) as EventListener, false)
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.enabled === false) return

    event.preventDefault()

    const element =
      this.domElement === document
        ? (this.domElement as Document).body
        : (this.domElement as HTMLElement)

    if (this.state === STATE.ROTATE) {
      if (this.noRotate === true) return

      this.rotateEnd.set(event.clientX, event.clientY)
      this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart)

      // rotating across whole screen goes 360 degrees around
      this.rotateLeft(((2 * Math.PI * this.rotateDelta.x) / element.clientWidth) * this.rotateSpeed)
      // rotating up and down along whole screen attempts to go 360, but limited to 180
      this.rotateUp(((2 * Math.PI * this.rotateDelta.y) / element.clientHeight) * this.rotateSpeed)

      this.rotateStart.copy(this.rotateEnd)
    } else if (this.state === STATE.DOLLY) {
      if (this.noZoom === true) return

      this.dollyEnd.set(event.clientX, event.clientY)
      this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart)

      if (this.dollyDelta.y > 0) {
        this.dollyIn()
      } else {
        this.dollyOut()
      }

      this.dollyStart.copy(this.dollyEnd)
    } else if (this.state === STATE.PAN) {
      if (this.noPan === true) return

      this.panEnd.set(event.clientX, event.clientY)
      this.panDelta.subVectors(this.panEnd, this.panStart)

      this.pan(this.panDelta)

      this.panStart.copy(this.panEnd)
    }

    // Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
    this.update()
  }

  private onMouseUp(): void {
    if (this.enabled === false) return

    // Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
    this.domElement.removeEventListener(
      'mousemove',
      this.onMouseMove.bind(this) as EventListener,
      false
    )
    this.domElement.removeEventListener(
      'mouseup',
      this.onMouseUp.bind(this) as EventListener,
      false
    )

    this.state = STATE.NONE
  }

  private onMouseWheel(event: any): void {
    if (this.enabled === false || this.noZoom === true) return

    // If wheel zoom is disabled, allow page scrolling by not preventing default
    if (!this.enableWheelZoom) return

    // Prevent page scroll when zooming
    event.preventDefault()

    let delta = 0

    if (event.wheelDelta) {
      // WebKit / Opera / Explorer 9
      delta = event.wheelDelta
    } else if (event.detail) {
      // Firefox
      delta = -event.detail
    }

    if (delta > 0) {
      this.dollyOut()
    } else {
      this.dollyIn()
    }
    this.update()
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this.enabled === false) {
      return
    }
    if (this.noKeys === true) {
      return
    }
    if (this.noPan === true) {
      return
    }

    switch (event.keyCode) {
      case this.keys.UP:
        this.pan(new THREE.Vector2(0, this.keyPanSpeed))
        break
      case this.keys.BOTTOM:
        this.pan(new THREE.Vector2(0, -this.keyPanSpeed))
        break
      case this.keys.LEFT:
        this.pan(new THREE.Vector2(this.keyPanSpeed, 0))
        break
      case this.keys.RIGHT:
        this.pan(new THREE.Vector2(-this.keyPanSpeed, 0))
        break
    }
  }

  private touchstart(event: TouchEvent): void {
    if (this.enabled === false) {
      return
    }

    switch (event.touches.length) {
      case 1: // one-fingered touch: rotate camera (or page scroll, or object manipulation if Controller handles it)
        if (this.noRotate === true) {
          return
        }

        // Store initial touch position for scroll/interaction detection
        this.touchStartY = event.touches[0].pageY
        this.touchStartX = event.touches[0].pageX
        this.state = STATE.TOUCH_ROTATE

        this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY)
        break

      case 2: // two-fingered touch: dolly
        if (this.noZoom === true) {
          return
        }

        this.state = STATE.TOUCH_DOLLY

        const dx = event.touches[0].pageX - event.touches[1].pageX
        const dy = event.touches[0].pageY - event.touches[1].pageY
        const distance = Math.sqrt(dx * dx + dy * dy)
        this.dollyStart.set(0, distance)

        // Prevent page scroll for multi-touch gestures
        event.preventDefault()
        break

      case 3: // three-fingered touch: pan
        if (this.noPan === true) {
          return
        }

        this.state = STATE.TOUCH_PAN

        this.panStart.set(event.touches[0].pageX, event.touches[0].pageY)

        // Prevent page scroll for multi-touch gestures
        event.preventDefault()
        break

      default:
        this.state = STATE.NONE
    }
  }

  private touchmove(event: TouchEvent): void {
    if (this.enabled === false) {
      return
    }

    const element =
      this.domElement === document
        ? (this.domElement as Document).body
        : (this.domElement as HTMLElement)

    switch (event.touches.length) {
      case 1: // one-fingered touch: rotate camera (or page scroll)
        if (this.noRotate === true) {
          return
        }
        if (this.state !== STATE.TOUCH_ROTATE) {
          return
        }

        this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY)
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart)

        // Improved scroll detection: Check if this is primarily a vertical scroll gesture
        const touchMoveY = Math.abs(event.touches[0].pageY - this.touchStartY)
        const touchMoveX = Math.abs(event.touches[0].pageX - this.touchStartX)
        const totalMovement = Math.sqrt(touchMoveX * touchMoveX + touchMoveY * touchMoveY)

        // Only allow page scroll if:
        // 1. allowPageScroll is enabled
        // 2. Movement is primarily vertical (Y movement > X movement * 1.5)
        // 3. Horizontal movement is minimal (< threshold)
        // 4. Total movement is significant enough to be intentional
        const isVerticalScroll =
          this.allowPageScroll &&
          totalMovement > this.touchMoveThreshold &&
          touchMoveY > touchMoveX * 1.5 &&
          touchMoveX < this.touchMoveThreshold

        // Only prevent default and rotate if it's clearly a 3D interaction gesture
        if (!isVerticalScroll) {
          event.preventDefault()
          event.stopPropagation()

          // Rotating across whole screen goes 360 degrees around
          this.rotateLeft(
            ((2 * Math.PI * this.rotateDelta.x) / element.clientWidth) * this.rotateSpeed
          )
          // Rotating up and down along whole screen attempts to go 360, but limited to 180
          this.rotateUp(
            ((2 * Math.PI * this.rotateDelta.y) / element.clientHeight) * this.rotateSpeed
          )

          this.rotateStart.copy(this.rotateEnd)

          // Update camera immediately for smooth rotation
          this.update()
        } else {
          // Allow page scroll for clear vertical gestures
          this.state = STATE.NONE
        }
        break

      case 2: // two-fingered touch: pinch to zoom
        if (this.noZoom === true) {
          return
        }
        if (this.state !== STATE.TOUCH_DOLLY) {
          return
        }

        event.preventDefault()
        event.stopPropagation()

        const dx = event.touches[0].pageX - event.touches[1].pageX
        const dy = event.touches[0].pageY - event.touches[1].pageY
        const distance = Math.sqrt(dx * dx + dy * dy)

        this.dollyEnd.set(0, distance)
        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart)

        // Pinch zoom: fingers moving apart = zoom out, fingers moving together = zoom in
        if (this.dollyDelta.y > 0) {
          this.dollyOut()
        } else {
          this.dollyIn()
        }

        this.dollyStart.copy(this.dollyEnd)

        // Update camera immediately for smooth zooming
        this.update()
        break

      case 3: // three-fingered touch: pan camera
        if (this.noPan === true) {
          return
        }
        if (this.state !== STATE.TOUCH_PAN) {
          return
        }

        event.preventDefault()
        event.stopPropagation()

        this.panEnd.set(event.touches[0].pageX, event.touches[0].pageY)
        this.panDelta.subVectors(this.panEnd, this.panStart)

        this.pan(this.panDelta)

        this.panStart.copy(this.panEnd)
        break

      default:
        this.state = STATE.NONE
    }
  }

  private touchend(): void {
    if (this.enabled === false) {
      return
    }
    this.state = STATE.NONE
  }
}

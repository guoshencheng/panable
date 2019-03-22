import * as React from 'react'

export const swipeDirection = (x1: number, x2: number, y1: number, y2: number) => {
  const xDist = x1 - x2
  const yDist = y1 - y2
  const r = Math.atan2(yDist, xDist)
  let swipeAngle = Math.round((r * 180) / Math.PI)

  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle)
  }
  if (swipeAngle <= 45 && swipeAngle >= 0) {
    return 1
  }
  if (swipeAngle <= 360 && swipeAngle >= 315) {
    return 1
  }
  if (swipeAngle >= 135 && swipeAngle <= 225) {
    return -1
  }
  return 0
}

export type TouchObject = {
  startX: number,
  startY: number,
  endX?: number,
  endY?: number,
  length?: number,
  direction?: -1 | 0 | 1,
}

export type PropTypes = {
  className: string,
  style: React.CSSProperties,
  onPanStop: () => void,
  onPanStart: (touchObject: TouchObject) => void
  onPan: (touchObject: TouchObject) => void
}

export default class Pan extends React.PureComponent<PropTypes> {

  touchObject: TouchObject = {
    startX: 0,
    startY: 0,
  }
  dragging: boolean = false

  getTouchEvents = () => ({
    onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => {
      this.handleMoveStart(e.touches[0].pageX, e.touches[0].pageY)
    },
    onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => {
      this.handleMoveTo(e.touches[0].pageX, e.touches[0].pageY, e)
    },
    onTouchEnd: () => {
      this.handleMoveEnd()
    },
    onTouchCancel: () => {
      this.handleMoveEnd()
    },
  })

  getMouseEvents = () => ({
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
      this.handleMoveStart(e.clientX, e.clientY)
    },
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      this.handleMoveTo(e.clientX, e.clientY, e)
    },
    onMouseOut: () => {
      this.handleMoveEnd()
    },
    onMouseUp: () => {
      this.handleMoveEnd()
    },
  })

  handleMoveEnd() {
    this.dragging = false
    const { onPanStop } = this.props
    if (onPanStop) {
      onPanStop()
    }
  }

  handleMoveStart(startX: number, startY: number) {
    this.dragging = true
    const { onPanStart } = this.props
    this.touchObject = {
      startX, startY,
    }
    if (onPanStart) {
      onPanStart(this.touchObject)
    }
  }

  handleMoveTo(x: number, y: number, e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) {
    if (!this.dragging) {
      return
    }
    const { onPan } = this.props
    const current = {
      x, y,
    }
    const direction = swipeDirection(
      this.touchObject.startX,
      current.x,
      this.touchObject.startY, current.y,
    )
    if (direction !== 0) {
      e.preventDefault()
    }
    const length = Math.sqrt(Math.pow(current.x - this.touchObject.startX, 2))
    if (onPan) {
      onPan({
        startX: this.touchObject.startX,
        startY: this.touchObject.startY,
        endX: current.x,
        endY: current.y,
        length, direction,
      })
    }
  }

  handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.dragging) {
      e.preventDefault()
      e.stopPropagation()
      if (e.nativeEvent) {
        e.nativeEvent.stopPropagation()
      }
    }
  }

  render() {
    const { className, style, onPan, onPanStart, onPanStop, ...args } = this.props
    const touchEvents = this.getTouchEvents()
    const mouseEvents = this.getMouseEvents()
    return (
      <div className={className}
        {...touchEvents}
        {...mouseEvents}
        onClickCapture={this.handleOnClick}
        {...args}
        style={{
          ...style,
          touchAction: 'pinch-zoom pan-x',
        }} />
    )
  }
}




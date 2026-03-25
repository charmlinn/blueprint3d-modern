import { dimInch } from './dimensioning'

// GENERAL:

/** The dimensioning unit for 2D floorplan measurements. */
export const configDimUnit = 'dimUnit'

// WALL:

/** The initial wall height in cm. */
export const configWallHeight = 'wallHeight'

/** The initial wall thickness in cm. */
export const configWallThickness = 'wallThickness'

// ITEMS:

/** The snap-to-wall distance threshold in cm. When a floor item is within this distance to a wall, it will snap to the wall. */
export const configSnapToWallDistance = 'snapToWallDistance'

/** Global configuration to customize the whole system.  */
export class Configuration {
  /** Configuration data loaded from/stored to extern. */
  private static data: { [key: string]: any } = {
    dimUnit: dimInch,

    wallHeight: 250,
    wallThickness: 10,
    snapToWallDistance: 10
  }

  /** Set a configuration parameter. */
  public static setValue(key: string, value: string | number) {
    this.data[key] = value
  }

  /** Get a string configuration parameter. */
  public static getStringValue(key: string): string {
    switch (key) {
      case configDimUnit:
        return <string>this.data[key]
      default:
        throw new Error('Invalid string configuration parameter: ' + key)
    }
  }

  /** Get a numeric configuration parameter. */
  public static getNumericValue(key: string): number {
    switch (key) {
      case configWallHeight:
      case configWallThickness:
      case configSnapToWallDistance:
        return <number>this.data[key]
      default:
        throw new Error('Invalid numeric configuration parameter: ' + key)
    }
  }
}

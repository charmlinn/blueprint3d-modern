export interface Scene3DTheme {
  skyboxTop: number
  skyboxBottom: number
  wallColor: number
  wallEmissive: number
  wallEmissiveIntensity: number
  wallFillerColor: number
  wallSideColor: number
  floorColor: number
  floorSpecular: number
  hemisphereSky: number
  hemisphereGround: number
  hemisphereIntensity: number
  directionalColor: number
  directionalIntensity: number
}

export const LIGHT_3D_THEME: Scene3DTheme = {
  skyboxTop: 0xE8F4F8,
  skyboxBottom: 0xD5D5D0,
  wallColor: 0xffffff,
  wallEmissive: 0xffffff,
  wallEmissiveIntensity: 0.3,
  wallFillerColor: 0xffffff,
  wallSideColor: 0xeeeeee,
  floorColor: 0xffffff,
  floorSpecular: 0x111111,
  hemisphereSky: 0xffffff,
  hemisphereGround: 0x888888,
  hemisphereIntensity: 3.0,
  directionalColor: 0xffffff,
  directionalIntensity: 0.5,
}

export const DARK_3D_THEME: Scene3DTheme = {
  skyboxTop: 0x1A1F2E,
  skyboxBottom: 0x2D3340,
  wallColor: 0x3A4555,
  wallEmissive: 0x3A4555,
  wallEmissiveIntensity: 0.15,
  wallFillerColor: 0x353D4C,
  wallSideColor: 0x2E3644,
  floorColor: 0x6A7080,
  floorSpecular: 0x151515,
  hemisphereSky: 0x3A4555,
  hemisphereGround: 0x1A1F2E,
  hemisphereIntensity: 1.8,
  directionalColor: 0xB0C0D0,
  directionalIntensity: 0.3,
}

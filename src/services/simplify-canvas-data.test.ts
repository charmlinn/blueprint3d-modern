// Example usage and testing for canvas data simplification
import { simplifyCanvasData, estimateTokenSavings, toMinifiedJSON, toFormattedJSON } from './simplify-canvas-data'

// Example canvas data (based on the structure you provided)
const exampleCanvasData = {
  floorplan: {
    corners: {
      '56d9ebd1-91b2-875c-799d-54b3785fca1f': { x: 630.55, y: -227.58 },
      '8f4a050d-2ef4-18ce-2d90-b0ab32285f74': { x: 294.64, y: -227.58 },
      '4e312eca-51da-1daf-a45f-23dca0d3f0f1': { x: 294.64, y: 232.66 },
      '254656bf-ce52-29a6-d40e-15dcaa84b04f': { x: 745.74, y: 232.66 },
      '11d25193-e73f-97e7-1eae-67e90b54a6f7': { x: 1044.70, y: 232.66 },
      'edf0de13-cbef-60e3-8382-fd59a32fd8de': { x: 1044.70, y: -105.66 },
      'e7db8654-d479-0ee6-52f3-f3f64c3e9a1d': { x: 745.74, y: -105.66 },
    },
    walls: [
      {
        corner1: '4e312eca-51da-1daf-a45f-23dca0d3f0f1',
        corner2: '254656bf-ce52-29a6-d40e-15dcaa84b04f',
        frontTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
        backTexture: { url: 'rooms/textures/wallmap_yellow.png', stretch: true, scale: 0 },
      },
      {
        corner1: '254656bf-ce52-29a6-d40e-15dcaa84b04f',
        corner2: 'e7db8654-d479-0ee6-52f3-f3f64c3e9a1d',
        frontTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
        backTexture: { url: 'rooms/textures/wallmap_yellow.png', stretch: true, scale: 0 },
      },
      {
        corner1: '56d9ebd1-91b2-875c-799d-54b3785fca1f',
        corner2: '8f4a050d-2ef4-18ce-2d90-b0ab32285f74',
        frontTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
        backTexture: { url: 'rooms/textures/wallmap_yellow.png', stretch: true, scale: 0 },
      },
      {
        corner1: '8f4a050d-2ef4-18ce-2d90-b0ab32285f74',
        corner2: '4e312eca-51da-1daf-a45f-23dca0d3f0f1',
        frontTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
        backTexture: { url: 'rooms/textures/wallmap_yellow.png', stretch: true, scale: 0 },
      },
      {
        corner1: '254656bf-ce52-29a6-d40e-15dcaa84b04f',
        corner2: '11d25193-e73f-97e7-1eae-67e90b54a6f7',
        frontTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
        backTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
      },
      {
        corner1: '11d25193-e73f-97e7-1eae-67e90b54a6f7',
        corner2: 'edf0de13-cbef-60e3-8382-fd59a32fd8de',
        frontTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
        backTexture: { url: 'rooms/textures/light_brick.jpg', stretch: false, scale: 100 },
      },
      {
        corner1: 'edf0de13-cbef-60e3-8382-fd59a32fd8de',
        corner2: 'e7db8654-d479-0ee6-52f3-f3f64c3e9a1d',
        frontTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
        backTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
      },
      {
        corner1: 'e7db8654-d479-0ee6-52f3-f3f64c3e9a1d',
        corner2: '56d9ebd1-91b2-875c-799d-54b3785fca1f',
        frontTexture: { url: 'rooms/textures/wallmap.png', stretch: true, scale: 0 },
        backTexture: { url: 'rooms/textures/wallmap_yellow.png', stretch: true, scale: 0 },
      },
    ],
    wallTextures: [],
    floorTextures: {},
    newFloorTextures: {
      '11d25193-e73f-97e7-1eae-67e90b54a6f7,254656bf-ce52-29a6-d40e-15dcaa84b04f,e7db8654-d479-0ee6-52f3-f3f64c3e9a1d,edf0de13-cbef-60e3-8382-fd59a32fd8de':
        {
          url: 'rooms/textures/light_fine_wood.jpg',
          scale: 300,
        },
    },
  },
  items: [
    {
      item_name: 'Drawer - Three',
      item_type: 1,
      model_url: '/models/glb/model/drawers/drawer-3.glb',
      xpos: 349.7643637452853,
      ypos: 26.37,
      zpos: -167.51772449558734,
      rotation: 0,
      scale_x: 1,
      scale_y: 1,
      scale_z: 1,
      fixed: false,
      resizable: true,
    },
    {
      item_name: 'Chair - Six',
      item_type: 1,
      model_url: '/models/glb/model/seating/chair-6.glb',
      xpos: 992.2733154080866,
      ypos: 39.19,
      zpos: -37.97953099835859,
      rotation: 0,
      scale_x: 1,
      scale_y: 1,
      scale_z: 1,
      fixed: false,
      resizable: true,
    },
    {
      item_name: 'Table - Fifteen',
      item_type: 1,
      model_url: '/models/glb/model/tables/table-15.glb',
      xpos: 509.8684877932508,
      ypos: 42.5,
      zpos: -90.00663900834424,
      rotation: 0,
      scale_x: 1,
      scale_y: 1,
      scale_z: 1,
      fixed: false,
      resizable: true,
    },
    {
      item_name: 'Table - Two',
      item_type: 1,
      model_url: '/models/glb/model/tables/table-2.glb',
      xpos: 956.336695084682,
      ypos: 37.37,
      zpos: 63.94666819834936,
      rotation: 0,
      scale_x: 1,
      scale_y: 1,
      scale_z: 1,
      fixed: false,
      resizable: true,
    },
    {
      item_name: 'Bed - One',
      item_type: 1,
      model_url: '/models/glb/model/beds/bed-1.glb',
      xpos: 445.86933904965244,
      ypos: 42.6,
      zpos: 155.0188028606798,
      rotation: 1.5707963267948966,
      scale_x: 1,
      scale_y: 1,
      scale_z: 1,
      fixed: false,
      resizable: true,
    },
  ],
}

// Test the simplification
export function testSimplification() {
  console.log('='.repeat(80))
  console.log('Testing Canvas Data Simplification')
  console.log('='.repeat(80))

  const simplified = simplifyCanvasData(exampleCanvasData)
  const savings = estimateTokenSavings(exampleCanvasData, simplified)
  const minifiedJSON = toMinifiedJSON(simplified)
  const formattedJSON = toFormattedJSON(simplified)

  console.log('\n📊 Token Savings:')
  console.log(`  Original:                ${savings.originalSize.toLocaleString()} characters`)
  console.log(`  Simplified (formatted):  ${savings.simplifiedSize.toLocaleString()} characters (${savings.savingsPercent}% reduction)`)
  console.log(`  Simplified (minified):   ${savings.minifiedSize.toLocaleString()} characters (${savings.minifiedSavingsPercent}% reduction)`)

  console.log('\n📦 Data Structure:')
  console.log(`  Corners:   ${simplified.corners.length}`)
  console.log(`  Walls:     ${simplified.layout.walls.length}`)
  console.log(`  Areas:     ${simplified.layout.areas.length}`)
  console.log(`  Items:     ${simplified.items.length}`)

  console.log('\n🔍 Formatted Output (for debugging):')
  console.log(formattedJSON)

  console.log('\n📦 Minified Output (for LLM):')
  console.log(minifiedJSON)
  console.log(`\n   Length: ${minifiedJSON.length.toLocaleString()} characters`)

  console.log('\n' + '='.repeat(80))
  console.log('✅ Test completed successfully!')
  console.log(`   Final token reduction: ${savings.minifiedSavingsPercent}%`)
  console.log('='.repeat(80))

  return {
    simplified,
    minifiedJSON,
    formattedJSON,
    savings
  }
}

// Uncomment to run the test directly:
// testSimplification()

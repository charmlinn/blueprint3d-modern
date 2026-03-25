// Item categories
export type ItemCategory =
  | 'bed'
  | 'drawer'
  | 'wardrobe'
  | 'light'
  | 'storage'
  | 'table'
  | 'chair'
  | 'sofa'
  | 'armchair'
  | 'stool'
  | 'door'
  | 'window'

export interface Item {
  key: string
  name: string
  image: string
  model: string
  type: string
  category: ItemCategory
  description?: string
}

// Items data
export const ITEMS: Item[] = [
  // Beds
  {
    key: 'bedOne',
    name: 'Modern Upholstered Twin Bed',
    description: 'A sleek twin-sized bed featuring a dark fabric upholstered headboard and frame with slender black metal legs. This minimalist design is perfect for contemporary bedrooms or guest rooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/bed-1.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/bed-1.glb',
    type: '1',
    category: 'bed'
  },
  // Drawers
  {
    key: 'drawerOne',
    name: 'Minimalist White Six-Drawer Dresser',
    description: 'A clean, modern white dresser featuring six spacious drawers. This versatile wooden storage unit is perfect for organizing clothing in a bedroom or providing extra storage in a living space.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/drawer-1.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/drawer-1.glb',
    type: '1',
    category: 'drawer'
  },
  {
    key: 'drawerTwo',
    name: 'Modern Eight Drawer Wooden Dresser',
    description: 'A spacious, light-toned wooden dresser featuring eight drawers with simple metal knobs. This versatile piece offers ample storage for bedrooms or living areas with a clean, minimalist aesthetic.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/drawer-2.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/drawer-2.glb',
    type: '1',
    category: 'drawer'
  },
  {
    key: 'drawerThree',
    name: 'Modern Dark Wood Nightstand',
    description: 'A sleek, minimalist two-drawer nightstand featuring a dark wood grain finish. This compact piece is ideal for bedside storage in contemporary or transitional bedrooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/drawer-3.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/drawer-3.glb',
    type: '1',
    category: 'drawer'
  },
  {
    key: 'drawerFour',
    name: 'Traditional White Vanity Dressing Table',
    description: 'A classic white wooden vanity table featuring an oval mirror and two small storage drawers. Perfect for bedrooms, this elegant piece provides a dedicated space for grooming and makeup application.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/drawer-4.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/drawer-4.glb',
    type: '1',
    category: 'drawer'
  },
  {
    key: 'drawerFive',
    name: 'Minimalist Grey Vanity Desk',
    description: 'A sleek, modern vanity desk featuring a smooth grey finish and two integrated storage drawers. Perfect for bedrooms or dressing areas as a compact makeup station.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/drawer-5.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/drawer-5.glb',
    type: '1',
    category: 'drawer'
  },
  {
    key: 'drawerSix',
    name: 'Minimalist Oak Writing Desk',
    description: 'A sleek, light oak wood desk featuring a single integrated drawer. This modern, compact piece is perfect for a home office or study nook.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/drawer-6.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/drawer-6.glb',
    type: '1',
    category: 'drawer'
  },
  // Wardrobes
  {
    key: 'wardrobeOne',
    name: 'Minimalist Three-Door White Wardrobe',
    description: 'A clean, modern three-door wardrobe featuring a smooth white finish. This versatile storage unit is ideal for organizing clothing and accessories in contemporary bedrooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/wardrobe-1.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/wardrobe-1.glb',
    type: '1',
    category: 'wardrobe'
  },
  {
    key: 'wardrobeTwo',
    name: 'Modern Modular Open Wardrobe System',
    description: 'A contemporary dark grey open wardrobe featuring hanging rods, shelving, and four drawers. This versatile storage unit is ideal for organized bedroom closets or dressing areas.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/wardrobe-2.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/wardrobe-2.glb',
    type: '1',
    category: 'wardrobe'
  },
  {
    key: 'wardrobeThree',
    name: 'Minimalist White Two-Door Wardrobe',
    description: 'A sleek, modern wardrobe featuring a clean white finish and simple round knobs. This compact storage unit is ideal for bedrooms or dressing areas requiring space-efficient clothing organization.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/wardrobe-3.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/wardrobe-3.glb',
    type: '1',
    category: 'wardrobe'
  },
  {
    key: 'wardrobeFour',
    name: 'Modern Open Concept Wardrobe Frame',
    description: 'A minimalist white open wardrobe frame featuring dual hanging rods and eight integrated storage drawers. This modular unit is ideal for organized bedroom closets or dressing rooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/wardrobe-4.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/wardrobe-4.glb',
    type: '1',
    category: 'wardrobe'
  },
  // Lighting
  {
    key: 'lightOne',
    name: 'Minimalist White Globe Table Lamp',
    description: 'A sleek, spherical glass table lamp with a modern minimalist aesthetic. This versatile accent light provides soft, diffused illumination perfect for bedside tables or living room consoles.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/light-1.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/light-1.glb',
    type: '1',
    category: 'light'
  },
  {
    key: 'lightTwo',
    name: 'Modern Green Metal Floor Lamp',
    description: 'A sleek, minimalist floor lamp featuring a sage green metal finish and gold-tone accents. This adjustable task light is perfect for reading nooks or modern living room corners.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/light-2.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/light-2.glb',
    type: '1',
    category: 'light'
  },
  {
    key: 'lightThree',
    name: 'Modern Wooden Tripod Floor Lamp',
    description: 'A stylish floor lamp featuring a dark wood tripod base and a classic white fabric drum shade. Perfect for adding warm, ambient lighting to living rooms or bedrooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/light-3.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/light-3.glb',
    type: '1',
    category: 'light'
  },
  {
    key: 'lightFour',
    name: 'Traditional Brass Table Lamp',
    description: 'A classic table lamp featuring a brass-finished base and a pleated white fabric shade. This elegant piece is perfect for bedside tables or home office desks.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/light-4.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/light-4.glb',
    type: '1',
    category: 'light'
  },
  // Storage
  {
    key: 'storageOne',
    name: 'Sage Green Wooden Display Cabinet',
    description: 'A large, farmhouse-style storage unit featuring glass-front cabinets, open shelving, and drawers. This sage green wooden piece is perfect for displaying books or decor in a living room or dining area.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-1.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-1.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageTwo',
    name: 'Traditional Dark Wood Display Cabinet',
    description: 'A tall, dark-stained wooden storage cabinet featuring glass-fronted upper doors and three lower drawers. This versatile piece is perfect for displaying decor or organizing essentials in a dining or living room.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-2.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-2.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageThree',
    name: 'Traditional White Wooden Sideboard',
    description: 'A classic white wooden sideboard featuring two drawers and four cabinet doors. This versatile storage piece is perfect for dining rooms, entryways, or living areas.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-3.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-3.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageFour',
    name: 'Traditional Dark Wood China Cabinet',
    description: 'A sophisticated dark-finished wooden cabinet featuring glass-fronted upper shelves and solid lower storage doors. Perfect for displaying dinnerware or collectibles in a dining room or living area.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-4.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-4.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageFive',
    name: 'Modern Black Glass Display Cabinet',
    description: 'A sleek, industrial-style display cabinet featuring a black metal frame and glass shelving. Perfect for showcasing collectibles or decor in a living room or dining area.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-5.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-5.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageSix',
    name: 'Modern Black Two-Door Storage Cabinet',
    description: 'A sleek, minimalist storage cabinet featuring a matte black finish and two paneled doors. This versatile piece is ideal for organizing essentials in a living room, bedroom, or home office.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-6.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-6.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageSeven',
    name: 'Tall Narrow White Bookshelf',
    description: 'A minimalist, tall white wooden bookcase with multiple adjustable shelves. This versatile storage unit is perfect for organizing books or displaying decor in small living spaces or home offices.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-7.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-7.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageEight',
    name: 'Modern Scandinavian Five-Tier Shelving Unit',
    description: 'This minimalist shelving unit features a light wood frame with white shelves. It is perfect for displaying books or decor in a modern living room or home office.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-8.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-8.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageNine',
    name: 'Tall Black Storage Bookcase',
    description: 'A sleek, modern tall bookcase featuring open shelving and two bottom drawers. This versatile wooden storage unit is perfect for organizing books or displaying decor in any living space.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-9.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-9.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageTen',
    name: 'Modern Eight-Cube Storage Shelf',
    description: 'A minimalist white eight-cube shelving unit made of durable particleboard. This versatile organizer is perfect for displaying books, decor, or storing items in a living room or office.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-10.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-10.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageEleven',
    name: 'Industrial Galvanized Metal Shelving Unit',
    description: 'A durable, three-tier industrial shelving unit made from galvanized steel. Ideal for organized storage in garages, basements, or utility rooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-11.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-11.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageTwelve',
    name: 'Modern Black Media Console',
    description: 'A sleek, contemporary media console featuring three open shelves and three drawers with frosted glass panels. Perfect for organizing entertainment equipment and living room storage.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-12.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-12.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageThirteen',
    name: 'Minimalist Oak Media Console',
    description: 'A sleek, low-profile storage unit crafted from light oak wood. This modern piece features sliding doors and is perfect as a living room TV stand or sideboard.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-13.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-13.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageFourteen',
    name: 'Minimalist Black TV Stand',
    description: 'A sleek, low-profile black wooden media console featuring an open shelf design. Ideal for modern living rooms to organize media devices and entertainment accessories.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-14.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-14.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageFifteen',
    name: 'Minimalist Wall-Mounted Media Console',
    description: 'A sleek, white wall-mounted storage unit featuring three cabinet doors. This modern piece is perfect for organizing media equipment or living room essentials while maintaining a clean, floating aesthetic.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-15.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-15.glb',
    type: '1',
    category: 'storage'
  },
  {
    key: 'storageSixteen',
    name: 'Industrial Metal Mesh Media Console',
    description: 'This industrial-style media console features a warm wood top and black metal mesh doors. It provides stylish, ventilated storage for living room media equipment or general home organization.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/storage-16.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/storage-16.glb',
    type: '1',
    category: 'storage'
  },
  // Tables
  {
    key: 'tableOne',
    name: 'Traditional Black Wooden Dining Table',
    description: 'A classic rectangular dining table featuring elegant turned legs and a smooth black finish. This versatile piece fits perfectly in traditional or transitional dining rooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-1.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-1.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableTwo',
    name: 'Two-Tone Rectangular Dining Table',
    description: 'A classic rectangular dining table featuring a warm wood-grain top and contrasting white legs. This versatile piece fits perfectly in farmhouse or transitional kitchens and dining rooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-2.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-2.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableThree',
    name: 'Round Gold Glass Coffee Table',
    description: 'This elegant round coffee table features a sleek glass top and a brushed gold metal frame with a cross-base design. It adds a sophisticated, modern touch to any living room seating area.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-3.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-3.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableFour',
    name: 'Oval Wooden Coffee Table',
    description: 'A stylish mid-century modern coffee table featuring a solid wood oval top and a woven rattan lower shelf. Perfect for adding organic texture to a living room seating area.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-4.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-4.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableFive',
    name: 'Minimalist Round Metal Side Table',
    description: 'A sleek, modern round side table featuring a matte black metal tray top and slender cross-base legs. Perfect as a compact accent piece in living rooms or bedrooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-5.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-5.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableSix',
    name: 'Modern C-Shaped Laptop Table',
    description: 'A minimalist C-shaped side table featuring a light wood top, black metal frame, and a convenient fabric storage sling. Ideal for use as a laptop desk or snack table.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-6.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-6.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableSeven',
    name: 'Minimalist White Square Side Table',
    description: 'A simple, modern square side table with a clean white finish. This versatile piece works perfectly as a compact coffee table or bedside nightstand in any contemporary living space.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-7.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-7.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableEight',
    name: 'Minimalist Black Rectangular Dining Table',
    description: 'A sleek, modern dining table featuring a matte black finish and slender metal legs. Its versatile design is perfect for contemporary dining rooms or compact home office workspaces.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-8.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-8.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableNine',
    name: 'Modern White Pedestal Dining Table',
    description: 'A minimalist round dining table featuring a sleek white finish and a single pedestal base. This mid-century inspired piece is perfect for compact dining areas or breakfast nooks.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-9.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-9.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableTen',
    name: 'Minimalist White Rectangular Dining Table',
    description: 'A clean, modern rectangular table with a smooth white finish and slender metal legs. This versatile piece is perfect for dining rooms, home offices, or minimalist workspace setups.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-10.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-10.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableEleven',
    name: 'Modern Wooden Tiered Side Table',
    description: 'A minimalist, light oak-finish side table featuring tiered shelving for storage. This versatile piece works well as a compact end table or a small media console in contemporary living rooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-11.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-11.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableTwelve',
    name: 'Modern White Cube Storage Unit',
    description: 'A versatile white shelving unit featuring open compartments, drawers, and cabinets. This minimalist piece is perfect for organized storage in living rooms, offices, or bedrooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-12.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-12.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableThirteen',
    name: 'Rustic Wooden Dining Table Set',
    description: 'A classic rectangular dining table crafted from natural pine wood. This simple, sturdy set includes four matching chairs, perfect for casual family meals in a traditional or farmhouse-style kitchen.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-13.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-13.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableFourteen',
    name: 'Round Wooden Dining Table Set',
    description: 'A modern round wooden dining table paired with four matching chairs featuring woven seats. This elegant set is perfect for contemporary dining rooms or breakfast nooks.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-14.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-14.glb',
    type: '1',
    category: 'table'
  },
  {
    key: 'tableFifteen',
    name: 'Modern Rattan Dining Set',
    description: 'A light wood dining table paired with four matching rattan-woven chairs. This natural, minimalist set is perfect for a bright, casual dining room or breakfast nook.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/table-15.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/table-15.glb',
    type: '1',
    category: 'table'
  },
  // Seating - Chairs
  {
    key: 'chairOne',
    name: 'Minimalist Black Metal Dining Chair',
    description: 'A sleek, modern dining chair featuring a curved backrest and sturdy metal frame. This versatile piece is ideal for contemporary dining rooms or minimalist office spaces.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/chair-1.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/chair-1.glb',
    type: '1',
    category: 'chair'
  },
  {
    key: 'chairTwo',
    name: 'Modern Upholstered Dining Chair',
    description: 'A contemporary dining chair featuring a curved, fabric-upholstered backrest and seat. Its minimalist design and slim metal legs make it perfect for modern dining rooms or home offices.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/chair-2.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/chair-2.glb',
    type: '1',
    category: 'chair'
  },
  {
    key: 'chairThree',
    name: 'Modern White Molded Armchair',
    description: 'A sleek, minimalist armchair featuring a contoured white plastic seat and tapered wooden legs. This versatile piece is perfect for contemporary dining rooms or stylish home office spaces.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/chair-3.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/chair-3.glb',
    type: '1',
    category: 'chair'
  },
  {
    key: 'chairFour',
    name: 'Modern Perforated Metal Dining Chair',
    description: 'A minimalist white metal chair featuring a perforated seat and backrest. This lightweight, industrial-style chair is perfect for contemporary dining rooms or outdoor patio seating.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/chair-4.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/chair-4.glb',
    type: '1',
    category: 'chair'
  },
  {
    key: 'chairFive',
    name: 'Modern Clear Acrylic Dining Chair',
    description: 'This contemporary chair features a transparent acrylic seat and a sleek chrome cantilever base. It is perfect for modern dining rooms or minimalist office spaces.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/chair-5.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/chair-5.glb',
    type: '1',
    category: 'chair'
  },
  {
    key: 'chairSix',
    name: 'Modern Scandinavian Dining Chair',
    description: 'A minimalist dining chair featuring a smooth white molded seat and tapered wooden legs. Its clean, contemporary design is perfect for modern kitchens or dining rooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/chair-6.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/chair-6.glb',
    type: '1',
    category: 'chair'
  },
  {
    key: 'chairSeven',
    name: 'Minimalist Light Wood Dining Chair',
    description: 'A simple, modern dining chair crafted from light-toned wood with a clean, Scandinavian-inspired design. Ideal for kitchens or minimalist dining areas.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/chair-7.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/chair-7.glb',
    type: '1',
    category: 'chair'
  },
  {
    key: 'chairEight',
    name: 'Traditional Dark Wood Dining Chair',
    description: 'A classic wooden dining chair featuring a simple slatted backrest and a dark espresso finish. This sturdy, minimalist design is perfect for casual dining rooms or kitchen seating.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/chair-8.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/chair-8.glb',
    type: '1',
    category: 'chair'
  },
  {
    key: 'chairNine',
    name: 'Modern Black Metal Folding Chair',
    description: 'A minimalist folding chair featuring a black plastic seat and backrest with a sturdy silver metal frame. Ideal for extra guest seating or versatile home office use.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/chair-9.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/chair-9.glb',
    type: '1',
    category: 'chair'
  },
  // Seating - Sofas
  {
    key: 'sofaTen',
    name: 'Modern Minimalist Two-Seater Sofa',
    description: 'A sleek, charcoal grey fabric sofa with a clean-lined, contemporary design. This compact piece features sturdy cylindrical legs and is perfect for modern living rooms or office lounge areas.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/sofa-10.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/sofa-10.glb',
    type: '1',
    category: 'sofa'
  },
  {
    key: 'sofaEleven',
    name: 'Mid-Century Modern Tufted Leather Sofa',
    description: 'A sleek black leather sofa featuring button-tufted cushions and tapered wooden legs. This stylish piece is perfect for adding a sophisticated touch to modern living rooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/sofa-11.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/sofa-11.glb',
    type: '1',
    category: 'sofa'
  },
  {
    key: 'sofaTwelve',
    name: 'Modern Beige Sectional Sofa',
    description: 'A minimalist sectional sofa featuring light beige fabric upholstery and a comfortable chaise lounge. This versatile piece is perfect for contemporary living rooms seeking a clean, neutral aesthetic.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/sofa-12.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/sofa-12.glb',
    type: '1',
    category: 'sofa'
  },
  {
    key: 'sofaThirteen',
    name: 'Modern Grey L-Shaped Sectional Sofa',
    description: 'A contemporary L-shaped sectional sofa upholstered in light grey fabric. This versatile piece features a pull-out sleeper function, making it ideal for living rooms or guest spaces.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/sofa-13.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/sofa-13.glb',
    type: '1',
    category: 'sofa'
  },
  {
    key: 'sofaFourteen',
    name: 'Classic White Slipcovered Sofa',
    description: 'A comfortable three-seater sofa featuring a clean white slipcover and rolled arms. Its casual, timeless design is perfect for bright, relaxed living room interiors.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/sofa-14.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/sofa-14.glb',
    type: '1',
    category: 'sofa'
  },
  // Seating - Armchairs
  {
    key: 'armchairFifteen',
    name: 'Mid-Century Modern Fabric Armchair',
    description: 'A stylish armchair featuring a dark wood frame and light beige fabric upholstery. This piece is perfect for adding comfortable, retro-inspired seating to a living room or reading nook.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/armchair-15.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/armchair-15.glb',
    type: '1',
    category: 'armchair'
  },
  {
    key: 'armchairSixteen',
    name: 'Scandinavian Bentwood Armchair',
    description: 'A modern, minimalist armchair featuring a light wood bentwood frame and a ribbed grey fabric cushion. Ideal for a cozy reading nook or living room seating.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/armchair-16.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/armchair-16.glb',
    type: '1',
    category: 'armchair'
  },
  {
    key: 'armchairSeventeen',
    name: 'Classic White Slipcovered Armchair',
    description: 'A comfortable, traditional armchair featuring a clean white fabric slipcover and rolled arms. This cozy piece is perfect for creating a relaxed, inviting atmosphere in a living room or reading nook.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/armchair-17.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/armchair-17.glb',
    type: '1',
    category: 'armchair'
  },
  {
    key: 'armchairEighteen',
    name: 'Modern Tufted Fabric Armchair',
    description: 'A contemporary armchair featuring light green fabric upholstery with subtle tufted detailing. This comfortable piece is supported by light wood legs, perfect for a cozy living room or reading nook.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/armchair-18.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/armchair-18.glb',
    type: '1',
    category: 'armchair'
  },
  {
    key: 'armchairNineteen',
    name: 'Mid-Century Modern Orange Corduroy Armchair',
    description: 'A vibrant orange corduroy swivel armchair featuring a tufted backrest and a sleek chrome base. This retro-inspired piece is perfect for adding a pop of color to a modern living room.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/armchair-19.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/armchair-19.glb',
    type: '1',
    category: 'armchair'
  },
  {
    key: 'armchairTwenty',
    name: 'Natural Wicker Rattan Armchair',
    description: 'A charming wicker armchair featuring a natural finish and a comfortable off-white seat cushion. Perfect for adding a rustic or coastal touch to indoor living spaces or sunrooms.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/armchair-20.png',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/armchair-20.glb',
    type: '1',
    category: 'armchair'
  },
  // Seating - Stools
  {
    key: 'stoolTwentyOne',
    name: 'Modern Round Yellow Fabric Stool',
    description: 'A contemporary round stool featuring a vibrant yellow fabric cushion supported by a sleek black metal frame. Ideal as a stylish accent seat or footrest in modern living spaces.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/stool-21.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/stool-21.glb',
    type: '1',
    category: 'stool'
  },
  {
    key: 'stoolTwentyTwo',
    name: 'Modern Grey Upholstered Ottoman Stool',
    description: 'A contemporary rectangular stool featuring grey fabric upholstery and dark tapered wooden legs. Perfect as a versatile footrest or extra seating in a living room or bedroom.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/stool-22.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/stool-22.glb',
    type: '1',
    category: 'stool'
  },
  {
    key: 'stoolTwentyThree',
    name: 'Modern Navy Fabric Ottoman Stool',
    description: 'A minimalist, rectangular fabric-upholstered ottoman in a deep navy blue. This versatile piece serves as a comfortable footrest or extra seating in a contemporary living room.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/stool-23.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/stool-23.glb',
    type: '1',
    category: 'stool'
  },
  {
    key: 'stoolTwentyFour',
    name: 'Tufted Fabric Ottoman Stool',
    description: 'A modern, charcoal grey tufted ottoman featuring light wood legs. This versatile piece serves as a comfortable footrest or extra seating in a living room or lounge area.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/stool-24.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/stool-24.glb',
    type: '1',
    category: 'stool'
  },
  {
    key: 'stoolTwentyFive',
    name: 'Modern Hexagonal Fabric Storage Stool',
    description: 'A contemporary, charcoal-grey fabric stool with a unique hexagonal shape. This versatile piece functions as extra seating or a compact storage solution for modern living spaces.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/stool-25.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/stool-25.glb',
    type: '1',
    category: 'stool'
  },
  // Special items (doors, windows)
  {
    key: 'doorOne',
    name: 'Minimalist White Interior Door',
    description: 'A sleek, modern white interior door with a simple frame and handle. This clean design is suitable for contemporary residential or office spaces.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/door-1.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/door-1.glb',
    type: '7',
    category: 'door'
  },
  {
    key: 'doorTwo',
    name: 'Classic Six-Panel White Door',
    description: 'A traditional white six-panel interior door with a clean finish. This versatile door is suitable for bedrooms, bathrooms, or closets in various home styles.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/door-2.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/door-2.glb',
    type: '7',
    category: 'door'
  },
  {
    key: 'windowOne',
    name: 'Modern White Casement Window',
    description: 'A simple, minimalist white-framed casement window suitable for contemporary interiors. This single-pane window design provides clean lines and natural light for residential living spaces.',
    image: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/window-1.jpg',
    model: 'https://cdn-images.archybase.com/archybase/blueprint3d/models/window-1.glb',
    type: '3',
    category: 'window'
  }
]

// Floor textures
export const FLOOR_TEXTURES = [
  {
    name: 'Light Fine Wood',
    thumbnail: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/thumbnail_light_fine_wood.jpg',
    url: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/light_fine_wood.jpg',
    stretch: false,
    scale: 300
  }
]

// Wall textures
export const WALL_TEXTURES = [
  {
    name: 'Marble Tiles',
    thumbnail: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/thumbnail_marbletiles.jpg',
    url: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/marbletiles.jpg',
    stretch: false,
    scale: 300
  },
  {
    name: 'Wallmap Yellow',
    thumbnail: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/thumbnail_wallmap_yellow.png',
    url: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/wallmap_yellow.png',
    stretch: true,
    scale: 0
  },
  {
    name: 'Light Brick',
    thumbnail: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/thumbnail_light_brick.jpg',
    url: 'https://cdn-images.archybase.com/archybase/blueprint3d/covers/light_brick.jpg',
    stretch: false,
    scale: 100
  }
]

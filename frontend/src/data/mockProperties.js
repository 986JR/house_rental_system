export const mockProperties = [
  {
    id: 1,
    title: "Modern Skyline Penthouse",
    description: "Breathtaking panoramic city views from this luxurious penthouse. Floor-to-ceiling windows, chef's kitchen with quartz countertops, and a private rooftop terrace. Concierge and valet parking included.",
    location: "Manhattan, New York",
    pricePerMonth: 8500,
    rooms: 3,
    availability: "available",
    landlordEmail: "skyline@elite.com",
    landlordId: 1,
    images: [
      { id: 1, filePath: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" },
    ],
    createdAt: "2024-06-01T10:00:00Z"
  },
  {
    id: 2,
    title: "Cozy Brooklyn Brownstone",
    description: "Charming pre-war brownstone in the heart of Park Slope. Original hardwood floors, exposed brick walls, and a private garden. Walkable to Prospect Park and top-rated restaurants.",
    location: "Brooklyn, New York",
    pricePerMonth: 3200,
    rooms: 2,
    availability: "available",
    landlordEmail: "brooklyn@homes.com",
    landlordId: 2,
    images: [
      { id: 2, filePath: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1200" },
    ],
    createdAt: "2024-06-02T10:00:00Z"
  },
  {
    id: 3,
    title: "Beachfront Malibu Villa",
    description: "Wake up to the sound of waves in this stunning beachfront villa. Wraparound deck, infinity pool, chef's kitchen, and direct beach access. Perfect for those who want the ultimate California lifestyle.",
    location: "Malibu, California",
    pricePerMonth: 12000,
    rooms: 4,
    availability: "available",
    landlordEmail: "malibu@villas.com",
    landlordId: 3,
    images: [
      { id: 3, filePath: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200" },
    ],
    createdAt: "2024-06-03T10:00:00Z"
  },
  {
    id: 4,
    title: "Downtown Chicago Loft",
    description: "Industrial-chic loft in the vibrant River North neighborhood. Exposed concrete ceilings, polished floors, and massive industrial windows. Building amenities include rooftop deck, gym and concierge.",
    location: "River North, Chicago",
    pricePerMonth: 2800,
    rooms: 1,
    availability: "available",
    landlordEmail: "chicago@lofts.com",
    landlordId: 4,
    images: [
      { id: 4, filePath: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" },
    ],
    createdAt: "2024-06-04T10:00:00Z"
  },
  {
    id: 5,
    title: "Suburban Family Home",
    description: "Spacious family home in a quiet, tree-lined street. Large backyard with deck, updated kitchen, and 2-car garage. Top-rated school district. Perfect for growing families.",
    location: "Naperville, Illinois",
    pricePerMonth: 2400,
    rooms: 4,
    availability: "unavailable",
    landlordEmail: "family@homes.com",
    landlordId: 5,
    images: [
      { id: 5, filePath: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200" },
    ],
    createdAt: "2024-06-05T10:00:00Z"
  },
  {
    id: 6,
    title: "Austin Tech District Studio",
    description: "Sleek, modern studio in the heart of Austin's tech corridor. High-speed fiber internet, smart home features, and access to co-working spaces. Walkable to top restaurants and entertainment.",
    location: "Downtown Austin, Texas",
    pricePerMonth: 1800,
    rooms: 1,
    availability: "available",
    landlordEmail: "austin@studios.com",
    landlordId: 6,
    images: [
      { id: 6, filePath: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200" },
    ],
    createdAt: "2024-06-06T10:00:00Z"
  },
  {
    id: 7,
    title: "Miami Art Deco Apartment",
    description: "Iconic Art Deco building steps from South Beach. Renovated interior with original architectural details. Pool, fitness center, and valet parking. Live the Miami dream.",
    location: "South Beach, Miami",
    pricePerMonth: 4500,
    rooms: 2,
    availability: "available",
    landlordEmail: "miami@artdeco.com",
    landlordId: 7,
    images: [
      { id: 7, filePath: "https://images.unsplash.com/photo-1600607687940-4e7a6a953c1b?auto=format&fit=crop&q=80&w=1200" },
    ],
    createdAt: "2024-06-07T10:00:00Z"
  },
  {
    id: 8,
    title: "Pacific Heights Victorian",
    description: "Beautifully restored Victorian with spectacular bay and bridge views. Original period details with modern updates throughout. Private garden and 2-car parking. A San Francisco treasure.",
    location: "Pacific Heights, San Francisco",
    pricePerMonth: 6200,
    rooms: 3,
    availability: "available",
    landlordEmail: "sf@victorians.com",
    landlordId: 8,
    images: [
      { id: 8, filePath: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200" },
    ],
    createdAt: "2024-06-08T10:00:00Z"
  },
  {
    id: 9,
    title: "Seattle Waterfront Condo",
    description: "Stunning waterfront condo with panoramic views of Puget Sound. Modern finishes, open floor plan, and floor-to-ceiling windows. Building amenities include infinity pool, gym, and kayak storage.",
    location: "Capitol Hill, Seattle",
    pricePerMonth: 3800,
    rooms: 2,
    availability: "available",
    landlordEmail: "seattle@waterfront.com",
    landlordId: 9,
    images: [
      { id: 9, filePath: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200" },
    ],
    createdAt: "2024-06-09T10:00:00Z"
  },
];

export const getFeaturedProperties = () => mockProperties.filter(p => p.availability === 'available').slice(0, 3);

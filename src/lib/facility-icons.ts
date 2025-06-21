import { 
  Wifi, Car, Utensils, Coffee, Bed, Bath, AirVent, Tv, ShoppingCart, 
  Camera, MapPin, Waves, Mountain, TreePine, Sun, Moon, Accessibility, 
  Baby, Dog, Bike, Gamepad2, Music, Book, Shield, Zap, Thermometer, 
  Wine, Phone, Mail, Gift, Users, type LucideIcon 
} from 'lucide-react';

/**
 * Get the appropriate icon for a facility or amenity based on its name
 * @param facilityName - The name of the facility/amenity
 * @returns The corresponding Lucide icon component
 */
export const getFacilityIcon = (facilityName: string): LucideIcon => {
  const facilityLower = facilityName.toLowerCase();
  
  // WiFi and internet
  if (facilityLower.includes('wifi') || facilityLower.includes('internet') || facilityLower.includes('wireless')) return Wifi;
  
  // Transportation and parking
  if (facilityLower.includes('parking') || facilityLower.includes('parkir') || facilityLower.includes('park')) return Car;
  
  // Food and dining
  if (facilityLower.includes('restaurant') || facilityLower.includes('restoran') || facilityLower.includes('dining') || facilityLower.includes('food') || facilityLower.includes('makanan')) return Utensils;
  if (facilityLower.includes('cafe') || facilityLower.includes('coffee') || facilityLower.includes('kopi') || facilityLower.includes('warung')) return Coffee;
  
  // Accommodation
  if (facilityLower.includes('bed') || facilityLower.includes('room') || facilityLower.includes('accommodation') || facilityLower.includes('kamar') || facilityLower.includes('tempat tidur')) return Bed;
  if (facilityLower.includes('bathroom') || facilityLower.includes('toilet') || facilityLower.includes('wc') || facilityLower.includes('kamar mandi')) return Bath;
  
  // Climate control
  if (facilityLower.includes('air') || facilityLower.includes('ac') || facilityLower.includes('conditioning') || facilityLower.includes('pendingin')) return AirVent;
  
  // Entertainment
  if (facilityLower.includes('tv') || facilityLower.includes('television') || facilityLower.includes('televisi')) return Tv;
  if (facilityLower.includes('game') || facilityLower.includes('play') || facilityLower.includes('entertainment') || facilityLower.includes('bermain')) return Gamepad2;
  if (facilityLower.includes('music') || facilityLower.includes('sound') || facilityLower.includes('audio') || facilityLower.includes('musik')) return Music;
  
  // Shopping
  if (facilityLower.includes('shop') || facilityLower.includes('store') || facilityLower.includes('shopping') || facilityLower.includes('toko') || facilityLower.includes('gift')) return ShoppingCart;
  
  // Photography and viewing
  if (facilityLower.includes('camera') || facilityLower.includes('photo') || facilityLower.includes('picture') || facilityLower.includes('foto')) return Camera;
  if (facilityLower.includes('view') || facilityLower.includes('scenic') || facilityLower.includes('panorama') || facilityLower.includes('pemandangan')) return Mountain;
  
  // Water activities
  if (facilityLower.includes('pool') || facilityLower.includes('swimming') || facilityLower.includes('water') || facilityLower.includes('kolam') || facilityLower.includes('renang')) return Waves;
  
  // Nature and outdoor
  if (facilityLower.includes('tree') || facilityLower.includes('forest') || facilityLower.includes('nature') || facilityLower.includes('hutan') || facilityLower.includes('alam')) return TreePine;
  if (facilityLower.includes('mountain') || facilityLower.includes('hill') || facilityLower.includes('gunung') || facilityLower.includes('bukit')) return Mountain;
  if (facilityLower.includes('trail') || facilityLower.includes('track') || facilityLower.includes('path') || facilityLower.includes('jalur')) return TreePine;
  
  // Time-based
  if (facilityLower.includes('sun') || facilityLower.includes('day') || facilityLower.includes('morning') || facilityLower.includes('siang') || facilityLower.includes('pagi')) return Sun;
  if (facilityLower.includes('night') || facilityLower.includes('evening') || facilityLower.includes('moon') || facilityLower.includes('malam')) return Moon;
  
  // Accessibility and special needs
  if (facilityLower.includes('accessible') || facilityLower.includes('wheelchair') || facilityLower.includes('disability') || facilityLower.includes('difabel')) return Accessibility;
  if (facilityLower.includes('baby') || facilityLower.includes('child') || facilityLower.includes('kid') || facilityLower.includes('bayi') || facilityLower.includes('anak')) return Baby;
  if (facilityLower.includes('pet') || facilityLower.includes('dog') || facilityLower.includes('animal') || facilityLower.includes('hewan')) return Dog;
  
  // Activities
  if (facilityLower.includes('bike') || facilityLower.includes('bicycle') || facilityLower.includes('cycling') || facilityLower.includes('sepeda')) return Bike;
  if (facilityLower.includes('gym') || facilityLower.includes('fitness') || facilityLower.includes('exercise') || facilityLower.includes('olahraga')) return Users;
  
  // Reading and books
  if (facilityLower.includes('book') || facilityLower.includes('read') || facilityLower.includes('library') || facilityLower.includes('buku') || facilityLower.includes('perpustakaan')) return Book;
  
  // Security and safety
  if (facilityLower.includes('security') || facilityLower.includes('safe') || facilityLower.includes('guard') || facilityLower.includes('keamanan')) return Shield;
  
  // Utilities
  if (facilityLower.includes('electric') || facilityLower.includes('power') || facilityLower.includes('charge') || facilityLower.includes('listrik')) return Zap;
  if (facilityLower.includes('heat') || facilityLower.includes('warm') || facilityLower.includes('temperature') || facilityLower.includes('panas')) return Thermometer;
  
  // Communication
  if (facilityLower.includes('phone') || facilityLower.includes('call') || facilityLower.includes('contact') || facilityLower.includes('telepon')) return Phone;
  if (facilityLower.includes('mail') || facilityLower.includes('post') || facilityLower.includes('letter') || facilityLower.includes('surat')) return Mail;
  
  // Beverages and bar
  if (facilityLower.includes('drink') || facilityLower.includes('bar') || facilityLower.includes('beverage') || facilityLower.includes('minuman')) return Wine;
  
  // Guide and information
  if (facilityLower.includes('guide') || facilityLower.includes('tour') || facilityLower.includes('information') || facilityLower.includes('pemandu')) return MapPin;
  
  // Default icon for unknown facilities
  return MapPin;
};

// Common facilities/amenities with their icons for quick reference
export const commonFacilities = [
  { name: 'Parking', icon: Car },
  { name: 'WiFi', icon: Wifi },
  { name: 'Restaurant', icon: Utensils },
  { name: 'Cafe', icon: Coffee },
  { name: 'Accommodation', icon: Bed },
  { name: 'Bathroom', icon: Bath },
  { name: 'Air Conditioning', icon: AirVent },
  { name: 'Television', icon: Tv },
  { name: 'Gift Shop', icon: ShoppingCart },
  { name: 'Photo Spot', icon: Camera },
  { name: 'Tour Guide', icon: MapPin },
  { name: 'Swimming Pool', icon: Waves },
  { name: 'Mountain View', icon: Mountain },
  { name: 'Nature Trail', icon: TreePine },
  { name: 'Accessible', icon: Accessibility },
  { name: 'Pet Friendly', icon: Dog },
  { name: 'Security', icon: Shield },
];

export const commonHotelAmenities = [
  { name: 'WiFi', icon: Wifi },
  { name: 'Parking', icon: Car },
  { name: 'Restaurant', icon: Utensils },
  { name: 'Swimming Pool', icon: Waves },
  { name: 'Air Conditioning', icon: AirVent },
  { name: 'Television', icon: Tv },
  { name: 'Coffee Maker', icon: Coffee },
  { name: 'Room Service', icon: Bed },
  { name: 'Bathroom', icon: Bath },
  { name: 'Security', icon: Shield },
  { name: 'Electricity', icon: Zap },
  { name: 'Phone', icon: Phone },
  { name: 'Accessible', icon: Accessibility },
  { name: 'Pet Friendly', icon: Dog },
  { name: 'Bar', icon: Wine },
  { name: 'Gym/Fitness', icon: Users }
];

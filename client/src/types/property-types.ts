// Property type definitions for the client-side code

export interface CommercialProperty {
  id: string;
  title: string;
  propertyType: string;
  locality: string;
  city: string;
  state?: string;
  price: string;
  pricePerSqFt?: string;
  imageUrl?: string;
  imageUrls?: string[];
  postedDate?: string;
  builder?: string;
  featured?: boolean;
  possession?: string;
  amenities?: string[];
  tags?: string[];
  description?: string;
}

export interface AffordableProject {
  id: string;
  title: string;
  location: string;
  city: string;
  state?: string;
  price: string;
  bhkConfig: string;
  imageUrl?: string;
  imageUrls?: string[];
  builder: string;
  priceRange?: string;
  amenities?: string[];
  launchDate?: string;
  possessionDate?: string;
  featured?: boolean;
  tags?: string[];
}

export interface LuxuryProject {
  id: string;
  title: string;
  location: string;
  city: string;
  price: string;
  priceRange?: string;
  bhkConfig: string;
  imageUrl?: string;
  imageUrls?: string[];
  builder: string;
  amenities: string[];
  rating: number;
  featured?: boolean;
  tags?: string[];
  description?: string;
}

export interface Project {
  id: number;
  url?: string;
  imageUrls?: string[];
  alt?: string;
  title?: string;
  name?: string;
  location?: string;
}

export interface UpcomingProject {
  id: string;
  title: string;
  location: string;
  city: string;
  state?: string;
  price: string;
  bhkConfig: string;
  imageUrl?: string;
  imageUrls?: string[];
  builder: string;
  priceRange?: string;
  amenities?: string[];
  launchDate?: string;
  possessionDate?: string;
  featured?: boolean;
  tags?: string[];
}
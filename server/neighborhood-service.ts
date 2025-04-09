import { Request, Response } from "express";

// Types for neighborhood insights
interface NeighborhoodInsight {
  neighborhood: string;
  city: string;
  data: {
    safetyScore: number;
    walkabilityScore: number;
    publicTransportScore: number;
    amenitiesScore: number;
    schoolsScore: number;
    parks: {
      count: number;
      list: string[];
    };
    hospitals: {
      count: number;
      list: string[];
    };
    schools: {
      count: number;
      list: string[];
    };
    restaurants: {
      count: number;
      topRated: string[];
    };
    shopping: {
      count: number;
      major: string[];
    };
    transitOptions: {
      busRoutes: string[];
      metroStations: string[];
      trainStations: string[];
    };
    demographics: {
      population: number;
      medianAge: number;
      medianIncome: number;
    };
    realEstateMetrics: {
      medianHomePrice: number;
      pricePerSqFt: number;
      avgRent: number;
      inventoryCount: number;
      daysOnMarket: number;
      yearOverYearAppreciation: number;
    };
  };
  description: string;
}

// Sample neighborhood data
const neighborhoodData: Record<string, NeighborhoodInsight> = {
  "manikonda": {
    neighborhood: "Manikonda",
    city: "Hyderabad",
    data: {
      safetyScore: 7.8,
      walkabilityScore: 7.2,
      publicTransportScore: 6.9,
      amenitiesScore: 8.3,
      schoolsScore: 8.0,
      parks: {
        count: 3,
        list: ["Manikonda Central Park", "Shaikpet Lake Garden", "Silicon Valley Park"]
      },
      hospitals: {
        count: 4,
        list: ["Continental Hospitals", "Care Hospitals", "Citizens Hospital", "KIMS Hospitals"]
      },
      schools: {
        count: 6,
        list: ["Delhi Public School", "Oakridge International School", "Chirec International School", "Meridian School", "Suchitra Academy", "Phoenix Greens International School"]
      },
      restaurants: {
        count: 55,
        topRated: ["Paradise Biryani", "Cream Stone", "Tabla", "Nautanki Gali", "Chinese Pavilion"]
      },
      shopping: {
        count: 25,
        major: ["Q City Mall", "Manikonda Market", "Shaikpet Main Road", "Lumbini Avenue"]
      },
      transitOptions: {
        busRoutes: ["5K", "5M", "10H", "222"],
        metroStations: ["Raidurg Metro Station"],
        trainStations: []
      },
      demographics: {
        population: 120000,
        medianAge: 30,
        medianIncome: 1200000
      },
      realEstateMetrics: {
        medianHomePrice: 11000000,
        pricePerSqFt: 7500,
        avgRent: 28000,
        inventoryCount: 280,
        daysOnMarket: 48,
        yearOverYearAppreciation: 8.2
      }
    },
    description: "Manikonda is a fast-growing residential area located near HITEC City in Hyderabad. It's positioned strategically close to major IT hubs like Gachibowli and Financial District, making it a preferred location for IT professionals. The area has seen rapid development with numerous gated communities, apartments, and villas. It offers good connectivity to other parts of the city and features a mix of modern amenities while maintaining relatively affordable housing compared to neighboring areas."
  },
  "indiranagar": {
    neighborhood: "Indiranagar",
    city: "Bangalore",
    data: {
      safetyScore: 8.2,
      walkabilityScore: 9.0,
      publicTransportScore: 8.5,
      amenitiesScore: 9.2,
      schoolsScore: 7.8,
      parks: {
        count: 3,
        list: ["Domlur Park", "HAL Park", "Indiranagar Park"]
      },
      hospitals: {
        count: 4,
        list: ["Manipal Hospital", "Practo Care", "Apollo Clinic", "Fortis"]
      },
      schools: {
        count: 5,
        list: ["Delhi Public School", "Frank Anthony Public School", "Harvest International School", "CMR National Public School", "The Deens Academy"]
      },
      restaurants: {
        count: 75,
        topRated: ["Toit Brewpub", "Truffles", "Windmills Craftworks", "Chinita", "Permit Room"]
      },
      shopping: {
        count: 42,
        major: ["Indiranagar 100ft Road", "12th Main Commercial Hub", "Indiranagar Market"]
      },
      transitOptions: {
        busRoutes: ["500C", "201B", "335E", "304"],
        metroStations: ["Indiranagar Metro Station"],
        trainStations: []
      },
      demographics: {
        population: 123000,
        medianAge: 32,
        medianIncome: 1500000
      },
      realEstateMetrics: {
        medianHomePrice: 15000000,
        pricePerSqFt: 11500,
        avgRent: 45000,
        inventoryCount: 234,
        daysOnMarket: 45,
        yearOverYearAppreciation: 8.3
      }
    },
    description: "Indiranagar is an upscale residential and commercial locality in East Bangalore. Known for its vibrant nightlife, trendy cafes, and boutique stores, it's a preferred area for young professionals and expatriates. The area is well-connected by the metro and has excellent infrastructure. The real estate market is premium with a mix of apartments and well-maintained independent houses."
  },
  "koramangala": {
    neighborhood: "Koramangala",
    city: "Bangalore",
    data: {
      safetyScore: 8.5,
      walkabilityScore: 8.7,
      publicTransportScore: 7.8,
      amenitiesScore: 9.5,
      schoolsScore: 8.2,
      parks: {
        count: 4,
        list: ["Koramangala Regional Park", "ST Bed Layout Park", "3rd Block Park", "National Games Village Park"]
      },
      hospitals: {
        count: 5,
        list: ["Apollo Hospitals", "Fortis Hospital", "Cloud Nine Hospital", "Motherhood Hospital", "Sparsh Hospital"]
      },
      schools: {
        count: 6,
        list: ["Delhi Public School", "National Public School", "Vibgyor High School", "Orchids International School", "The Valley School", "Bethany High School"]
      },
      restaurants: {
        count: 90,
        topRated: ["Meghana Foods", "Toit", "Fenny's", "Magnolia Bakery", "Third Wave Coffee Roasters"]
      },
      shopping: {
        count: 50,
        major: ["Forum Mall", "80 Feet Road", "Sony World Signal", "Koramangala Market"]
      },
      transitOptions: {
        busRoutes: ["201C", "500K", "201M", "314"],
        metroStations: [],
        trainStations: []
      },
      demographics: {
        population: 145000,
        medianAge: 29,
        medianIncome: 1800000
      },
      realEstateMetrics: {
        medianHomePrice: 16000000,
        pricePerSqFt: 12500,
        avgRent: 48000,
        inventoryCount: 267,
        daysOnMarket: 42,
        yearOverYearAppreciation: 9.2
      }
    },
    description: "Koramangala is a premium residential and commercial neighborhood in Southeast Bangalore. It's known as a hub for startups and tech companies, home to numerous cafes, restaurants, and entertainment venues. This upscale locality offers a vibrant lifestyle with excellent infrastructure. The real estate market features luxury apartments, multi-story buildings, and some premium independent houses. Its central location and accessibility make it one of the most sought-after areas in Bangalore."
  },
  "jayanagar": {
    neighborhood: "Jayanagar",
    city: "Bangalore",
    data: {
      safetyScore: 9.0,
      walkabilityScore: 8.8,
      publicTransportScore: 8.3,
      amenitiesScore: 8.9,
      schoolsScore: 9.1,
      parks: {
        count: 5,
        list: ["Jayanagar Park", "Madhavan Park", "JP Park", "Yediyur Lake", "Mini Forest"]
      },
      hospitals: {
        count: 4,
        list: ["Jayadeva Hospital", "Apollo Clinic", "Bangalore Hospital", "Sagar Hospital"]
      },
      schools: {
        count: 7,
        list: ["National High School", "Sri Kumaran Children's Home", "Carmel School", "Vijaya High School", "Poorna Prajna School", "Baldwin's School", "Sri Aurobindo School"]
      },
      restaurants: {
        count: 65,
        topRated: ["Vidyarthi Bhavan", "Brahmin's Coffee Bar", "CTR", "Maiya's", "Hotel Janatha"]
      },
      shopping: {
        count: 60,
        major: ["Jayanagar 4th Block Complex", "Cool Joint Circle", "Shopping Complex 9th Block", "Jayanagar 3rd Block Market"]
      },
      transitOptions: {
        busRoutes: ["12G", "15A", "27D", "177"],
        metroStations: ["Jayanagar Metro Station", "RV Road Metro Station"],
        trainStations: []
      },
      demographics: {
        population: 165000,
        medianAge: 36,
        medianIncome: 1400000
      },
      realEstateMetrics: {
        medianHomePrice: 14000000,
        pricePerSqFt: 10500,
        avgRent: 35000,
        inventoryCount: 198,
        daysOnMarket: 50,
        yearOverYearAppreciation: 7.5
      }
    },
    description: "Jayanagar is one of Bangalore's oldest and most well-planned residential areas, known for its wide tree-lined streets and organized layout. It offers a perfect blend of traditional charm and modern amenities with numerous parks, educational institutions, hospitals, and shopping complexes. The area is predominantly residential with many multi-generational family homes and newer apartment complexes. It's considered one of the safest and most family-friendly neighborhoods in Bangalore."
  },
  "whitefield": {
    neighborhood: "Whitefield",
    city: "Bangalore",
    data: {
      safetyScore: 7.5,
      walkabilityScore: 6.8,
      publicTransportScore: 6.5,
      amenitiesScore: 8.0,
      schoolsScore: 8.4,
      parks: {
        count: 3,
        list: ["ITPL Park", "Phoenix Greens", "Whitefield Central Park"]
      },
      hospitals: {
        count: 5,
        list: ["Columbia Asia Hospital", "Vydehi Hospital", "Narayana Multispecialty Hospital", "Cloudnine Hospital", "Manipal Hospital"]
      },
      schools: {
        count: 8,
        list: ["Whitefield Global School", "The International School Bangalore", "Inventure Academy", "Greenwood High", "Deens Academy", "EuroSchool", "Indus International School", "Ryan International School"]
      },
      restaurants: {
        count: 60,
        topRated: ["The Biergarten", "Windmills Craftworks", "Burma Burma", "Mainland China", "Via Milano"]
      },
      shopping: {
        count: 30,
        major: ["VR Bengaluru", "Phoenix Marketcity", "Forum Neighbourhood Mall", "Whitefield Central"]
      },
      transitOptions: {
        busRoutes: ["500", "500A", "500C", "500D"],
        metroStations: ["Whitefield Metro (under construction)"],
        trainStations: ["Whitefield Railway Station"]
      },
      demographics: {
        population: 185000,
        medianAge: 31,
        medianIncome: 1700000
      },
      realEstateMetrics: {
        medianHomePrice: 12000000,
        pricePerSqFt: 8500,
        avgRent: 32000,
        inventoryCount: 320,
        daysOnMarket: 55,
        yearOverYearAppreciation: 6.5
      }
    },
    description: "Whitefield has transformed from a quaint settlement to one of Bangalore's major IT hubs. The area houses numerous tech parks including ITPL and is home to many multinational companies. The rapid development has led to a mix of luxury apartments, gated communities, and commercial spaces. While traffic congestion can be a challenge, the area continues to develop with new infrastructure projects. Whitefield offers a suburban lifestyle with all modern amenities including international schools, hospitals, and shopping malls."
  },
  "malleswaram": {
    neighborhood: "Malleswaram",
    city: "Bangalore",
    data: {
      safetyScore: 9.2,
      walkabilityScore: 8.5,
      publicTransportScore: 8.7,
      amenitiesScore: 8.3,
      schoolsScore: 9.0,
      parks: {
        count: 3,
        list: ["Sankey Tank", "Malleswaram Grounds", "Cariappa Park"]
      },
      hospitals: {
        count: 3,
        list: ["MS Ramaiah Hospital", "People Tree Hospital", "Mallige Hospital"]
      },
      schools: {
        count: 6,
        list: ["MES School", "Stella Maris School", "Clarence High School", "National Public School", "Kendriya Vidyalaya", "St Joseph's School"]
      },
      restaurants: {
        count: 45,
        topRated: ["CTR", "Halli Mane", "Veena Stores", "New Krishna Bhavan", "Janatha Hotel"]
      },
      shopping: {
        count: 35,
        major: ["Malleswaram 8th Cross Market", "Sampige Road", "Mantri Square Mall", "Malleswaram Circle"]
      },
      transitOptions: {
        busRoutes: ["401", "252", "273", "99A"],
        metroStations: ["Mantri Square Sampige Road Metro", "Srirampura Metro"],
        trainStations: ["Malleswaram Railway Station"]
      },
      demographics: {
        population: 140000,
        medianAge: 39,
        medianIncome: 1350000
      },
      realEstateMetrics: {
        medianHomePrice: 13500000,
        pricePerSqFt: 10000,
        avgRent: 33000,
        inventoryCount: 165,
        daysOnMarket: 52,
        yearOverYearAppreciation: 7.0
      }
    },
    description: "Malleswaram is one of Bangalore's oldest and most culturally rich neighborhoods, known for its traditional charm and heritage. This predominantly residential area is characterized by tree-lined avenues, old bungalows, and a strong sense of community. It's home to numerous temples, traditional eateries, and music academies that reflect its cultural significance. While preserving its traditional essence, Malleswaram also offers modern amenities with good schools, hospitals, and shopping options. The area is well-connected and offers a peaceful living environment with a touch of old Bangalore charm."
  }
};

// Function to check if we have insights for a neighborhood
function hasNeighborhoodInsights(neighborhood: string): boolean {
  // Convert to lowercase and remove spaces for case-insensitive matching
  const normalizedNeighborhood = neighborhood.toLowerCase().replace(/\s+/g, '');
  
  // Check if the normalized neighborhood exists in our data
  return Object.keys(neighborhoodData).some(key => 
    key.toLowerCase() === normalizedNeighborhood ||
    neighborhoodData[key].neighborhood.toLowerCase().replace(/\s+/g, '') === normalizedNeighborhood
  );
}

// Function to get insights for a neighborhood
function getNeighborhoodInsights(neighborhood: string): NeighborhoodInsight | null {
  // Convert to lowercase and remove spaces for case-insensitive matching
  const normalizedNeighborhood = neighborhood.toLowerCase().replace(/\s+/g, '');
  
  // First try direct match with keys
  if (neighborhoodData[normalizedNeighborhood]) {
    return neighborhoodData[normalizedNeighborhood];
  }
  
  // Then try matching the neighborhood name
  for (const key of Object.keys(neighborhoodData)) {
    if (neighborhoodData[key].neighborhood.toLowerCase().replace(/\s+/g, '') === normalizedNeighborhood) {
      return neighborhoodData[key];
    }
  }
  
  return null;
}

// API endpoint handler for neighborhood insights
export async function getNeighborhoodInsightsHandler(req: Request, res: Response) {
  try {
    const { neighborhood } = req.query;
    
    if (!neighborhood || typeof neighborhood !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: "Neighborhood parameter is required" 
      });
    }
    
    const insights = getNeighborhoodInsights(neighborhood);
    
    if (!insights) {
      return res.status(404).json({ 
        success: false, 
        message: `No insights available for ${neighborhood}` 
      });
    }
    
    res.json({
      success: true,
      data: insights
    });
    
  } catch (error) {
    console.error("Neighborhood insights error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve neighborhood insights" 
    });
  }
}
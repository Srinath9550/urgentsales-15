// Add this to your existing properties.ts file

// GET /api/properties/commercial/featured
router.get("/commercial/featured", async (req, res) => {
  try {
    // In a real application, you would fetch this from your database
    // For now, we'll return mock data
    const featuredCommercialProperties = [
      {
        id: "c1",
        title: "Office Spaces, Shops & Showrooms",
        propertyType: "Commercial",
        locality: "Malkajgiri",
        city: "Hyderabad",
        price: "1.04",
        imageUrl:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        postedDate: "Dec 31, '24",
        builder: "Jain Construction",
      },
      {
        id: "c2",
        title: "Premium Retail Spaces",
        propertyType: "Commercial",
        locality: "Gachibowli",
        city: "Hyderabad",
        price: "2.15",
        imageUrl:
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        postedDate: "Dec 28, '24",
        builder: "Prestige Group",
      },
      {
        id: "c3",
        title: "IT Park Office Spaces",
        propertyType: "Commercial",
        locality: "HITEC City",
        city: "Hyderabad",
        price: "3.50",
        imageUrl:
          "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        postedDate: "Dec 25, '24",
        builder: "DLF Commercial",
      },
    ];

    res.json(featuredCommercialProperties);
  } catch (error) {
    console.error("Error fetching commercial properties:", error);
    res.status(500).json({ error: "Failed to fetch commercial properties" });
  }
});

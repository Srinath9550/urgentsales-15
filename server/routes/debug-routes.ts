import { Router } from 'express';
import { db } from '../db';
import { projects } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Debug endpoint to check project data by category
router.get('/projects-by-category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    // Validate category
    const validCategories = ['new_launch', 'featured', 'commercial', 'upcoming', 
                           'luxury', 'affordable', 'newly_listed', 'top_urgent', 'company_projects'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: "Invalid category", 
        validCategories 
      });
    }
    
    // Query projects by category
    const projectsData = await db.select({
      id: projects.id,
      title: projects.title,
      category: projects.category,
      imageUrls: projects.imageUrls,
      imageUrlsCount: projects.imageUrls,
      createdAt: projects.createdAt
    })
    .from(projects)
    .where(eq(projects.category, category))
    .limit(10);
    
    // Process the results to add counts
    const processedData = projectsData.map(project => ({
      ...project,
      imageUrlsCount: Array.isArray(project.imageUrls) ? project.imageUrls.length : 0,
      hasImageUrls: Array.isArray(project.imageUrls) && project.imageUrls.length > 0,
      firstImageUrl: Array.isArray(project.imageUrls) && project.imageUrls.length > 0 
        ? project.imageUrls[0] 
        : null
    }));
    
    return res.status(200).json({
      category,
      count: processedData.length,
      projects: processedData
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
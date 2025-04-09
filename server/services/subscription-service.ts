import { pool } from '../db';

export class SubscriptionService {
  // Check if user has an active subscription
  static async getUserActiveSubscription(userId: number) {
    try {
      const result = await pool.query(
        `SELECT us.*, ap.* 
         FROM user_subscriptions us
         JOIN ad_packages ap ON us.package_id = ap.id
         WHERE us.user_id = $1 AND us.is_active = true
         ORDER BY us.created_at DESC
         LIMIT 1`,
        [userId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      throw error;
    }
  }
  
  // Check if user can post a property based on their subscription
  static async canUserPostProperty(userId: number) {
    try {
      // Check for free users (no subscription)
      const userResult = await pool.query(
        'SELECT subscription_level FROM users WHERE id = $1',
        [userId]
      );
      
      if (userResult.rows.length === 0) {
        return { canPost: false, reason: 'User not found' };
      }
      
      // Get active subscription
      const subscription = await this.getUserActiveSubscription(userId);
      
      // If no subscription, check if they're on free plan
      if (!subscription) {
        // Check how many properties they've already posted
        const propertiesResult = await pool.query(
          'SELECT COUNT(*) FROM properties WHERE user_id = $1',
          [userId]
        );
        
        const propertiesCount = parseInt(propertiesResult.rows[0].count);
        
        // Free users can post up to 3 properties
        if (propertiesCount >= 3) {
          return { 
            canPost: false, 
            reason: 'You have reached the maximum number of properties for the free plan. Please upgrade to post more properties.' 
          };
        }
        
        return { canPost: true, subscription: null };
      }
      
      // Check if they have remaining properties in their subscription
      if (subscription.properties_remaining <= 0) {
        return { 
          canPost: false, 
          reason: 'You have used all your property listings in your current subscription. Please upgrade to post more properties.' 
        };
      }
      
      return { canPost: true, subscription };
    } catch (error) {
      console.error('Error checking if user can post property:', error);
      throw error;
    }
  }
  
  // Decrement the remaining properties count when a user posts a property
  static async decrementRemainingProperties(userId: number) {
    try {
      const subscription = await this.getUserActiveSubscription(userId);
      
      if (!subscription) {
        return;
      }
      
      await pool.query(
        `UPDATE user_subscriptions 
         SET properties_remaining = properties_remaining - 1,
             properties_listed = properties_listed + 1
         WHERE id = $1`,
        [subscription.id]
      );
    } catch (error) {
      console.error('Error decrementing remaining properties:', error);
      throw error;
    }
  }
}
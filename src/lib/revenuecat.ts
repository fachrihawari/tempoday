import { toastStore } from '../stores/toast.svelte';
import { reactiveRouter } from '../stores/router.svelte';

// RevenueCat configuration from environment variables
const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY || 'YOUR_REVENUECAT_WEB_API_KEY';
const DEBUG_MODE = import.meta.env.VITE_DEBUG_REVENUECAT === 'true';

export interface DonationTier {
  identifier: string;
  title: string;
  description: string;
  price: string;
  amount: number;
  popular?: boolean;
}

// Donation tiers - these represent different donation amounts
export const DONATION_TIERS: DonationTier[] = [
  {
    identifier: 'small_coffee',
    title: 'Small Coffee',
    description: 'Buy us a small coffee',
    price: '$3',
    amount: 3,
  },
  {
    identifier: 'large_coffee',
    title: 'Large Coffee',
    description: 'Buy us a large coffee',
    price: '$5',
    amount: 5,
  },
  {
    identifier: 'lunch',
    title: 'Lunch',
    description: 'Buy us lunch',
    price: '$10',
    amount: 10,
  },
  {
    identifier: 'generous_support',
    title: 'Generous Support',
    description: 'Super generous support',
    price: '$25',
    amount: 25,
  },
];

class RevenueCatService {
  private isDemo = true; // For MVP, we'll start with demo mode
  private purchasesInstance: any = null; // Store the configured instance

  async initialize(): Promise<boolean> {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.warn('RevenueCat: Not in browser environment');
        return false;
      }

      // Check if we have a valid API key
      if (!REVENUECAT_API_KEY || REVENUECAT_API_KEY === 'YOUR_REVENUECAT_WEB_API_KEY') {
        if (DEBUG_MODE) {
          console.warn('RevenueCat: API key not configured. Using demo mode.');
        }
        this.isDemo = true;
        return true;
      }

      // Try to initialize RevenueCat with the provided API key
      try {
        const { Purchases } = await import('@revenuecat/purchases-js');
        
        // Generate a unique anonymous user ID
        const anonymousUserId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.purchasesInstance = Purchases.configure({
          apiKey: REVENUECAT_API_KEY,
          appUserId: anonymousUserId,
        });

        this.isDemo = false;
        console.log('RevenueCat initialized successfully with API key');
        return true;
      } catch (revenueCatError) {
        console.error('Failed to initialize RevenueCat, falling back to demo mode:', revenueCatError);
        this.isDemo = true;
        return true;
      }
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      this.isDemo = true;
      return false;
    }
  }

  async makeDonation(tier: DonationTier): Promise<boolean> {
    try {
      if (this.isDemo) {
        // Demo mode - simulate successful donation
        if (DEBUG_MODE) {
          console.log('Demo mode: Simulating donation for', tier.title, tier.price);
        }

        // Navigate to thanks page after successful donation
        setTimeout(() => {
          reactiveRouter.navigate('/thanks');
        }, 1000); // Small delay to let user see the toast

        // In a real implementation, you would:
        // 1. Open RevenueCat payment flow
        // 2. Handle the payment result
        // 3. Track the donation in analytics
        // 4. Update user's donation status

        return true;
      }

      // Real RevenueCat implementation (when enabled)
      return await this.processRealDonation(tier);
    } catch (error: any) {
      console.error('Donation failed:', error);

      // Handle user cancellation gracefully
      if (error.userCancelled) {
        return false;
      }

      toastStore.error('Donation failed. Please try again.');
      return false;
    }
  }

  private async processRealDonation(tier: DonationTier): Promise<boolean> {
    // This method handles real RevenueCat donations
    try {
      if (!this.purchasesInstance) {
        throw new Error('RevenueCat not initialized');
      }

      // Get available offerings (RevenueCat should already be configured)
      const offerings = await this.purchasesInstance.getOfferings();

      if (!offerings.current) {
        throw new Error('No current offering available');
      }

      // Find the product for this tier
      const product = offerings.current.availablePackages.find(
        (pkg: any) => pkg.identifier === tier.identifier
      );

      if (!product) {
        throw new Error(`Product ${tier.identifier} not found`);
      }

      // Make the purchase
      const purchaseResult = await this.purchasesInstance.purchase({
        rcPackage: product
      });

      if (purchaseResult.customerInfo.entitlements.active) {
        setTimeout(() => {
          reactiveRouter.navigate('/thanks');
        }, 1000); // Small delay to let user see the toast
        
        return true;
      } else {
        throw new Error('Purchase was not successful');
      }
    } catch (error) {
      console.error('Real donation processing failed:', error);
      throw error;
    }
  }



  // For future RevenueCat integration
  async setupRevenueCat(apiKey: string): Promise<boolean> {
    try {
      // This would be implemented when you're ready to use real RevenueCat
      console.log('Setting up RevenueCat with API key:', apiKey.substring(0, 10) + '...');

      // Import and configure RevenueCat dynamically
      const { Purchases } = await import('@revenuecat/purchases-js');

      // Generate a unique anonymous user ID
      const anonymousUserId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      this.purchasesInstance = Purchases.configure({
        apiKey: apiKey,
        appUserId: anonymousUserId,
      });

      this.isDemo = false;
      console.log('RevenueCat configured successfully');
      return true;
    } catch (error) {
      console.error('Failed to setup RevenueCat:', error);
      return false;
    }
  }

  // Helper method to check if we're in demo mode
  isDemoMode(): boolean {
    return this.isDemo;
  }

  // Method to switch to production mode (when you have RevenueCat configured)
  enableProductionMode(apiKey: string) {
    return this.setupRevenueCat(apiKey);
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();

// Initialize on module load
if (typeof window !== 'undefined') {
  revenueCatService.initialize().catch(error => {
    console.error('Failed to auto-initialize RevenueCat:', error);
  });
}

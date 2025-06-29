// RevenueCat Integration for TempoDay Donations
import Purchases, { type CustomerInfo, type PurchasesOffering, type PurchasesPackage } from '@revenuecat/purchases-js';

export interface DonationTier {
  id: string;
  title: string;
  description: string;
  price: string;
  emoji: string;
  benefits: string[];
  isPopular?: boolean;
}

export interface RevenueCatConfig {
  apiKey: string;
  userId?: string;
}

export class DonationManager {
  private isInitialized = false;
  private offerings: PurchasesOffering[] = [];
  
  // Predefined donation tiers that match your RevenueCat products
  public readonly donationTiers: DonationTier[] = [
    {
      id: 'coffee_donation',
      title: 'Buy me a coffee',
      description: 'Support development with a small donation',
      price: '$3.99',
      emoji: '☕',
      benefits: ['Help keep TempoDay free', 'Support future updates'],
    },
    {
      id: 'lunch_donation',
      title: 'Buy me lunch',
      description: 'Show your appreciation for TempoDay',
      price: '$9.99',
      emoji: '🍕',
      benefits: ['Priority feature requests', 'Early access to updates', 'Special thanks'],
      isPopular: true,
    },
    {
      id: 'dinner_donation',
      title: 'Buy me dinner',
      description: 'Generous support for continued development',
      price: '$19.99',
      emoji: '🍽️',
      benefits: ['Direct developer contact', 'Custom feature requests', 'Lifetime gratitude'],
    },
    {
      id: 'premium_supporter',
      title: 'Premium Supporter',
      description: 'Ultimate support for TempoDay',
      price: '$49.99',
      emoji: '🌟',
      benefits: ['All previous benefits', 'Beta testing access', 'Influence roadmap', 'Special badge'],
    },
  ];

  /**
   * Initialize RevenueCat with your API key
   */
  async initialize(config: RevenueCatConfig): Promise<void> {
    if (this.isInitialized) {
      console.log('RevenueCat already initialized');
      return;
    }

    try {
      await Purchases.configure({
        apiKey: config.apiKey,
        appUserID: config.userId,
      });

      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');
      
      // Load available offerings
      await this.loadOfferings();
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw new Error('Failed to initialize payment system');
    }
  }

  /**
   * Load available offerings from RevenueCat
   */
  async loadOfferings(): Promise<PurchasesOffering[]> {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const offerings = await Purchases.getOfferings();
      this.offerings = offerings.all ? Object.values(offerings.all) : [];
      console.log('Loaded offerings:', this.offerings);
      return this.offerings;
    } catch (error) {
      console.error('Failed to load offerings:', error);
      throw new Error('Failed to load donation options');
    }
  }

  /**
   * Get available donation packages
   */
  getDonationPackages(): PurchasesPackage[] {
    const currentOffering = this.offerings.find(offering => offering.identifier === 'donations');
    return currentOffering?.availablePackages || [];
  }

  /**
   * Purchase a donation package
   */
  async makeDonation(packageId: string): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
    if (!this.isInitialized) {
      return { success: false, error: 'Payment system not initialized' };
    }

    try {
      const packages = this.getDonationPackages();
      const selectedPackage = packages.find(pkg => pkg.identifier === packageId);

      if (!selectedPackage) {
        return { success: false, error: 'Donation option not found' };
      }

      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      
      console.log('Donation successful:', customerInfo);
      return { success: true, customerInfo };
    } catch (error: any) {
      console.error('Donation failed:', error);
      
      // Handle specific RevenueCat errors
      if (error.userCancelled) {
        return { success: false, error: 'Donation cancelled' };
      }
      
      return { 
        success: false, 
        error: error.message || 'Donation failed. Please try again.' 
      };
    }
  }

  /**
   * Get customer info and purchase history
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this.isInitialized) {
      return null;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  /**
   * Check if user has made any donations
   */
  async hasMadeDonations(): Promise<boolean> {
    const customerInfo = await this.getCustomerInfo();
    if (!customerInfo) return false;

    // Check if user has any non-subscription purchases (donations)
    const purchases = customerInfo.nonSubscriptionTransactions;
    return purchases.length > 0;
  }

  /**
   * Get total donation amount (requires custom implementation based on your needs)
   */
  async getTotalDonationAmount(): Promise<number> {
    const customerInfo = await this.getCustomerInfo();
    if (!customerInfo) return 0;

    // This would need to be implemented based on how you track donation amounts
    // You might need to store this information separately or calculate from purchase history
    return 0;
  }

  /**
   * Restore purchases (useful for users who switch devices)
   */
  async restorePurchases(): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
    if (!this.isInitialized) {
      return { success: false, error: 'Payment system not initialized' };
    }

    try {
      const { customerInfo } = await Purchases.restorePurchases();
      return { success: true, customerInfo };
    } catch (error: any) {
      console.error('Failed to restore purchases:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to restore donations' 
      };
    }
  }

  /**
   * Check if RevenueCat is properly initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const donationManager = new DonationManager();

// Environment configuration helper
export function getRevenueCatConfig(): RevenueCatConfig {
  // In production, these should come from environment variables
  return {
    apiKey: import.meta.env.VITE_REVENUECAT_API_KEY || 'your_revenuecat_public_api_key_here',
    userId: undefined, // Let RevenueCat generate anonymous user ID
  };
}
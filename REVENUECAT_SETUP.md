# RevenueCat Integration Guide for TempoDay

## Overview

TempoDay now includes RevenueCat integration for handling donations. The current implementation runs in **demo mode** by default, which simulates successful donations without processing real payments.

## Current Implementation

### Demo Mode Features
- ✅ Beautiful donation modal with multiple tier options
- ✅ Simulated donation flow with success messages
- ✅ Toast notifications for user feedback
- ✅ Full UI/UX for donation experience
- ✅ TypeScript support with proper error handling

### Donation Tiers
- **Small Coffee** ($3) - Buy us a small coffee
- **Large Coffee** ($5) - Buy us a large coffee ⭐ *Most Popular*
- **Lunch** ($10) - Buy us lunch
- **Generous Support** ($25) - Super generous support

## Setting up RevenueCat for Production

### 1. Create RevenueCat Account
1. Go to [RevenueCat](https://www.revenuecat.com/)
2. Sign up for a free account
3. Create a new app project

### 2. Configure Web Platform
1. In your RevenueCat dashboard, go to **Apps**
2. Add a new platform: **Web**
3. Get your **Web API Key** from the API Keys section

### 3. Create Products
Create the following products in RevenueCat that match our donation tiers:

| Product ID | Price | Description |
|------------|-------|-------------|
| `small_coffee` | $3.00 | Buy us a small coffee |
| `large_coffee` | $5.00 | Buy us a large coffee |
| `lunch` | $10.00 | Buy us lunch |
| `generous_support` | $25.00 | Super generous support |

### 4. Create Offering
1. Go to **Offerings** in RevenueCat dashboard
2. Create a new offering (e.g., "Donations")
3. Add all the products above to this offering
4. Set it as your current offering

### 5. Update Code for Production

#### Environment Variables
Create a `.env.local` file (not committed to git):
```env
VITE_REVENUECAT_API_KEY=your_actual_api_key_here
```

#### Update RevenueCat Service
In `src/lib/revenuecat.ts`, replace the demo API key:

```typescript
// Change this line:
const REVENUECAT_API_KEY = 'YOUR_REVENUECAT_WEB_API_KEY';

// To this:
const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY;
```

#### Enable Production Mode
Once you have a valid API key, the service will automatically switch from demo mode to production mode.

### 6. Testing Production Integration

#### Test Donations
```typescript
// In browser console or your app:
import { revenueCatService } from './src/lib/revenuecat.js';

// Check if demo mode is disabled
console.log('Demo mode:', revenueCatService.isDemoMode()); // Should be false

// Test a donation
await revenueCatService.makeDonation(DONATION_TIERS[1]); // Large coffee
```

## Usage in App

### Opening Donation Modal
The donation modal is already integrated in the Settings page:

```svelte
<DonationModal bind:open={showDonationModal} />
```

### Triggering Donations
Users can donate by:
1. Going to Settings page
2. Expanding "Support TempoDay" section
3. Clicking "Make a Donation" button
4. Selecting a donation tier

### User Experience
1. **Demo Mode**: Shows success message immediately
2. **Production Mode**: Opens RevenueCat payment flow
3. **Error Handling**: Graceful error messages and user cancellation handling
4. **Success Feedback**: Toast notifications and modal auto-close

## Advanced Features (Optional)

### User Identification
```typescript
// Identify users for analytics (optional)
await revenueCatService.identifyUser('user-unique-id');
```

### Restore Purchases
```typescript
// For users who want to restore previous donations
await revenueCatService.restorePurchases();
```

### Customer Info
```typescript
// Get customer purchase history
const customerInfo = await revenueCatService.getCustomerInfo();
```

## Security Considerations

1. **API Keys**: Never commit API keys to git
2. **Environment Variables**: Use Vite environment variables for sensitive data
3. **HTTPS**: Ensure your production app uses HTTPS
4. **Validation**: RevenueCat handles payment validation server-side

## Troubleshooting

### Common Issues

1. **"Demo mode" persists**: Check API key is properly set in environment variables
2. **Payment fails**: Verify products exist in RevenueCat dashboard
3. **No offerings**: Ensure you've created and activated an offering
4. **CORS errors**: Check your domain is whitelisted in RevenueCat settings

### Development vs Production

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| Payment Processing | ❌ Simulated | ✅ Real payments |
| Toast Notifications | ✅ Works | ✅ Works |
| Error Handling | ✅ Works | ✅ Works |
| User Cancellation | ✅ Works | ✅ Works |
| Purchase Restoration | ❌ Not available | ✅ Available |

## Support

For RevenueCat-specific issues:
- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [RevenueCat Web SDK](https://docs.revenuecat.com/docs/web)
- [RevenueCat Support](https://support.revenuecat.com/)

For TempoDay integration issues, check the browser console for error messages and ensure all dependencies are properly installed.

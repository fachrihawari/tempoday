// Router store for Svelte 5 - iframe compatible
let currentPath = $state('/');
let isInitialized = false;
let useHashRouting = false;

// Detect if we're in an iframe or restricted environment
function detectEnvironment() {
  try {
    if (typeof window === 'undefined') return false;
    
    // Check if we're in an iframe
    const inIframe = window.self !== window.top;
    
    // Check if history API is available
    const hasHistoryAPI = !!(window.history && window.history.pushState);
    
    // Use hash routing if in iframe or no history API
    useHashRouting = inIframe || !hasHistoryAPI;
    
    return true;
  } catch (error) {
    useHashRouting = true; // Fallback to hash routing
    return false;
  }
}

// Get current path from URL (either pathname or hash)
function getCurrentPath(): string {
  try {
    if (typeof window === 'undefined') return '/';
    
    if (useHashRouting) {
      // Use hash for routing (#/path)
      const hash = window.location.hash;
      return hash.startsWith('#') ? hash.slice(1) || '/' : '/';
    } else {
      // Use pathname for routing
      return window.location.pathname || '/';
    }
  } catch (error) {
    console.debug('getCurrentPath error:', error);
    return '/';
  }
}

// Update URL (either history or hash)
function updateURL(path: string) {
  try {
    if (typeof window === 'undefined') return;
    
    if (useHashRouting) {
      // Update hash without triggering navigation
      const newHash = path === '/' ? '#/' : `#${path}`;
      if (window.location.hash !== newHash) {
        window.location.hash = newHash;
      }
    } else {
      // Use history API
      if (window.history && window.history.pushState) {
        window.history.pushState({}, '', path);
      }
    }
  } catch (error) {
    console.debug('updateURL error:', error);
  }
}

// Export a function that returns the current path
export function activePath() {
  return currentPath;
}

export function navigate(newPath: string) {
  if (!newPath || typeof newPath !== 'string') {
    console.warn('Invalid path provided to navigate:', newPath);
    return;
  }
  
  // Normalize path (ensure it starts with /)
  const normalizedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
  
  // Only update if path is different
  if (currentPath !== normalizedPath) {
    currentPath = normalizedPath;
    updateURL(normalizedPath);
  }
}

export function initializeRouter() {
  if (isInitialized) {
    console.warn("Router is already initialized");
    return;
  }
  
  // Detect environment and set routing strategy
  detectEnvironment();
  
  // Set initial path from current URL
  currentPath = getCurrentPath();
  
  // Handle browser navigation events
  const handleNavigation = () => {
    const newPath = getCurrentPath();
    if (currentPath !== newPath) {
      currentPath = newPath;
    }
  };
  
  try {
    if (typeof window !== 'undefined' && window.addEventListener) {
      if (useHashRouting) {
        // Listen for hash changes
        window.addEventListener('hashchange', handleNavigation);
      } else {
        // Listen for popstate events
        window.addEventListener('popstate', handleNavigation);
      }
    }
  } catch (error) {
    console.debug('Navigation listener setup error:', error);
  }
  
  isInitialized = true;
  
  // Return cleanup function
  return () => {
    try {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        if (useHashRouting) {
          window.removeEventListener('hashchange', handleNavigation);
        } else {
          window.removeEventListener('popstate', handleNavigation);
        }
      }
    } catch (error) {
      console.debug('Navigation cleanup error:', error);
    }
    isInitialized = false;
  };
}
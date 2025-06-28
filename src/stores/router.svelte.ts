let currentPath = $state('/');
let isInitialized = false;

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
    
    // Try to update browser history, but don't fail if it doesn't work (iframe restrictions)
    try {
      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
        window.history.pushState({}, '', normalizedPath);
      }
    } catch (error) {
      // Silently handle iframe restrictions
      console.debug('History API not available or restricted:', error);
    }
  }
}

export function initializeRouter() {
  if (isInitialized) {
    console.warn("Router is already initialized");
    return;
  }
  
  // Set initial path from current URL, with fallback to '/'
  try {
    currentPath = (typeof window !== 'undefined' && window.location) 
      ? (window.location.pathname || '/') 
      : '/';
  } catch (error) {
    // Fallback for iframe restrictions
    currentPath = '/';
    console.debug('Location API not available or restricted:', error);
  }
  
  // Handle browser back/forward buttons if available
  const handlePopState = () => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        currentPath = window.location.pathname || '/';
      }
    } catch (error) {
      // Silently handle iframe restrictions
      console.debug('PopState handling restricted:', error);
    }
  };
  
  try {
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('popstate', handlePopState);
    }
  } catch (error) {
    // Silently handle iframe restrictions
    console.debug('PopState listener not available:', error);
  }
  
  isInitialized = true;
  
  // Return cleanup function
  return () => {
    try {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('popstate', handlePopState);
      }
    } catch (error) {
      // Silently handle cleanup restrictions
      console.debug('PopState cleanup restricted:', error);
    }
    isInitialized = false;
  };
}
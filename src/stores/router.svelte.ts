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
    window.history.pushState({}, '', normalizedPath);
  }
}

export function initializeRouter() {
  if (isInitialized) {
    console.warn("Router is already initialized");
    return;
  }
  
  // Set initial path from current URL
  currentPath = window.location.pathname || '/';
  
  // Handle browser back/forward buttons
  const handlePopState = () => {
    currentPath = window.location.pathname || '/';
  };
  
  window.addEventListener('popstate', handlePopState);
  isInitialized = true;
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
    isInitialized = false;
  };
}
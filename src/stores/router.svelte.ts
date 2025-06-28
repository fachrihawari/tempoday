// WebContainer-compatible router for Svelte 5
let currentPath = $state('/');

// Export a function that returns the current path
export function activePath() {
  return currentPath;
}

// WebContainer-safe navigation - only updates internal state
export function navigate(newPath: string) {
  if (!newPath || typeof newPath !== 'string') {
    console.warn('Invalid path provided to navigate:', newPath);
    return;
  }
  
  // Normalize path (ensure it starts with /)
  const normalizedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
  
  // Only update internal state - NO URL manipulation in WebContainer
  currentPath = normalizedPath;
  
  console.log('Navigated to:', normalizedPath); // Debug log
}

// Simple initialization for WebContainer
export function initializeRouter() {
  // In WebContainer, don't try to read window.location
  // Just start with default route
  currentPath = '/';
  
  console.log('Router initialized with path:', currentPath);
  
  // Return a no-op cleanup function
  return () => {
    console.log('Router cleanup called');
  };
}
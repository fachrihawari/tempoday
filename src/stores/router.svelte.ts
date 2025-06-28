// Simple state-based router for Svelte 5 - works in any environment
let currentPath = $state('/');

// Export a function that returns the current path
export function activePath() {
  return currentPath;
}

// Simple navigation that only updates internal state
export function navigate(newPath: string) {
  if (!newPath || typeof newPath !== 'string') {
    console.warn('Invalid path provided to navigate:', newPath);
    return;
  }
  
  // Normalize path (ensure it starts with /)
  const normalizedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
  
  // Update internal state
  currentPath = normalizedPath;
  
  window.location.href = normalizedPath; // Update the browser URL
  console.log('Navigated to:', normalizedPath); // Debug log
}

// Simple initialization that doesn't depend on browser APIs
export function initializeRouter() {
  currentPath = window.location.pathname || '/';
  
  // Return a no-op cleanup function
  return () => {
    console.log('Router cleanup called');
  };
}
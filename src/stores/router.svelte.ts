class ReactiveRouter {
  #currentPath = $state('/');
  #isInitialized = false;

  // Get the current path
  get activePath() {
    return this.#currentPath;
  }

  // WebContainer-safe navigation - only updates internal state
  navigate(newPath: string) {
    if (!newPath || typeof newPath !== 'string') {
      console.warn('Invalid path provided to navigate:', newPath);
      return;
    }

    // Normalize path (ensure it starts with /)
    const normalizedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;

    // Only update internal state - NO URL manipulation in WebContainer
    this.#currentPath = normalizedPath;
    console.log('Navigated to:', normalizedPath); // Debug log

    window.history.pushState({}, '', normalizedPath);
  }

  // Simple initialization for WebContainer
  initialize() {
    if (this.#isInitialized) {
      console.warn('Router is already initialized');
      return;
    }

    // In WebContainer, don't try to read window.location
    // Just start with default route
    this.#currentPath = window.location.pathname || '/';
    this.#isInitialized = true;

    console.log('Router initialized with path:', this.#currentPath);

    // Return a cleanup function
    return () => {
      console.log('Router cleanup called');
      this.#isInitialized = false;
    };
  }

  // Check if a path is currently active
  isActive(path: string): boolean {
    return this.#currentPath === path;
  }

  // Check if current path starts with a prefix
  startsWith(prefix: string): boolean {
    return this.#currentPath.startsWith(prefix);
  }

  // Reset router to initial state
  reset() {
    this.#currentPath = '/';
    this.#isInitialized = false;
    console.log('Router reset');
  }
}

export const reactiveRouter = new ReactiveRouter();

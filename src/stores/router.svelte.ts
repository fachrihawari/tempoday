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

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    }
  }

  // Simple initialization for WebContainer
  initialize() {
    if (this.#isInitialized) {
      console.warn('Router is already initialized');
      return;
    }

    this.#currentPath = window.location.pathname || '/';
    this.#isInitialized = true;

    // Listen for browser navigation events
    window.addEventListener('popstate', this.#handlePopState);

    console.log('Router initialized with path:', this.#currentPath);

    // Return a cleanup function
    return () => {
      window.removeEventListener('popstate', this.#handlePopState);
      console.log('Router cleanup called');
      this.#isInitialized = false;
    };
  }

  // Private handler for popstate
  #handlePopState = () => {
    this.#currentPath = window.location.pathname || '/';
    console.log('Router popstate, updated path:', this.#currentPath);
  };

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

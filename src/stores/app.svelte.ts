export interface AppState {
  dbReady: boolean;
  dbError: string | null;
  initializing: boolean;
  selectedDate: Date;
}

// App state using Svelte 5 runes
export const appState = $state<AppState>({
  dbReady: false,
  dbError: null,
  initializing: true,
  selectedDate: new Date(),
});

// Helper functions to update app state
export function setDbReady() {
  appState.dbReady = true;
  appState.dbError = null;
  appState.initializing = false;
}

export function setDbError(error: string) {
  appState.dbReady = false;
  appState.dbError = error;
  appState.initializing = false;
}

export function setSelectedDate(date: Date) {
  appState.selectedDate = date;
}

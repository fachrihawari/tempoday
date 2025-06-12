export interface AppState {
  selectedDate: Date;
}

// App state using Svelte 5 runes
export const appState = $state<AppState>({
  selectedDate: new Date(),
});

// Helper functions to update app state
export function setSelectedDate(date: Date) {
  appState.selectedDate = date;
}

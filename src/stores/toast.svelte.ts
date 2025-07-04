export interface ToastData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

class ToastStore {
  toasts = $state<ToastData[]>([]);

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  add(toast: Omit<ToastData, 'id'>): string {
    const id = this.generateId();
    const newToast: ToastData = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast,
    };

    this.toasts = [...this.toasts, newToast];
    return id;
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  }

  clear(): void {
    this.toasts = [];
  }

  // Convenience methods
  success(message: string, title?: string, duration?: number): string {
    return this.add({ type: 'success', message, title, duration });
  }

  error(message: string, title?: string, duration?: number): string {
    return this.add({ type: 'error', message, title, duration });
  }

  warning(message: string, title?: string, duration?: number): string {
    return this.add({ type: 'warning', message, title, duration });
  }

  info(message: string, title?: string, duration?: number): string {
    return this.add({ type: 'info', message, title, duration });
  }
}

export const toastStore = new ToastStore();

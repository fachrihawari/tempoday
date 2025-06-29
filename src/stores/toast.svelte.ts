// Toast Store for managing toast notifications using Svelte 5 runes
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

  private addToast(toast: Omit<ToastData, 'id'>): void {
    const newToast: ToastData = {
      ...toast,
      id: this.generateId(),
      dismissible: toast.dismissible ?? true,
      duration: toast.duration ?? 4000,
    };

    this.toasts = [...this.toasts, newToast];

    // Auto-remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        this.remove(newToast.id);
      }, newToast.duration);
    }
  }

  success(message: string, title?: string, options?: Partial<ToastData>): void {
    this.addToast({
      type: 'success',
      message,
      title,
      ...options,
    });
  }

  error(message: string, title?: string, options?: Partial<ToastData>): void {
    this.addToast({
      type: 'error',
      message,
      title,
      ...options,
    });
  }

  warning(message: string, title?: string, options?: Partial<ToastData>): void {
    this.addToast({
      type: 'warning',
      message,
      title,
      ...options,
    });
  }

  info(message: string, title?: string, options?: Partial<ToastData>): void {
    this.addToast({
      type: 'info',
      message,
      title,
      ...options,
    });
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  clear(): void {
    this.toasts = [];
  }
}

export const toastStore = new ToastStore();
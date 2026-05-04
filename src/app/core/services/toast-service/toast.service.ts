import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private show(message: string, type: ToastType) {

    const toast = document.createElement('div');

    const styles = {
      success: 'bg-green-50 border-green-500 text-green-800',
      error: 'bg-red-50 border-red-500 text-red-800',
      warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
      info: 'bg-blue-50 border-blue-500 text-blue-800'
    };

    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };

    toast.className = `
      fixed top-5 right-5 z-[99999]
      min-w-[300px] max-w-[380px]
      p-4 rounded-xl border-l-4 shadow-lg
      transition-all duration-300 ease-out
      opacity-0 translate-y-[-10px]
      ${styles[type]}
    `;

    toast.innerHTML = `
      <div class="flex items-start gap-3">
        
        <!-- icon -->
        <div class="text-sm font-bold mt-0.5">
          ${this.getIcon(type)}
        </div>

        <!-- content -->
        <div class="flex-1">
          <p class="font-semibold text-sm mb-1">
            ${titles[type]}
          </p>
          <p class="text-xs leading-relaxed opacity-90">
            ${message}
          </p>
        </div>

        <!-- close -->
        <button class="text-xs opacity-60 hover:opacity-100" onclick="this.parentElement.parentElement.remove()">
          ✕
        </button>

      </div>
    `;

    document.body.appendChild(toast);

    // animate in
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-[-10px]');
    });

    // auto remove after 4s
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-[-10px]');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  private getIcon(type: ToastType): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '!';
      case 'info': return 'i';
    }
  }

  success(msg: string) {
    this.show(msg, 'success');
  }

  error(msg: string) {
    this.show(msg, 'error');
  }

  warning(msg: string) {
    this.show(msg, 'warning');
  }

  info(msg: string) {
    this.show(msg, 'info');
  }
}
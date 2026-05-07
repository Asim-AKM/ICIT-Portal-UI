import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  confirm(options: {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    icon?: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      const {
        title = 'Are you sure?',
        message = 'This action cannot be undone.',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        type = 'warning',
        icon = 'fas fa-exclamation-triangle'
      } = options;

      const colorMap = {
        danger: { bg: 'bg-red-500', hover: 'hover:bg-red-600', ring: 'ring-red-500', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
        warning: { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', ring: 'ring-amber-500', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
        info: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', ring: 'ring-blue-500', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }
      };

      const colors = colorMap[type];

      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in';
      
      // Create dialog
      overlay.innerHTML = `
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
          <div class="absolute top-0 left-0 right-0 h-1 ${colors.bg}"></div>
          
          <div class="p-8 text-center">
            <!-- Icon -->
            <div class="w-20 h-20 ${colors.iconBg} rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="${icon} ${colors.iconColor} text-3xl"></i>
            </div>
            
            <!-- Title -->
            <h3 class="text-xl font-black text-slate-900 mb-2">${title}</h3>
            
            <!-- Message -->
            <p class="text-sm text-slate-500 leading-relaxed mb-8">${message}</p>
            
            <!-- Buttons -->
            <div class="flex gap-3">
              <button id="cancelBtn" 
                class="flex-1 px-5 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200">
                ${cancelText}
              </button>
              <button id="confirmBtn" 
                class="flex-1 px-5 py-3 text-sm font-bold text-white ${colors.bg} ${colors.hover} rounded-xl transition-all duration-200 shadow-lg hover:scale-[1.02]">
                ${confirmText}
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Event listeners
      const cancelBtn = overlay.querySelector('#cancelBtn')!;
      const confirmBtn = overlay.querySelector('#confirmBtn')!;

      const cleanup = (result: boolean) => {
        overlay.classList.add('animate-fade-out');
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 200);
        resolve(result);
      };

      cancelBtn.addEventListener('click', () => cleanup(false));
      confirmBtn.addEventListener('click', () => cleanup(true));
      
      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cleanup(false);
      });

      // Close on Escape key
      const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cleanup(false);
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  }
}
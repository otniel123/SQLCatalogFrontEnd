import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of (toastService.toasts$ | async); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type"
             (click)="toastService.remove(toast.id)">
          <span class="toast-icon">
            @switch (toast.type) {
              @case ('success') { &#10003; }
              @case ('error') { &#10007; }
              @case ('warning') { &#9888; }
              @default { &#8505; }
            }
          </span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .toast {
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      min-width: 280px;
      backdrop-filter: blur(8px);
    }
    .toast--success {
      background: #0d9e5f;
      color: #fff;
    }
    .toast--error {
      background: #e53e3e;
      color: #fff;
    }
    .toast--warning {
      background: #d69e2e;
      color: #1a1a1a;
    }
    .toast--info {
      background: #3182ce;
      color: #fff;
    }
    .toast-icon { font-size: 1rem; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}

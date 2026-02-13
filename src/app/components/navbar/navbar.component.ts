import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (auth.isLoggedIn()) {
      <nav class="navbar">
        <div class="navbar-inner">
          <a routerLink="/dashboard" class="logo">
            <span class="logo-icon">&#9671;</span>
            <span class="logo-text">SQL Catalog</span>
          </a>

          <div class="nav-links">
            <a routerLink="/dashboard" routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: true }">
              Meus Scripts
            </a>
            <a routerLink="/scripts/novo" routerLinkActive="active">
              Novo Script
            </a>
            @if (auth.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="active">
                Admin
              </a>
            }
          </div>

          <div class="nav-user">
            <span class="user-badge" [class.admin]="auth.isAdmin()">
              {{ auth.isAdmin() ? 'ADMIN' : 'USER' }}
            </span>
            <span class="user-name">{{ (auth.usuario$ | async)?.nome }}</span>
            <button class="btn-logout" (click)="auth.logout()">Sair</button>
          </div>
        </div>
      </nav>
    }
  `,
  styles: [`
    .navbar {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }
    .navbar-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 64px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--text);
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
    }
    .logo-icon {
      font-size: 1.4rem;
      color: var(--accent);
    }
    .nav-links {
      display: flex;
      gap: 0.25rem;
    }
    .nav-links a {
      text-decoration: none;
      color: var(--text-muted);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-links a:hover {
      color: var(--text);
      background: var(--hover);
    }
    .nav-links a.active {
      color: var(--accent);
      background: var(--accent-soft);
    }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: var(--hover);
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }
    .user-badge.admin {
      background: var(--accent-soft);
      color: var(--accent);
    }
    .user-name {
      font-size: 0.875rem;
      color: var(--text);
      font-weight: 500;
    }
    .btn-logout {
      background: none;
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      border-color: var(--danger);
      color: var(--danger);
      background: rgba(239, 68, 68, 0.06);
    }
  `],
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>SQL Catalog</h1>
          <p>Crie sua conta para começar</p>
        </div>

        <form (ngSubmit)="onRegistrar()" class="auth-form">
          <div class="field">
            <label for="nome">Nome</label>
            <input
              id="nome" type="text" [(ngModel)]="nome" name="nome"
              placeholder="Seu nome completo" required
            />
          </div>

          <div class="field">
            <label for="email">E-mail</label>
            <input
              id="email" type="email" [(ngModel)]="email" name="email"
              placeholder="seu@email.com" required
            />
          </div>

          <div class="field">
            <label for="senha">Senha</label>
            <input
              id="senha" type="password" [(ngModel)]="senha" name="senha"
              placeholder="Mínimo 6 caracteres" required minlength="6"
            />
          </div>

          @if (erro) {
            <div class="error-msg">{{ erro }}</div>
          }

          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Criando...' : 'Criar Conta' }}
          </button>
        </form>

        <p class="auth-footer">
          Já tem conta? <a routerLink="/login">Fazer login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
    .auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 420px; }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-header h1 { font-size: 1.75rem; font-weight: 800; color: var(--accent); margin: 0; }
    .auth-header p { color: var(--text-muted); font-size: 0.9rem; margin: 0.5rem 0 0; }
    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .field label { font-size: 0.8rem; font-weight: 600; color: var(--text); }
    .field input {
      padding: 0.7rem 0.9rem; border: 1px solid var(--border);
      border-radius: 10px; background: var(--bg); color: var(--text);
      font-size: 0.875rem; outline: none; transition: border-color 0.2s;
    }
    .field input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
    .error-msg { background: rgba(239, 68, 68, 0.08); color: var(--danger); padding: 0.6rem 0.9rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500; }
    .btn-primary { background: var(--accent); color: #fff; border: none; padding: 0.75rem; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-primary:hover:not(:disabled) { filter: brightness(1.1); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted); }
    .auth-footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
    .auth-footer a:hover { text-decoration: underline; }
  `],
})
export class RegisterComponent {
  nome = '';
  email = '';
  senha = '';
  loading = false;
  erro = '';

  constructor(
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  onRegistrar(): void {
    this.erro = '';
    this.loading = true;

    this.auth.registrar({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.toast.success('Conta criada com sucesso! Faça login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err.error?.erro || 'Erro ao criar conta.';
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScriptService } from '../../services/script.service';
import { DominioService } from '../../services/dominio.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Script, BancoDados, Categoria } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div>
          <h1>Meus Scripts</h1>
          <p class="subtitle">{{ scriptsFiltrados.length }} script{{ scriptsFiltrados.length !== 1 ? 's' : '' }} encontrado{{ scriptsFiltrados.length !== 1 ? 's' : '' }}</p>
        </div>
        <a routerLink="/scripts/novo" class="btn-primary">
          <span>+</span> Novo Script
        </a>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-field">
          <input
            type="text"
            [(ngModel)]="filtroTexto"
            (ngModelChange)="onFiltrar()"
            placeholder="Buscar em título, descrição e conteúdo..."
          />
        </div>
        <input
          type="number"
          [(ngModel)]="filtroId"
          (ngModelChange)="onFiltrarLocal()"
          placeholder="Filtrar por #"
          class="id-input"
          min="1"
        />
        <select [(ngModel)]="filtroBanco" (ngModelChange)="onFiltrar()">
          <option value="">Todos os Bancos</option>
          @for (banco of bancos; track banco) {
            <option [value]="banco">{{ banco }}</option>
          }
        </select>
        <select [(ngModel)]="filtroCategoria" (ngModelChange)="onFiltrar()">
          <option value="">Todas as Categorias</option>
          @for (cat of categorias; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
        <input
          type="text"
          [(ngModel)]="filtroTag"
          (ngModelChange)="onFiltrar()"
          placeholder="Filtrar por tag..."
          class="tag-input"
        />
        @if (filtroBanco || filtroCategoria || filtroTexto || filtroTag || filtroId) {
          <button class="btn-clear" (click)="limparFiltros()">Limpar</button>
        }
      </div>

      <!-- Script List -->
      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Carregando scripts...</p>
        </div>
      } @else if (scriptsFiltrados.length === 0) {
        <div class="empty-state">
          <span class="empty-icon">&#128196;</span>
          <h3>Nenhum script encontrado</h3>
          <p>
            @if (filtroBanco || filtroCategoria || filtroTexto || filtroTag || filtroId) {
              Tente ajustar os filtros de busca.
            } @else {
              Comece adicionando seu primeiro script SQL.
            }
          </p>
          @if (!filtroBanco && !filtroCategoria && !filtroTexto && !filtroTag && !filtroId) {
            <a routerLink="/scripts/novo" class="btn-primary">Criar Primeiro Script</a>
          }
        </div>
      } @else {
        <div class="scripts-grid">
          @for (script of scriptsFiltrados; track script.id) {
            <div class="script-card" [routerLink]="['/scripts', script.id]">
              <div class="card-top">
                <div class="card-badges">
                  <span class="badge badge-num">#{{ script.numero || script.id }}</span>
                  <span class="badge badge-banco">{{ script.bancoDados }}</span>
                  <span class="badge badge-cat">{{ script.categoria }}</span>
                </div>
                <div class="card-actions" (click)="$event.stopPropagation()">
                  <button
                    class="btn-icon"
                    [routerLink]="['/scripts', script.id, 'editar']"
                    title="Editar"
                  >&#9998;</button>
                  <button
                    class="btn-icon btn-danger"
                    (click)="onDeletar(script)"
                    title="Excluir"
                  >&#10005;</button>
                </div>
              </div>
              <h3 class="card-title">{{ script.titulo }}</h3>
              @if (script.descricao) {
                <p class="card-desc">{{ script.descricao }}</p>
              }
              <pre class="card-code"><code>{{ script.conteudo | slice:0:200 }}{{ (script.conteudo?.length || 0) > 200 ? '...' : '' }}</code></pre>
              @if (script.tags && script.tags.length > 0) {
                <div class="card-tags">
                  @for (tag of script.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
              }
              <div class="card-footer">
                <span class="card-date">
                  {{ script.dataAtualizacao | date:'dd/MM/yyyy HH:mm' }}
                </span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .dashboard-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text);
      margin: 0;
      letter-spacing: -0.03em;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin: 0.25rem 0 0;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 0.65rem 1.2rem;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary:hover { filter: brightness(1.1); }

    .filters-bar {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }
    .search-field {
      flex: 1;
      min-width: 200px;
    }
    .search-field input, .tag-input, .id-input {
      width: 100%;
      padding: 0.6rem 0.9rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--surface);
      color: var(--text);
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .search-field input:focus, .tag-input:focus, .id-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }
    .tag-input { width: 140px; }
    .id-input { width: 100px; }
    /* Remove spinner arrows from number input */
    .id-input::-webkit-outer-spin-button,
    .id-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .id-input[type=number] { -moz-appearance: textfield; }
    select {
      padding: 0.6rem 0.9rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--surface);
      color: var(--text);
      font-size: 0.85rem;
      outline: none;
      cursor: pointer;
    }
    select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }
    .btn-clear {
      background: none;
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 500;
    }
    .btn-clear:hover { border-color: var(--danger); color: var(--danger); }

    .loading-state, .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--text-muted);
    }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .empty-state h3 { color: var(--text); font-size: 1.1rem; margin: 0 0 0.4rem; }
    .empty-state p { font-size: 0.875rem; margin: 0 0 1.5rem; }

    .scripts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1rem;
    }
    .script-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .script-card:hover {
      border-color: var(--accent);
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transform: translateY(-1px);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    .card-badges { display: flex; gap: 0.4rem; }
    .badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: 5px;
      letter-spacing: 0.04em;
    }
    .badge-num { background: var(--surface); color: var(--text-muted); border: 1px solid var(--border); }
    .badge-banco { background: var(--accent-soft); color: var(--accent); }
    .badge-cat { background: var(--hover); color: var(--text-muted); }
    .card-actions {
      display: flex; gap: 0.3rem;
      opacity: 0; transition: opacity 0.2s;
    }
    .script-card:hover .card-actions { opacity: 1; }
    .btn-icon {
      background: var(--hover);
      border: none; color: var(--text-muted);
      width: 28px; height: 28px; border-radius: 6px;
      cursor: pointer; font-size: 0.75rem;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .btn-icon:hover { background: var(--border); color: var(--text); }
    .btn-icon.btn-danger:hover { background: rgba(239,68,68,0.1); color: var(--danger); }
    .card-title {
      font-size: 1rem; font-weight: 600; color: var(--text);
      margin: 0 0 0.4rem; letter-spacing: -0.01em;
    }
    .card-desc {
      font-size: 0.8rem; color: var(--text-muted);
      margin: 0 0 0.75rem; line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-code {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 8px; padding: 0.6rem 0.8rem;
      font-size: 0.75rem; color: var(--code);
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      overflow: hidden; white-space: pre-wrap; word-break: break-all;
      max-height: 80px; margin: 0 0 0.75rem; line-height: 1.5;
    }
    .card-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.75rem; }
    .tag {
      font-size: 0.7rem; padding: 0.15rem 0.5rem;
      background: var(--hover); color: var(--text-muted);
      border-radius: 4px; font-weight: 500;
    }
    .card-footer { border-top: 1px solid var(--border); padding-top: 0.6rem; }
    .card-date { font-size: 0.7rem; color: var(--text-muted); }
  `],
})
export class DashboardComponent implements OnInit {
  scripts: Script[] = [];
  scriptsFiltrados: Script[] = [];
  bancos: BancoDados[] = [];
  categorias: Categoria[] = [];
  loading = true;

  filtroBanco = '';
  filtroCategoria = '';
  filtroTexto = '';
  filtroTag = '';
  filtroId: number | null = null;

  private debounceTimer: any;

  constructor(
    private scriptService: ScriptService,
    private dominioService: DominioService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.dominioService.listarBancos().subscribe((b) => (this.bancos = b));
    this.dominioService.listarCategorias().subscribe((c) => (this.categorias = c));
    this.carregarScripts();
  }

  carregarScripts(): void {
    this.loading = true;
    this.scriptService
      .listar({
        banco: this.filtroBanco || undefined,
        categoria: this.filtroCategoria || undefined,
        texto: this.filtroTexto || undefined,
        tag: this.filtroTag || undefined,
      })
      .subscribe({
        next: (data) => {
          this.scripts = data;
          this.aplicarFiltroLocal();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toast.error('Erro ao carregar scripts.');
        },
      });
  }

  aplicarFiltroLocal(): void {
    if (this.filtroId) {
      this.scriptsFiltrados = this.scripts.filter(
        (s) => (s.numero || s.id) === this.filtroId
      );
    } else {
      this.scriptsFiltrados = [...this.scripts];
    }
  }

  onFiltrar(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.carregarScripts(), 350);
  }

  onFiltrarLocal(): void {
    this.aplicarFiltroLocal();
  }

  limparFiltros(): void {
    this.filtroBanco = '';
    this.filtroCategoria = '';
    this.filtroTexto = '';
    this.filtroTag = '';
    this.filtroId = null;
    this.carregarScripts();
  }

  onDeletar(script: Script): void {
    if (!confirm(`Deseja excluir "${script.titulo}"?`)) return;

    this.scriptService.deletar(script.id!).subscribe({
      next: () => {
        this.toast.success('Script excluído com sucesso.');
        this.carregarScripts();
      },
      error: () => this.toast.error('Erro ao excluir script.'),
    });
  }
}

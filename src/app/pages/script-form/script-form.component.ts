import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ScriptService } from '../../services/script.service';
import { DominioService } from '../../services/dominio.service';
import { ToastService } from '../../services/toast.service';
import { Script, BancoDados, Categoria } from '../../models';

@Component({
  selector: 'app-script-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="form-page">
      <div class="form-header">
        <a routerLink="/dashboard" class="back-link">&larr; Voltar</a>
        <h1>{{ isEditing ? 'Editar Script' : 'Novo Script' }}</h1>
      </div>

      <form (ngSubmit)="onSubmit()" class="script-form">
        <div class="form-grid">
          <div class="field full">
            <label for="titulo">Título *</label>
            <input
              id="titulo"
              type="text"
              [(ngModel)]="script.titulo"
              name="titulo"
              placeholder="Ex: Buscar funcionários ativos"
              required
            />
          </div>

          <div class="field full">
            <label for="descricao">Descrição</label>
            <textarea
              id="descricao"
              [(ngModel)]="script.descricao"
              name="descricao"
              placeholder="Descreva o que este script faz (máx. 500 caracteres)"
              rows="3"
              maxlength="500"
            ></textarea>
            <span class="char-count">{{ (script.descricao?.length || 0) }}/500</span>
          </div>

          <div class="field half">
            <label for="bancoDados">Banco de Dados *</label>
            <select
              id="bancoDados"
              [(ngModel)]="script.bancoDados"
              name="bancoDados"
              required
            >
              <option value="" disabled>Selecione...</option>
              @for (banco of bancos; track banco) {
                <option [value]="banco">{{ banco }}</option>
              }
            </select>
          </div>

          <div class="field half">
            <label for="categoria">Categoria *</label>
            <select
              id="categoria"
              [(ngModel)]="script.categoria"
              name="categoria"
              required
            >
              <option value="" disabled>Selecione...</option>
              @for (cat of categorias; track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>

          <div class="field full">
            <label for="conteudo">Conteúdo SQL *</label>
            <textarea
              id="conteudo"
              [(ngModel)]="script.conteudo"
              name="conteudo"
              placeholder="Cole seu script SQL aqui..."
              rows="12"
              class="code-editor"
              required
            ></textarea>
          </div>

          <div class="field full">
            <label>Tags</label>
            <div class="tags-input-area">
              @for (tag of script.tags; track $index) {
                <span class="tag-chip">
                  {{ tag }}
                  <button type="button" (click)="removeTag($index)">&times;</button>
                </span>
              }
              <input
                type="text"
                [(ngModel)]="novaTag"
                name="novaTag"
                (keydown)="onTagKeydown($event)"
                placeholder="Digite e pressione Enter..."
                class="tag-input-inline"
              />
            </div>
            <span class="tag-hint">Pressione Enter ou Tab para adicionar a tag</span>
          </div>
        </div>

        @if (erro) {
          <div class="error-msg">{{ erro }}</div>
        }

        <div class="form-actions">
          <a routerLink="/dashboard" class="btn-secondary">Cancelar</a>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Script') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-page { max-width: 780px; margin: 0 auto; }
    .form-header { margin-bottom: 1.5rem; }
    .back-link {
      color: var(--text-muted); text-decoration: none;
      font-size: 0.85rem; font-weight: 500; transition: color 0.2s;
    }
    .back-link:hover { color: var(--accent); }
    .form-header h1 {
      font-size: 1.5rem; font-weight: 700; color: var(--text);
      margin: 0.5rem 0 0; letter-spacing: -0.02em;
    }
    .script-form {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; padding: 2rem;
    }
    .form-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
    }
    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .field.full { grid-column: 1 / -1; }
    .field.half { grid-column: span 1; }
    .field label {
      font-size: 0.8rem; font-weight: 600;
      color: var(--text); letter-spacing: 0.02em;
    }
    .field input, .field select, .field textarea {
      padding: 0.7rem 0.9rem; border: 1px solid var(--border);
      border-radius: 10px; background: var(--bg); color: var(--text);
      font-size: 0.875rem; outline: none; transition: border-color 0.2s;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft);
    }
    .field textarea { resize: vertical; }
    .code-editor {
      font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
      font-size: 0.82rem !important; line-height: 1.6; tab-size: 4;
    }
    .char-count {
      font-size: 0.7rem; color: var(--text-muted); text-align: right;
    }
    .tag-hint {
      font-size: 0.7rem; color: var(--text-muted);
    }

    .tags-input-area {
      display: flex; flex-wrap: wrap; gap: 0.4rem;
      padding: 0.5rem 0.7rem; border: 1px solid var(--border);
      border-radius: 10px; background: var(--bg);
      min-height: 42px; align-items: center; transition: border-color 0.2s;
    }
    .tags-input-area:focus-within {
      border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft);
    }
    .tag-chip {
      display: inline-flex; align-items: center; gap: 0.3rem;
      background: var(--accent-soft); color: var(--accent);
      padding: 0.2rem 0.6rem; border-radius: 6px;
      font-size: 0.78rem; font-weight: 600;
    }
    .tag-chip button {
      background: none; border: none; color: inherit;
      cursor: pointer; font-size: 1rem; padding: 0;
      line-height: 1; opacity: 0.7;
    }
    .tag-chip button:hover { opacity: 1; }
    .tag-input-inline {
      border: none !important; background: transparent !important;
      outline: none !important; box-shadow: none !important;
      padding: 0.2rem !important; font-size: 0.85rem;
      flex: 1; min-width: 120px; color: var(--text);
    }

    .error-msg {
      background: rgba(239, 68, 68, 0.08); color: var(--danger);
      padding: 0.6rem 0.9rem; border-radius: 8px;
      font-size: 0.8rem; font-weight: 500; margin-top: 1rem;
    }
    .form-actions {
      display: flex; justify-content: flex-end; gap: 0.75rem;
      margin-top: 1.5rem; padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    .btn-primary {
      background: var(--accent); color: #fff; border: none;
      padding: 0.7rem 1.5rem; border-radius: 10px;
      font-size: 0.875rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary:hover:not(:disabled) { filter: brightness(1.1); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary {
      background: var(--hover); color: var(--text);
      border: 1px solid var(--border); padding: 0.7rem 1.5rem;
      border-radius: 10px; font-size: 0.875rem; font-weight: 500;
      cursor: pointer; text-decoration: none; transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: var(--text-muted); }
  `],
})
export class ScriptFormComponent implements OnInit {
  script: Script = {
    titulo: '',
    descricao: '',
    conteudo: '',
    bancoDados: '' as BancoDados,
    categoria: '' as Categoria,
    tags: [],
  };

  bancos: BancoDados[] = [];
  categorias: Categoria[] = [];
  novaTag = '';
  isEditing = false;
  loading = false;
  erro = '';

  private scriptId?: number;

  constructor(
    private scriptService: ScriptService,
    private dominioService: DominioService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dominioService.listarBancos().subscribe((b) => (this.bancos = b));
    this.dominioService.listarCategorias().subscribe((c) => (this.categorias = c));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.scriptId = +id;
      this.scriptService.buscarPorId(this.scriptId).subscribe({
        next: (s) => {
          this.script = { ...s };
          // Garante que tags é sempre um array
          if (!this.script.tags) {
            this.script.tags = [];
          }
        },
        error: () => {
          this.toast.error('Script não encontrado.');
          this.router.navigate(['/dashboard']);
        },
      });
    }
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === 'Tab') {
      // IMPORTANTE: Prevenir que Enter submeta o formulário
      event.preventDefault();
      event.stopPropagation();
      this.addTag();
    }
  }

  addTag(): void {
    const tag = this.novaTag.trim().toLowerCase();
    if (tag && !this.script.tags.includes(tag)) {
      this.script.tags = [...this.script.tags, tag];
    }
    this.novaTag = '';
  }

  removeTag(index: number): void {
    this.script.tags = this.script.tags.filter((_, i) => i !== index);
  }

  onSubmit(): void {
    this.erro = '';
    this.loading = true;

    const obs = this.isEditing
      ? this.scriptService.atualizar(this.scriptId!, this.script)
      : this.scriptService.criar(this.script);

    obs.subscribe({
      next: () => {
        this.toast.success(
          this.isEditing ? 'Script atualizado!' : 'Script criado com sucesso!'
        );
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err.error?.erro || 'Erro ao salvar script.';
      },
    });
  }
}

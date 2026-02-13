import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ScriptService } from '../../services/script.service';
import { ToastService } from '../../services/toast.service';
import { Script } from '../../models';

@Component({
  selector: 'app-script-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (script) {
      <div class="detail-page">
        <div class="detail-header">
          <a routerLink="/dashboard" class="back-link">&larr; Voltar</a>
          <div class="header-row">
            <div>
              <div class="badges">
                <span class="badge badge-num">#{{ script.numero || script.id }}</span>
                <span class="badge badge-banco">{{ script.bancoDados }}</span>
                <span class="badge badge-cat">{{ script.categoria }}</span>
              </div>
              <h1>{{ script.titulo }}</h1>
              @if (script.descricao) {
                <p class="description">{{ script.descricao }}</p>
              }
            </div>
            <div class="header-actions">
              <a [routerLink]="['/scripts', script.id, 'editar']" class="btn-secondary">
                &#9998; Editar
              </a>
              <button class="btn-danger-outline" (click)="onDeletar()">
                &#10005; Excluir
              </button>
            </div>
          </div>
        </div>

        <div class="detail-body">
          <div class="code-section">
            <div class="code-header">
              <span class="code-label">Conteúdo SQL</span>
              <button class="btn-copy" (click)="copiar()">
                {{ copiado ? '&#10003; Copiado!' : '&#128203; Copiar' }}
              </button>
            </div>
            <pre class="code-block"><code>{{ script.conteudo }}</code></pre>
          </div>

          <div class="meta-section">
            @if (script.tags && script.tags.length > 0) {
              <div class="meta-group">
                <h3>Tags</h3>
                <div class="tags-list">
                  @for (tag of script.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
              </div>
            }
            <div class="meta-group">
              <h3>Informações</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Criado em</span>
                  <span class="info-value">{{ script.dataCriacao | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Atualizado em</span>
                  <span class="info-value">{{ script.dataAtualizacao | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="loading-state">
        <div class="spinner"></div>
      </div>
    }
  `,
  styles: [`
    .detail-page { max-width: 900px; margin: 0 auto; }
    .back-link { color: var(--text-muted); text-decoration: none; font-size: 0.85rem; font-weight: 500; transition: color 0.2s; }
    .back-link:hover { color: var(--accent); }
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 0.75rem; gap: 1rem; }
    .badges { display: flex; gap: 0.4rem; margin-bottom: 0.5rem; }
    .badge { font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 5px; letter-spacing: 0.04em; }
    .badge-num { background: var(--surface); color: var(--text-muted); border: 1px solid var(--border); }
    .badge-banco { background: var(--accent-soft); color: var(--accent); }
    .badge-cat { background: var(--hover); color: var(--text-muted); }
    h1 { font-size: 1.5rem; font-weight: 700; color: var(--text); margin: 0; letter-spacing: -0.02em; }
    .description { color: var(--text-muted); font-size: 0.9rem; margin: 0.5rem 0 0; line-height: 1.5; }
    .header-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
    .btn-secondary { background: var(--hover); color: var(--text); border: 1px solid var(--border); padding: 0.55rem 1rem; border-radius: 10px; font-size: 0.8rem; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.2s; }
    .btn-secondary:hover { border-color: var(--text-muted); }
    .btn-danger-outline { background: none; border: 1px solid var(--border); color: var(--text-muted); padding: 0.55rem 1rem; border-radius: 10px; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-danger-outline:hover { border-color: var(--danger); color: var(--danger); background: rgba(239, 68, 68, 0.06); }
    .detail-body { margin-top: 1.5rem; }
    .code-section { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
    .code-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--border); }
    .code-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); letter-spacing: 0.02em; }
    .btn-copy { background: var(--hover); border: 1px solid var(--border); color: var(--text); padding: 0.35rem 0.75rem; border-radius: 8px; font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-copy:hover { background: var(--border); }
    .code-block { margin: 0; padding: 1.25rem; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.82rem; color: var(--code); line-height: 1.7; overflow-x: auto; white-space: pre-wrap; word-break: break-word; }
    .meta-section { margin-top: 1.25rem; }
    .meta-group { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem; margin-bottom: 1rem; }
    .meta-group h3 { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin: 0 0 0.75rem; letter-spacing: 0.02em; text-transform: uppercase; }
    .tags-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .tag { font-size: 0.78rem; padding: 0.25rem 0.65rem; background: var(--accent-soft); color: var(--accent); border-radius: 6px; font-weight: 600; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .info-label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.2rem; }
    .info-value { font-size: 0.875rem; color: var(--text); font-weight: 500; }
    .loading-state { display: flex; justify-content: center; padding: 4rem; }
    .spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ScriptDetailComponent implements OnInit {
  script?: Script;
  copiado = false;

  constructor(
    private scriptService: ScriptService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.scriptService.buscarPorId(id).subscribe({
      next: (s) => (this.script = s),
      error: () => {
        this.toast.error('Script não encontrado.');
        this.router.navigate(['/dashboard']);
      },
    });
  }

  copiar(): void {
    if (this.script?.conteudo) {
      navigator.clipboard.writeText(this.script.conteudo).then(() => {
        this.copiado = true;
        this.toast.success('SQL copiado para a área de transferência!');
        setTimeout(() => (this.copiado = false), 2000);
      });
    }
  }

  onDeletar(): void {
    if (!confirm(`Deseja excluir "${this.script?.titulo}"?`)) return;
    this.scriptService.deletar(this.script!.id!).subscribe({
      next: () => {
        this.toast.success('Script excluído com sucesso.');
        this.router.navigate(['/dashboard']);
      },
      error: () => this.toast.error('Erro ao excluir script.'),
    });
  }
}

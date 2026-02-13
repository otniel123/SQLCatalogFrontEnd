import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ToastService } from '../../services/toast.service';
import { UsuarioResponse, EstatisticasResponse, Script } from '../../models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page">
      <div class="admin-header">
        <h1>Painel Administrativo</h1>
        <p class="subtitle">Gerencie usuários, scripts e acompanhe as estatísticas do sistema</p>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'stats'" (click)="activeTab = 'stats'">Estatísticas</button>
        <button class="tab" [class.active]="activeTab === 'users'" (click)="activeTab = 'users'">Usuários</button>
        <button class="tab" [class.active]="activeTab === 'scripts'" (click)="activeTab = 'scripts'">Todos os Scripts</button>
      </div>

      @if (activeTab === 'stats' && stats) {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ stats.totalUsuarios }}</span>
            <span class="stat-label">Total de Usuários</span>
          </div>
          <div class="stat-card accent">
            <span class="stat-value">{{ stats.usuariosAtivos }}</span>
            <span class="stat-label">Usuários Ativos</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.totalScripts }}</span>
            <span class="stat-label">Total de Scripts</span>
          </div>
        </div>
        <div class="charts-grid">
          <div class="chart-card">
            <h3>Scripts por Banco</h3>
            @for (entry of statsEntries(stats.scriptsPorBanco); track entry.key) {
              <div class="bar-row">
                <span class="bar-label">{{ entry.key }}</span>
                <div class="bar-track"><div class="bar-fill accent-fill" [style.width.%]="getBarWidth(entry.value, stats.totalScripts)"></div></div>
                <span class="bar-value">{{ entry.value }}</span>
              </div>
            }
          </div>
          <div class="chart-card">
            <h3>Scripts por Categoria</h3>
            @for (entry of statsEntries(stats.scriptsPorCategoria); track entry.key) {
              <div class="bar-row">
                <span class="bar-label">{{ entry.key }}</span>
                <div class="bar-track"><div class="bar-fill cat-fill" [style.width.%]="getBarWidth(entry.value, stats.totalScripts)"></div></div>
                <span class="bar-value">{{ entry.value }}</span>
              </div>
            }
          </div>
        </div>
      }

      @if (activeTab === 'users') {
        <div class="table-container">
          <table>
            <thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Role</th><th>Status</th><th>Criado em</th><th>Ações</th></tr></thead>
            <tbody>
              @for (user of usuarios; track user.id) {
                <tr>
                  <td class="id-col">{{ user.id }}</td>
                  <td class="name-col">{{ user.nome }}</td>
                  <td>{{ user.email }}</td>
                  <td><span class="badge" [class.badge-admin]="user.role === 'ADMIN'">{{ user.role }}</span></td>
                  <td><span class="status" [class.active]="user.ativo">{{ user.ativo ? 'Ativo' : 'Inativo' }}</span></td>
                  <td>{{ user.dataCriacao | date:'dd/MM/yyyy' }}</td>
                  <td class="actions-col">
                    @if (user.role === 'USER') {
                      <button class="btn-sm" (click)="promoverAdmin(user)">Promover</button>
                    } @else {
                      <button class="btn-sm" (click)="rebaixarUser(user)">Rebaixar</button>
                    }
                    @if (user.ativo) {
                      <button class="btn-sm btn-sm-danger" (click)="desativar(user)">Desativar</button>
                    } @else {
                      <button class="btn-sm btn-sm-success" (click)="ativar(user)">Ativar</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (activeTab === 'scripts') {
        <div class="table-container">
          <table>
            <thead><tr><th>#</th><th>ID Global</th><th>Título</th><th>Banco</th><th>Categoria</th><th>Atualizado em</th></tr></thead>
            <tbody>
              @for (script of allScripts; track script.id) {
                <tr>
                  <td class="id-col">{{ script.numero || '-' }}</td>
                  <td class="id-col">{{ script.id }}</td>
                  <td class="name-col">{{ script.titulo }}</td>
                  <td><span class="badge badge-banco">{{ script.bancoDados }}</span></td>
                  <td><span class="badge badge-cat">{{ script.categoria }}</span></td>
                  <td>{{ script.dataAtualizacao | date:'dd/MM/yyyy HH:mm' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-page { max-width: 1100px; margin: 0 auto; }
    .admin-header h1 { font-size: 1.75rem; font-weight: 700; color: var(--text); margin: 0; letter-spacing: -0.03em; }
    .subtitle { color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0 0; }
    .tabs { display: flex; gap: 0.25rem; margin: 1.5rem 0; background: var(--hover); border-radius: 12px; padding: 0.25rem; width: fit-content; }
    .tab { background: none; border: none; padding: 0.55rem 1.25rem; border-radius: 10px; font-size: 0.85rem; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
    .tab:hover { color: var(--text); }
    .tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; text-align: center; }
    .stat-card.accent { border-color: var(--accent); }
    .stat-value { display: block; font-size: 2.25rem; font-weight: 800; color: var(--text); letter-spacing: -0.03em; }
    .stat-card.accent .stat-value { color: var(--accent); }
    .stat-label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; font-weight: 500; }
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .chart-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; }
    .chart-card h3 { font-size: 0.85rem; font-weight: 600; color: var(--text); margin: 0 0 1rem; }
    .bar-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; }
    .bar-label { font-size: 0.75rem; color: var(--text-muted); width: 100px; flex-shrink: 0; font-weight: 500; }
    .bar-track { flex: 1; height: 8px; background: var(--hover); border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; min-width: 4px; }
    .accent-fill { background: var(--accent); }
    .cat-fill { background: #8b5cf6; }
    .bar-value { font-size: 0.75rem; font-weight: 700; color: var(--text); width: 30px; text-align: right; }
    .table-container { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: var(--hover); }
    th { padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); letter-spacing: 0.03em; text-transform: uppercase; }
    td { padding: 0.75rem 1rem; font-size: 0.85rem; color: var(--text); border-top: 1px solid var(--border); }
    tr:hover td { background: var(--hover); }
    .id-col { color: var(--text-muted); font-weight: 500; }
    .name-col { font-weight: 600; }
    .badge { font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 5px; letter-spacing: 0.04em; background: var(--hover); color: var(--text-muted); }
    .badge-admin { background: var(--accent-soft); color: var(--accent); }
    .badge-banco { background: var(--accent-soft); color: var(--accent); }
    .badge-cat { background: var(--hover); color: var(--text-muted); }
    .status { font-size: 0.78rem; font-weight: 600; color: var(--danger); }
    .status.active { color: #0d9e5f; }
    .actions-col { display: flex; gap: 0.4rem; }
    .btn-sm { background: var(--hover); border: 1px solid var(--border); color: var(--text); padding: 0.3rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .btn-sm:hover { border-color: var(--accent); color: var(--accent); }
    .btn-sm-danger:hover { border-color: var(--danger); color: var(--danger); }
    .btn-sm-success:hover { border-color: #0d9e5f; color: #0d9e5f; }
  `],
})
export class AdminComponent implements OnInit {
  activeTab: 'stats' | 'users' | 'scripts' = 'stats';
  stats?: EstatisticasResponse;
  usuarios: UsuarioResponse[] = [];
  allScripts: Script[] = [];

  constructor(private adminService: AdminService, private toast: ToastService) {}

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.adminService.getEstatisticas().subscribe({ next: (s) => (this.stats = s), error: () => this.toast.error('Erro ao carregar estatísticas.') });
    this.adminService.listarUsuarios().subscribe({ next: (u) => (this.usuarios = u), error: () => this.toast.error('Erro ao carregar usuários.') });
    this.adminService.listarTodosScripts().subscribe({ next: (s) => (this.allScripts = s), error: () => this.toast.error('Erro ao carregar scripts.') });
  }

  statsEntries(obj: Record<string, number>): { key: string; value: number }[] {
    if (!obj) return [];
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

  getBarWidth(value: number, total: number): number {
    return total ? Math.max((value / total) * 100, 3) : 0;
  }

  promoverAdmin(user: UsuarioResponse): void {
    if (!confirm(`Promover ${user.nome} para ADMIN?`)) return;
    this.adminService.alterarRole(user.id, 'ADMIN').subscribe({ next: () => { this.toast.success(`${user.nome} agora é ADMIN.`); this.loadAll(); }, error: () => this.toast.error('Erro ao alterar role.') });
  }

  rebaixarUser(user: UsuarioResponse): void {
    if (!confirm(`Rebaixar ${user.nome} para USER?`)) return;
    this.adminService.alterarRole(user.id, 'USER').subscribe({ next: () => { this.toast.success(`${user.nome} agora é USER.`); this.loadAll(); }, error: () => this.toast.error('Erro ao alterar role.') });
  }

  desativar(user: UsuarioResponse): void {
    if (!confirm(`Desativar ${user.nome}?`)) return;
    this.adminService.desativarUsuario(user.id).subscribe({ next: () => { this.toast.success(`${user.nome} desativado.`); this.loadAll(); }, error: () => this.toast.error('Erro ao desativar.') });
  }

  ativar(user: UsuarioResponse): void {
    this.adminService.ativarUsuario(user.id).subscribe({ next: () => { this.toast.success(`${user.nome} ativado.`); this.loadAll(); }, error: () => this.toast.error('Erro ao ativar.') });
  }
}

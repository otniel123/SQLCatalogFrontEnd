import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioResponse, EstatisticasResponse, Script, Role } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${this.apiUrl}/usuarios`);
  }

  buscarUsuario(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/usuarios/${id}`);
  }

  alterarRole(id: number, role: Role): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(
      `${this.apiUrl}/usuarios/${id}/role?role=${role}`,
      {}
    );
  }

  desativarUsuario(id: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(
      `${this.apiUrl}/usuarios/${id}/desativar`,
      {}
    );
  }

  ativarUsuario(id: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(
      `${this.apiUrl}/usuarios/${id}/ativar`,
      {}
    );
  }

  listarTodosScripts(): Observable<Script[]> {
    return this.http.get<Script[]>(`${this.apiUrl}/scripts`);
  }

  listarScriptsDoUsuario(id: number): Observable<Script[]> {
    return this.http.get<Script[]>(`${this.apiUrl}/usuarios/${id}/scripts`);
  }

  getEstatisticas(): Observable<EstatisticasResponse> {
    return this.http.get<EstatisticasResponse>(`${this.apiUrl}/estatisticas`);
  }
}

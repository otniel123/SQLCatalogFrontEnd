import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Script, ScriptFilter } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ScriptService {
  private readonly apiUrl = `${environment.apiUrl}/scripts`;

  constructor(private http: HttpClient) {}

  listar(filtros?: ScriptFilter): Observable<Script[]> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.banco) params = params.set('banco', filtros.banco);
      if (filtros.categoria) params = params.set('categoria', filtros.categoria);
      if (filtros.texto) params = params.set('texto', filtros.texto);
      if (filtros.tag) params = params.set('tag', filtros.tag);
      if (filtros.page !== undefined) params = params.set('page', filtros.page.toString());
      if (filtros.size !== undefined) params = params.set('size', filtros.size.toString());
    }
    return this.http.get<Script[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Script> {
    return this.http.get<Script>(`${this.apiUrl}/${id}`);
  }

  criar(script: Script): Observable<Script> {
    return this.http.post<Script>(this.apiUrl, script);
  }

  atualizar(id: number, script: Script): Observable<Script> {
    return this.http.put<Script>(`${this.apiUrl}/${id}`, script);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BancoDados, Categoria } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DominioService {
  private readonly apiUrl = `${environment.apiUrl}/dominios`;

  constructor(private http: HttpClient) {}

  listarBancos(): Observable<BancoDados[]> {
    return this.http.get<BancoDados[]>(`${this.apiUrl}/bancos`);
  }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }
}

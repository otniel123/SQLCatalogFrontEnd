// === Enums ===
export type BancoDados = 'ORACLE' | 'MYSQL' | 'POSTGRESQL' | 'SQLSERVER' | 'OUTROS';
export type Categoria = 'QUERY' | 'PROCEDURE' | 'FUNCTION' | 'TRIGGER' | 'DDL' | 'DML' | 'OUTROS';
export type Role = 'ADMIN' | 'USER';

// === Auth ===
export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  role: Role;
  dataCriacao: string;
  ativo: boolean;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEm: number;
  usuario: UsuarioResponse;
}

// === Script ===
export interface Script {
  id?: number;
  numero?: number;
  titulo: string;
  descricao?: string;
  conteudo: string;
  bancoDados: BancoDados;
  categoria: Categoria;
  tags: string[];
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export interface ScriptFilter {
  banco?: string;
  categoria?: string;
  texto?: string;
  tag?: string;
  page?: number;
  size?: number;
}

// === Admin ===
export interface EstatisticasResponse {
  totalUsuarios: number;
  usuariosAtivos: number;
  totalScripts: number;
  scriptsPorBanco: Record<string, number>;
  scriptsPorCategoria: Record<string, number>;
}

// === Error ===
export interface ErrorResponse {
  timeStamp: string;
  status: number;
  erro: string;
  path: string;
}

export interface Evento {
  idEvento: number;
  titulo: string;
  tipo_evento: string;
  endereco: string;
  descricao: string;
  data: string; // or Date
  fk_idusuario: number;
}

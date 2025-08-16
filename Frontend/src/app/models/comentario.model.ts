export interface Comentario {
  fk_idcomunidade: number;
  fk_idusuario: number;
  mensagem: string;
  data_comentario: string; // or Date
  id_comentario: number;
}

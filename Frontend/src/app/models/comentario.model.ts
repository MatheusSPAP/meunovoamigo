export interface Comentario {
  fk_idcomunidade: number;
  fk_idusuario: number;
  mensagem: string;
  data_comentario?: string; // Opcional na criação
  id_comentario?: number;   // Opcional na criação
}

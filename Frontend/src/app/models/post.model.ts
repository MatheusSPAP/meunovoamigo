export interface Post {
  idcomunidade: number;
  descricao: string;
  data_postagem?: string; // Made optional
  titulo: string;
  animal_idAnimal: number;
  usuario_idusuario: number;
}
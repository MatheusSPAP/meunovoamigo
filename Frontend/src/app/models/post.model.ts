export interface Post {
  idcomunidade: number;
  descricao: string;
  data_postagem?: string;
  titulo: string;
  animal_idAnimal: number | null; // Can be null if it's a general post
  usuario_idusuario: number;

  // Joined properties from backend
  nome_usuario?: string;
  nome_animal?: string;
  foto_animal?: string;
}
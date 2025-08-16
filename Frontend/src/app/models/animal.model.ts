export interface Animal {
  idAnimal: number;
  nome: string;
  sexo: 'M' | 'F';
  foto: string;
  descricao: string;
  castrado: boolean;
  vacinado: boolean;
  data_cadastro: string; // or Date
  fk_idusuario: number;
  fk_idstatus: number;
  status_tipo: string; // Added status_tipo
  tipo_idtipo_animal: number;
  tamanho_animal_idtamanho_animal: number;
  comportamento_idcomportamento: number;
  fk_idraca: number;
}
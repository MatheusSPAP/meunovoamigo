export interface Midia {
  idmidia: number;
  nome_arquivo: string;
  tipo: 'foto' | 'video';
  tamanho: number;
  caminho: string;
  data_upload: string;
  postagem_idcomunidade: number;
}

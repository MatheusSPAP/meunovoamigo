export interface InteresseAdocao {
  idinteresse_adocao: number;
  mensagem: string;
  interesse_status: 'Aguardando' | 'Aprovado' | 'Recusado';
  data_interesse: string; // or Date
  usuario_idusuario: number;
  animal_idAnimal: number;
  
  // Propriedades adicionadas do JOIN no backend
  nome_interessado?: string;
  nome_animal?: string;
  nome_dono_animal?: string;
  dono_email?: string;
  dono_telefone?: string;
}

export interface InteresseAdocao {
  idinteresse_adocao: number;
  mensagem: string;
  interesse_status: 'Aguardando' | 'Aprovado' | 'Recusado';
  data_interesse: string; // or Date
  usuario_idusuario: number;
  animal_idAnimal: number;
  animal_fk_idusuario: number;
  animal_fk_idstatus: number;
}

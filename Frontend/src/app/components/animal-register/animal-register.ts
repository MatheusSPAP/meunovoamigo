import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AnimalService } from '../../services/animal.service';
import { UsuarioService } from '../../usuario.service';
import { Router } from '@angular/router';

// Import Models
import { Tipo } from '../../models/tipo.model';
import { TamanhoAnimal } from '../../models/tamanho-animal.model';
import { Comportamento } from '../../models/comportamento.model';
import { Raca } from '../../models/raca.model';
import { Status } from '../../models/status.model';

// Import Services
import { TipoService } from '../../services/tipo.service';
import { TamanhoAnimalService } from '../../services/tamanho-animal.service';
import { ComportamentoService } from '../../services/comportamento.service';
import { RacaService } from '../../services/raca.service';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-animal-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animal-register.html',
  styleUrls: ['./animal-register.css']
})
export class AnimalRegisterComponent implements OnInit {
  animalForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  tipos: Tipo[] = [];
  tamanhos: TamanhoAnimal[] = [];
  comportamentos: Comportamento[] = [];
  racas: Raca[] = [];
  filteredRacas: Raca[] = []; // For filtering by animal type
  disponivelStatusId: number | null = null;

  constructor(
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private router: Router,
    private tipoService: TipoService,
    private tamanhoAnimalService: TamanhoAnimalService,
    private comportamentoService: ComportamentoService,
    private racaService: RacaService,
    private statusService: StatusService
  ) {
    this.animalForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      foto: new FormControl('', [Validators.required]), // Consider file upload later
      descricao: new FormControl('', [Validators.required]),
      castrado: new FormControl(false),
      vacinado: new FormControl(false),
      tipo_idtipo_animal: new FormControl('', [Validators.required]),
      tamanho_animal_idtamanho_animal: new FormControl('', [Validators.required]),
      comportamento_idcomportamento: new FormControl('', [Validators.required]),
      fk_idraca: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.tipoService.getTipos().subscribe((response: any) => { this.tipos = response.data; });
    this.tamanhoAnimalService.getTamanhos().subscribe((response: any) => { this.tamanhos = response.data; });
    this.comportamentoService.getComportamentos().subscribe((response: any) => { this.comportamentos = response.data; });
    this.racaService.getRacas().subscribe((response: any) => {
      this.racas = response.data;
      this.filteredRacas = this.racas;
    });
    this.statusService.getStatus().subscribe((response: any) => {
      const disponivelStatus = response.data.find((status: Status) => status.tipo === 'Disponível');
      if (disponivelStatus) {
        this.disponivelStatusId = disponivelStatus.idstatus;
      }
    });
  }

  onTipoChange(event: Event): void {
    const selectedTipoId = Number((event.target as HTMLSelectElement).value);
    if (selectedTipoId) {
      this.filteredRacas = this.racas.filter(raca => raca.tipo_idtipo_animal === selectedTipoId);
    } else {
      this.filteredRacas = this.racas;
    }
    this.animalForm.get('fk_idraca')?.setValue(''); // Reset selected race
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.animalForm.valid) {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) {
        this.errorMessage = 'Você precisa estar logado para cadastrar um animal.';
        return;
      }

      if (!this.disponivelStatusId) {
        this.errorMessage = 'Não foi possível definir o status padrão do animal. Tente novamente mais tarde.';
        return;
      }

      const animalData = {
        ...this.animalForm.value,
        fk_idusuario: Number(userId), // Assign current logged-in user as owner
        fk_idstatus: this.disponivelStatusId
      };

      this.animalService.createAnimal(animalData).subscribe({
        next: (response) => {
          console.log('Animal cadastrado com sucesso!', response);
          this.successMessage = 'Animal cadastrado com sucesso!';
          this.animalForm.reset();
          // Optionally redirect to animal list or detail page
          this.router.navigate(['/animais']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar animal!', error);
          this.errorMessage = error.error.message || 'Erro ao cadastrar animal. Tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }
}

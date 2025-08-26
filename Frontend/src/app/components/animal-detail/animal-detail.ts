import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { InteresseAdocaoService } from '../../services/interesse-adocao.service';

@Component({
  selector: 'app-animal-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animal-detail.html',
  styleUrls: ['./animal-detail.css']
})
export class AnimalDetailComponent implements OnInit {
  animal: Animal | undefined;
  interesseForm: FormGroup;
  showInterestForm: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  tutorContact: { nome: string, email: string, telefone: string } | null = null;
  currentUserId: number | null = null;
  apiBaseUrl = 'http://localhost:3000'; // Base URL for media files

  constructor(
    private route: ActivatedRoute,
    private animalService: AnimalService,
    private interesseAdocaoService: InteresseAdocaoService
  ) {
    this.interesseForm = new FormGroup({
      mensagem: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.animalService.getAnimalById(id).subscribe((response: any) => {
          this.animal = response.data; // Assuming the backend returns { data: Animal }
        });
      }
    });
    // Certifique-se de que currentUserId é definido aqui
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      this.currentUserId = Number(userId);
    }
  }

  toggleInterestForm(): void {
    this.showInterestForm = !this.showInterestForm;
    this.successMessage = '';
    this.errorMessage = '';
    this.tutorContact = null;
    this.interesseForm.reset();
  }

  onSubmitInteresse(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.tutorContact = null;

    if (this.interesseForm.valid && this.animal) {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) {
        this.errorMessage = 'Você precisa estar logado para manifestar interesse.';
        return;
      }

      const interesseData = {
        mensagem: this.interesseForm.value.mensagem,
        usuario_idusuario: Number(userId),
        animal_idAnimal: this.animal.idAnimal
      };

      this.interesseAdocaoService.createInteresseAdocao(interesseData).subscribe({
        next: (response) => {
          console.log('Interesse de adoção registrado com sucesso!', response);
          this.successMessage = response.message;
          this.tutorContact = response.data;
          this.showInterestForm = false;
          this.interesseForm.reset();
        },
        error: (error) => {
          console.error('Erro ao registrar interesse de adoção!', error);
          this.errorMessage = error.error.message || 'Erro ao registrar interesse. Tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha a mensagem.';
    }
  }
}

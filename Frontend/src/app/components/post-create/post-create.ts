import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { UsuarioService } from '../../usuario.service';
import { AnimalService } from '../../services/animal.service';
import { Router } from '@angular/router';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.css']
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  userAnimals: Animal[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private postService: PostService,
    private usuarioService: UsuarioService,
    private animalService: AnimalService,
    private router: Router
  ) {
    this.postForm = new FormGroup({
      titulo: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      descricao: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      animal_idAnimal: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.loadUserAnimals();
  }

  loadUserAnimals(): void {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      this.animalService.getAnimalsByOwnerId(Number(userId)).subscribe({
        next: (response: any) => {
          this.userAnimals = response.data;
        },
        error: (error) => {
          console.error('Erro ao carregar animais do usuário:', error);
          this.errorMessage = 'Erro ao carregar seus animais. Tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Você precisa estar logado para criar uma postagem.';
    }
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      
      // Gerar preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);

    } else {
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.postForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    const userId = localStorage.getItem('currentUserId');
    if (!userId) {
      this.errorMessage = 'Você precisa estar logado para criar uma postagem.';
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.postForm.get('titulo')!.value);
    formData.append('descricao', this.postForm.get('descricao')!.value);
    formData.append('usuario_idusuario', userId);

    const animalId = this.postForm.get('animal_idAnimal')!.value;
    if (animalId) {
      formData.append('animal_idAnimal', animalId);
    }

    if (this.selectedFile) {
      formData.append('arquivo', this.selectedFile, this.selectedFile.name);
    }

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        console.log('Postagem criada com sucesso!', response);
        this.successMessage = 'Postagem criada com sucesso!';
        this.postForm.reset();
        this.imagePreview = null;
        // Redirecionar após um pequeno atraso para o usuário ver a mensagem
        setTimeout(() => this.router.navigate(['/postagens']), 1500);
      },
      error: (error) => {
        console.error('Erro ao criar postagem!', error);
        this.errorMessage = error.error.message || 'Erro ao criar postagem. Tente novamente.';
      }
    });
  }
}

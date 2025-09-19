import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { UsuarioService } from '../../usuario.service';
import { AnimalService } from '../../services/animal.service';
import { Router } from '@angular/router';
import { Animal } from '../../models/animal.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  @ViewChild('arquivoInput') arquivoInput!: ElementRef;

  postForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  userAnimals: Animal[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  private currentUserId: number | null = null;
  private subscription = new Subscription();

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
    const userSub = this.usuarioService.currentUserId$.subscribe(userId => {
      this.currentUserId = userId;
      if (userId) {
        this.loadUserAnimals(userId);
      } else {
        this.errorMessage = 'Você precisa estar logado para criar uma postagem.';
      }
    });
    this.subscription.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadUserAnimals(userId: number): void {
    this.animalService.getAnimalsByOwnerId(userId).subscribe({
      next: (response: any) => {
        this.userAnimals = response.data;
      },
      error: (error) => {
        console.error('Erro ao carregar animais do usuário:', error);
        this.errorMessage = 'Erro ao carregar seus animais. Tente novamente.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      
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

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    if (this.arquivoInput) {
      this.arquivoInput.nativeElement.value = '';
    }
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.postForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (!this.currentUserId) {
      this.errorMessage = 'Você precisa estar logado para criar uma postagem.';
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.postForm.get('titulo')!.value);
    formData.append('descricao', this.postForm.get('descricao')!.value);
    formData.append('usuario_idusuario', this.currentUserId.toString());

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
        setTimeout(() => this.router.navigate(['/postagens']), 1500);
      },
      error: (error) => {
        console.error('Erro ao criar postagem!', error);
        this.errorMessage = error.error.message || 'Erro ao criar postagem. Tente novamente.';
      }
    });
  }
}

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

  constructor(
    private postService: PostService,
    private usuarioService: UsuarioService,
    private animalService: AnimalService,
    private router: Router
  ) {
    this.postForm = new FormGroup({
      titulo: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      descricao: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      animal_idAnimal: new FormControl('', [Validators.required])
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

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.postForm.valid) {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) {
        this.errorMessage = 'Você precisa estar logado para criar uma postagem.';
        return;
      }

      const postData = {
        ...this.postForm.value,
        usuario_idusuario: Number(userId),
        data_postagem: new Date().toISOString().slice(0, 10) // Add data_postagem
      };

      this.postService.createPost(postData).subscribe({
        next: (response) => {
          console.log('Postagem criada com sucesso!', response);
          this.successMessage = 'Postagem criada com sucesso!';
          this.postForm.reset();
          this.router.navigate(['/postagens']);
        },
        error: (error) => {
          console.error('Erro ao criar postagem!', error);
          this.errorMessage = error.error.message || 'Erro ao criar postagem. Tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { ComentarioService } from '../../services/comentario.service';
import { Comentario } from '../../models/comentario.model';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../usuario.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-detail.html',
  styleUrls: ['./post-detail.css']
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  comentarios: Comentario[] = [];
  comentarioForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private comentarioService: ComentarioService,
    private usuarioService: UsuarioService
  ) {
    this.comentarioForm = new FormGroup({
      mensagem: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.postService.getPostById(id).subscribe((response: any) => {
          this.post = response.data; // Assuming the backend returns { data: Post }
          this.loadComentarios(id);
        });
      }
    });
  }

  loadComentarios(postId: number): void {
    this.comentarioService.getComentariosByPostId(postId).subscribe({
      next: (response: any) => {
        this.comentarios = response.data;
      },
      error: (error) => {
        console.error('Erro ao carregar comentários:', error);
        this.errorMessage = 'Erro ao carregar comentários.';
      }
    });
  }

  onSubmitComentario(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.comentarioForm.valid && this.post) {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) {
        this.errorMessage = 'Você precisa estar logado para comentar.';
        return;
      }

      const comentarioData = {
        fk_idcomunidade: this.post.idcomunidade,
        fk_idusuario: Number(userId),
        mensagem: this.comentarioForm.value.mensagem
      };

      this.comentarioService.createComentario(comentarioData).subscribe({
        next: (response) => {
          console.log('Comentário adicionado com sucesso!', response);
          this.successMessage = 'Comentário adicionado com sucesso!';
          this.comentarioForm.reset();
          this.loadComentarios(this.post!.idcomunidade);
        },
        error: (error) => {
          console.error('Erro ao adicionar comentário!', error);
          this.errorMessage = error.error.message || 'Erro ao adicionar comentário. Tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha a mensagem do comentário.';
    }
  }
}

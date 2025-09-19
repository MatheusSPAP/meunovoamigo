import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { ComentarioService } from '../../services/comentario.service';
import { Comentario } from '../../models/comentario.model';
import { MidiaService } from '../../services/midia.service';
import { Midia } from '../../models/midia.model';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-detail.html',
  styleUrls: ['./post-detail.css']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post | undefined;
  comentarios: Comentario[] = [];
  medias: Midia[] = [];
  comentarioForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  apiBaseUrl = 'http://localhost:3000';

  private currentUserId: number | null = null;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private comentarioService: ComentarioService,
    private midiaService: MidiaService,
    private usuarioService: UsuarioService
  ) {
    this.comentarioForm = new FormGroup({
      mensagem: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  ngOnInit(): void {
    const routeSub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.postService.getPostById(id).subscribe((response: any) => {
          this.post = response.data;
          this.loadComentarios(id);
          this.loadMedias(id);
        });
      }
    });

    const userSub = this.usuarioService.currentUserId$.subscribe(userId => {
      this.currentUserId = userId;
    });

    this.subscription.add(routeSub);
    this.subscription.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadComentarios(postId: number): void {
    this.comentarioService.getComentariosByPostId(postId).subscribe({
      next: (response: any) => {
        this.comentarios = response.data;
      },
      error: (error) => {
        console.error('Erro ao carregar comentários:', error);
      }
    });
  }

  loadMedias(postId: number): void {
    this.midiaService.getMidiasByPostId(postId).subscribe({
      next: (response) => {
        if (response.success) {
          this.medias = response.data;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar mídias:', error);
      }
    });
  }

  onSubmitComentario(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.comentarioForm.valid && this.post) {
      if (!this.currentUserId) {
        this.errorMessage = 'Você precisa estar logado para comentar.';
        return;
      }

      const comentarioData = {
        fk_idcomunidade: this.post.idcomunidade,
        fk_idusuario: this.currentUserId,
        mensagem: this.comentarioForm.value.mensagem
      };

      this.comentarioService.createComentario(comentarioData).subscribe({
        next: (response) => {
          this.successMessage = 'Comentário adicionado com sucesso!';
          this.comentarioForm.reset();
          this.loadComentarios(this.post!.idcomunidade);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Erro ao adicionar comentário. Tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha a mensagem do comentário.';
    }
  }
}
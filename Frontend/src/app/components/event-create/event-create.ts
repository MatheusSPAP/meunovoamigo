import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { UsuarioService } from '../../usuario.service';
import { Router } from '@angular/router';
import { Evento } from '../../models/evento.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-create.html',
  styleUrls: ['./event-create.css']
})
export class EventCreateComponent implements OnInit, OnDestroy {
  eventForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  eventTypes: string[] = ['Feira de Adoção', 'Campanha de Vacinação', 'Mutirão de Castração', 'Outro'];

  private currentUserId: number | null = null;
  private subscription = new Subscription();

  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.eventForm = new FormGroup({
      titulo: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      tipo_evento: new FormControl('', [Validators.required]),
      endereco: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      descricao: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      data: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    const userSub = this.usuarioService.currentUserId$.subscribe(userId => {
      this.currentUserId = userId;
    });
    this.subscription.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.eventForm.valid) {
      if (!this.currentUserId) {
        this.errorMessage = 'Você precisa estar logado para cadastrar um evento.';
        return;
      }

      const eventData: Evento = {
        ...this.eventForm.value,
        fk_idusuario: this.currentUserId,
        idEvento: 0 // Será gerado pelo backend
      };

      this.eventoService.createEvento(eventData).subscribe({
        next: (response) => {
          console.log('Evento cadastrado com sucesso!', response);
          this.successMessage = 'Evento cadastrado com sucesso!';
          this.eventForm.reset();
          this.router.navigate(['/eventos']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar evento!', error);
          this.errorMessage = error.error.message || 'Erro ao cadastrar evento. Tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }
}

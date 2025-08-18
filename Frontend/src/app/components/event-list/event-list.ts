import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Evento } from '../../models/evento.model';
import { EventoService } from '../../services/evento.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'; // Adicionado

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule], // Adicionado ReactiveFormsModule
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.css']
})
export class EventListComponent implements OnInit {
  eventos: Evento[] = [];
  filterForm: FormGroup;
  eventTypes: string[] = ['Feira de Adoção', 'Campanha de Vacinação', 'Mutirão de Castração', 'Outro'];
  periodoOptions: { value: string, label: string }[] = [
    { value: '', label: 'Todos os Períodos' },
    { value: 'upcoming', label: 'Próximos Eventos' },
    { value: 'past', label: 'Eventos Passados' },
    { value: 'next7days', label: 'Próximos 7 Dias' },
    { value: 'next30days', label: 'Próximos 30 Dias' },
  ];
  sortOrderOptions: { value: string, label: string }[] = [
    { value: 'asc', label: 'Mais Próximos Primeiro' },
    { value: 'desc', label: 'Mais Distantes Primeiro' },
  ];

  constructor(private eventoService: EventoService) {
    this.filterForm = new FormGroup({
      tipo: new FormControl(''),
      dataInicio: new FormControl(''),
      dataFim: new FormControl(''),
      periodo: new FormControl(''), // Novo controle para o período
      ordenar: new FormControl('asc') // Novo controle para ordenação, padrão ascendente
    });
  }

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos(): void {
    const { ordenar } = this.filterForm.value;
    this.eventoService.getEventos(ordenar).subscribe((response: any) => {
      this.eventos = response.data;
    });
  }

  onPeriodoChange(): void {
    const periodo = this.filterForm.get('periodo')?.value;
    const today = new Date();
    let dataInicio = '';
    let dataFim = '';

    switch (periodo) {
      case 'upcoming':
        dataInicio = today.toISOString().slice(0, 10);
        dataFim = ''; // Sem data fim para eventos futuros
        break;
      case 'past':
        dataInicio = ''; // Sem data início para eventos passados
        dataFim = today.toISOString().slice(0, 10);
        break;
      case 'next7days':
        dataInicio = today.toISOString().slice(0, 10);
        const next7days = new Date();
        next7days.setDate(today.getDate() + 7);
        dataFim = next7days.toISOString().slice(0, 10);
        break;
      case 'next30days':
        dataInicio = today.toISOString().slice(0, 10);
        const next30days = new Date();
        next30days.setDate(today.getDate() + 30);
        dataFim = next30days.toISOString().slice(0, 10);
        break;
      default:
        dataInicio = '';
        dataFim = '';
        break;
    }

    this.filterForm.patchValue({ dataInicio, dataFim });
  }

  filterEvents(): void {
    const { tipo, dataInicio, dataFim, ordenar } = this.filterForm.value;

    if (tipo) {
      this.eventoService.getEventosByTipo(tipo, ordenar).subscribe((response: any) => {
        this.eventos = response.data;
      });
    } else if (dataInicio || dataFim) { // Alterado para permitir apenas uma data
      this.eventoService.getEventosByPeriodo(dataInicio, dataFim, ordenar).subscribe((response: any) => {
        this.eventos = response.data;
      });
    } else {
      this.loadEventos(); // Se nenhum filtro, carrega todos
    }
  }

  resetFilters(): void {
    this.filterForm.reset({ tipo: '', dataInicio: '', dataFim: '', periodo: '', ordenar: 'asc' });
    this.loadEventos();
  }
}
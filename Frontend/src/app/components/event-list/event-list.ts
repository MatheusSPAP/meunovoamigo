import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evento } from '../../models/evento.model';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.css']
})
export class EventListComponent implements OnInit {
  eventos: Evento[] = [];

  constructor(private eventoService: EventoService) { }

  ngOnInit(): void {
    this.eventoService.getEventos().subscribe((response: any) => {
      this.eventos = response.data;
    });
  }
}
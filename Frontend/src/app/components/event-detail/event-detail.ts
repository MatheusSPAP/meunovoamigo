import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css']
})
export class EventDetailComponent implements OnInit {
  event: Evento | undefined;

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.eventoService.getEventoById(id).subscribe((response: any) => {
          this.event = response.data; // Assuming the backend returns { data: Evento }
        });
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Animal } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';
import { Tipo } from '../../models/tipo.model';
import { TamanhoAnimal } from '../../models/tamanho-animal.model';
import { Raca } from '../../models/raca.model';
import { TipoService } from '../../services/tipo.service';
import { TamanhoAnimalService } from '../../services/tamanho-animal.service';
import { RacaService } from '../../services/raca.service';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './animal-list.html',
  styleUrls: ['./animal-list.css']
})
export class AnimalListComponent implements OnInit {
  animais: Animal[] = [];
  apiBaseUrl = 'http://localhost:3000';
  
  tipos$: Observable<Tipo[]> = of([]);
  tamanhos$: Observable<TamanhoAnimal[]> = of([]);
  racas$: Observable<Raca[]> = of([]);

  filterForm: FormGroup;
  showFilters = false;

  constructor(
    private animalService: AnimalService,
    private tipoService: TipoService,
    private tamanhoService: TamanhoAnimalService,
    private racaService: RacaService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      nome: [''],
      tipoId: [null],
      tamanhoId: [null],
      racaId: [null]
    });
  }

  ngOnInit(): void {
    this.showFilters = this.router.url.includes('/animais');

    if (this.showFilters) {
      this.tipos$ = this.tipoService.getTipos();
      this.tamanhos$ = this.tamanhoService.getTamanhos();
      this.racas$ = of([]); // Inicializa vazio

      this.filterForm.get('tipoId')?.valueChanges.subscribe(tipoId => {
        this.filterForm.get('racaId')?.setValue(null, { emitEvent: false });
        if (tipoId) {
          this.racas$ = this.racaService.getRacasByTipo(tipoId);
        } else {
          this.racas$ = of([]);
        }
      });

      this.filterForm.valueChanges.pipe(
        startWith(this.filterForm.value),
        debounceTime(300),
        switchMap(filters => this.animalService.getAnimais(this.mapFilters(filters)))
      ).subscribe((response: any) => {
        this.animais = response.data;
      });
    } else {
      // Se não mostrar filtros, apenas carrega todos os animais disponíveis
      this.animalService.getAnimais({ status: 'Disponível' }).subscribe((response: any) => {
        this.animais = response.data;
      });
    }
  }

  mapFilters(filters: any) {
    return {
      nome: filters.nome || null,
      tipoId: filters.tipoId || null,
      tamanhoId: filters.tamanhoId || null,
      racaId: filters.racaId || null,
      status: 'Disponível'
    };
  }
}

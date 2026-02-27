import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteresseAdocao } from '../../models/interesse-adocao.model';
import { InteresseAdocaoService } from '../../services/interesse-adocao.service';
import { UsuarioService } from '../../usuario.service';
import { AnimalService } from '../../services/animal.service';
import { StatusService } from '../../services/status.service';
import { Status } from '../../models/status.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-interesse-adocao-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interesse-adocao-list.html',
  styleUrls: ['./interesse-adocao-list.css']
})
export class InteresseAdocaoListComponent implements OnInit, OnDestroy {
  interessesManifestados: InteresseAdocao[] = [];
  interessesRecebidos: InteresseAdocao[] = [];
  currentUserId: number | null = null;
  errorMessage: string = '';
  statuses: Status[] = [];
  selectedTab: 'manifested' | 'received' = 'manifested';
  private subscription = new Subscription();

  constructor(
    private interesseAdocaoService: InteresseAdocaoService,
    private usuarioService: UsuarioService,
    private animalService: AnimalService,
    private statusService: StatusService
  ) { }

  ngOnInit(): void {
    this.loadStatuses();
    const userSub = this.usuarioService.currentUserId$.subscribe(userId => {
      if (userId) {
        this.currentUserId = userId;
        this.loadInteresses();
      } else {
        this.currentUserId = null;
        this.errorMessage = 'Você precisa estar logado para ver os interesses de adoção.';
      }
    });
    this.subscription.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadInteresses(): void {
    if (!this.currentUserId) return;

    this.interesseAdocaoService.getInteressesByUsuario(this.currentUserId).subscribe({
      next: (data) => {
        this.interessesManifestados = data;
      },
      error: (error) => {
        console.error('Erro ao carregar interesses manifestados:', error);
        this.errorMessage = 'Erro ao carregar interesses manifestados.';
      }
    });

    this.interesseAdocaoService.getInteressesByDonoAnimal(this.currentUserId).subscribe({
      next: (data) => {
        this.interessesRecebidos = data;
      },
      error: (error) => {
        console.error('Erro ao carregar interesses recebidos:', error);
        this.errorMessage = 'Erro ao carregar interesses recebidos.';
      }
    });
  }

  loadStatuses(): void {
    this.statusService.getStatus().subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error('Erro ao carregar status:', error);
        this.errorMessage = 'Erro ao carregar status.';
      }
    });
  }

  selectTab(tab: 'manifested' | 'received'): void {
    this.selectedTab = tab;
  }

  aprovarInteresse(interesseId: number, animalId: number): void {
    this.interesseAdocaoService.aprovarAdocao(interesseId).subscribe({
      next: (response) => {
        console.log('Adoção aprovada com sucesso!', response);
        this.loadInteresses(); // Recarrega a lista para refletir as mudanças
      },
      error: (error) => {
        console.error('Erro ao aprovar adoção!', error);
        this.errorMessage = error.error.message || 'Ocorreu um erro ao aprovar a adoção.';
      }
    });
  }

  recusarInteresse(interesseId: number): void {
    this.interesseAdocaoService.updateInteresseStatus(interesseId, 'Recusado').subscribe({
      next: (response) => {
        console.log('Interesse recusado com sucesso!', response);
        this.loadInteresses();
      },
      error: (error) => {
        console.error('Erro ao recusar interesse!', error);
        this.errorMessage = 'Erro ao recusar interesse.';
      }
    });
  }
}

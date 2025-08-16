import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteresseAdocao } from '../../models/interesse-adocao.model';
import { InteresseAdocaoService } from '../../services/interesse-adocao.service';
import { UsuarioService } from '../../usuario.service';
import { AnimalService } from '../../services/animal.service';
import { StatusService } from '../../services/status.service';
import { Status } from '../../models/status.model';

@Component({
  selector: 'app-interesse-adocao-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interesse-adocao-list.html',
  styleUrls: ['./interesse-adocao-list.css']
})
export class InteresseAdocaoListComponent implements OnInit {
  interessesManifestados: InteresseAdocao[] = [];
  interessesRecebidos: InteresseAdocao[] = [];
  currentUserId: number | null = null;
  errorMessage: string = '';
  statuses: Status[] = [];

  constructor(
    private interesseAdocaoService: InteresseAdocaoService,
    private usuarioService: UsuarioService,
    private animalService: AnimalService,
    private statusService: StatusService
  ) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      this.currentUserId = Number(userId);
      this.loadInteresses();
      this.loadStatuses();
    } else {
      this.errorMessage = 'Você precisa estar logado para ver os interesses de adoção.';
    }
  }

  loadInteresses(): void {
    if (this.currentUserId) {
      this.interesseAdocaoService.getInteressesByUsuario(this.currentUserId).subscribe({
        next: (response: any) => {
          this.interessesManifestados = response.data;
        },
        error: (error) => {
          console.error('Erro ao carregar interesses manifestados:', error);
          this.errorMessage = 'Erro ao carregar interesses manifestados.';
        }
      });

      this.interesseAdocaoService.getInteressesByDonoAnimal(this.currentUserId).subscribe({
        next: (response: any) => {
          this.interessesRecebidos = response.data;
        },
        error: (error) => {
          console.error('Erro ao carregar interesses recebidos:', error);
          this.errorMessage = 'Erro ao carregar interesses recebidos.';
        }
      });
    }
  }

  loadStatuses(): void {
    this.statusService.getStatus().subscribe({
      next: (response: any) => {
        this.statuses = response.data;
      },
      error: (error) => {
        console.error('Erro ao carregar status:', error);
        this.errorMessage = 'Erro ao carregar status.';
      }
    });
  }

  aprovarInteresse(interesseId: number, animalId: number): void {
    this.interesseAdocaoService.updateInteresseStatus(interesseId, 'Aprovado').subscribe({
      next: (response) => {
        console.log('Interesse aprovado com sucesso!', response);
        const adotadoStatus = this.statuses.find(status => status.tipo === 'Adotado');
        if (adotadoStatus) {
          this.animalService.updateAnimalStatus(animalId, adotadoStatus.idstatus).subscribe({
            next: (animalResponse) => {
              console.log('Status do animal atualizado para Adotado!', animalResponse);
              this.loadInteresses();
            },
            error: (animalError) => {
              console.error('Erro ao atualizar status do animal!', animalError);
              this.errorMessage = 'Erro ao atualizar status do animal.';
            }
          });
        } else {
          this.errorMessage = 'Status "Adotado" não encontrado.';
        }
      },
      error: (error) => {
        console.error('Erro ao aprovar interesse!', error);
        this.errorMessage = 'Erro ao aprovar interesse.';
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
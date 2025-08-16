import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Animal } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './animal-list.html',
  styleUrls: ['./animal-list.css']
})
export class AnimalListComponent implements OnInit {
  animais: Animal[] = [];

  constructor(private animalService: AnimalService) { }

  ngOnInit(): void {
    this.animalService.getAnimais().subscribe((response: any) => {
      this.animais = response.data;
    });
  }
}

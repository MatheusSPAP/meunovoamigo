import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;
  currentUserName: string | null = null;
  private authSubscription: Subscription | undefined;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.authSubscription = this.usuarioService.isLoggedIn$.subscribe(loggedIn => {
      this.isUserLoggedIn = loggedIn;
    });

    this.usuarioService.currentUserName$.subscribe(name => {
      this.currentUserName = name;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  isLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }

  logout(): void {
    this.usuarioService.logout();
  }
}
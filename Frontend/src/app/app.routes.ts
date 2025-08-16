import { Routes } from '@angular/router';
// import { RegistroComponent } from './registro/registro'; // Removed
import { HomeComponent } from './home/home';
import { AnimalListComponent } from './components/animal-list/animal-list';
import { AnimalDetailComponent } from './components/animal-detail/animal-detail';
// import { LoginComponent } from './components/login/login'; // Removed
import { UserProfileComponent } from './components/user-profile/user-profile';
import { PostListComponent } from './components/post-list/post-list';
import { EventListComponent } from './components/event-list/event-list';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard';
import { InteresseAdocaoListComponent } from './components/interesse-adocao-list/interesse-adocao-list';
import { AnimalRegisterComponent } from './components/animal-register/animal-register';
import { PostCreateComponent } from './components/post-create/post-create';
import { PostDetailComponent } from './components/post-detail/post-detail';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Home now handles login/register

    // Protected Routes
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // New Dashboard route
    { path: 'animais', component: AnimalListComponent, canActivate: [AuthGuard] },
    { path: 'animais/:id', component: AnimalDetailComponent, canActivate: [AuthGuard] },
    { path: 'postagens', component: PostListComponent, canActivate: [AuthGuard] },
    { path: 'postagens/:id', component: PostDetailComponent, canActivate: [AuthGuard] }, // New Post Detail route
    { path: 'criar-postagem', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'eventos', component: EventListComponent, canActivate: [AuthGuard] },
    { path: 'perfil', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'interesses-adocao', component: InteresseAdocaoListComponent, canActivate: [AuthGuard] },
    { path: 'cadastrar-animal', component: AnimalRegisterComponent, canActivate: [AuthGuard] },

    // Redirect any old /login or /registro attempts to home
    { path: 'login', redirectTo: '', pathMatch: 'full' },
    { path: 'registro', redirectTo: '', pathMatch: 'full' }
];
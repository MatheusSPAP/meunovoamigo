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
import { LoggedInAuthGuard } from './guards/logged-in.guard';
import { PublicAnimalListComponent } from './components/public-animal-list/public-animal-list';

import { InteresseAdocaoListComponent } from './components/interesse-adocao-list/interesse-adocao-list';
import { AnimalRegisterComponent } from './components/animal-register/animal-register';
import { PostCreateComponent } from './components/post-create/post-create';
import { PostDetailComponent } from './components/post-detail/post-detail';
import { EventCreateComponent } from './components/event-create/event-create'; // Adicionado
import { EventDetailComponent } from './components/event-detail/event-detail'; // Adicionado
import { ChatListComponent } from './components/chat-list/chat-list';
import { ChatWindowComponent } from './components/chat-window/chat-window';

export const routes: Routes = [
    { path: '', component: AnimalListComponent }, // Página pública por padrão
    { path: 'adocao', component: AnimalListComponent }, // Rota alternativa

    // Página pública de detalhes do animal
    { path: 'animais/:id', component: AnimalDetailComponent }, // Rota pública para detalhes

    // Protected Routes
    { path: 'dashboard', component: AnimalListComponent, canActivate: [AuthGuard] }, // New Dashboard route
    { path: 'animais', component: AnimalListComponent, canActivate: [AuthGuard] }, // Página protegida com lista completa
    { path: 'postagens', component: PostListComponent, canActivate: [AuthGuard] },
    { path: 'postagens/:id', component: PostDetailComponent, canActivate: [AuthGuard] }, // New Post Detail route
    { path: 'criar-postagem', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'eventos', component: EventListComponent, canActivate: [AuthGuard] },
    { path: 'eventos/:id', component: EventDetailComponent, canActivate: [AuthGuard] }, // Adicionado
    { path: 'cadastrar-evento', component: EventCreateComponent, canActivate: [AuthGuard] }, // Adicionado
    { path: 'perfil', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'interesses-adocao', component: InteresseAdocaoListComponent, canActivate: [AuthGuard] },
    { path: 'cadastrar-animal', component: AnimalRegisterComponent, canActivate: [AuthGuard] },
    { path: 'mensagens', component: ChatListComponent, canActivate: [AuthGuard] },
    { path: 'mensagens/:id', component: ChatWindowComponent, canActivate: [AuthGuard] },

    // Rota de login com proteção - permite acesso se não estiver logado, redireciona se estiver
    { path: 'login', component: HomeComponent, canActivate: [LoggedInAuthGuard] },

    // Redirect any old /registro attempts to login
    { path: 'registro', redirectTo: '/login', pathMatch: 'full' }
];
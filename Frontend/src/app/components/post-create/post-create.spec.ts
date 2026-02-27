import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { PostCreateComponent } from './post-create';
import { PostService } from '../../services/post.service';
import { UsuarioService } from '../../usuario.service';
import { AnimalService } from '../../services/animal.service';

describe('PostCreateComponent', () => {
  let component: PostCreateComponent;
  let fixture: ComponentFixture<PostCreateComponent>;

  let postServiceSpy: { createPost: jest.Mock };
  let animalServiceSpy: { getAnimalsByOwnerId: jest.Mock };
  let routerSpy: { navigate: jest.Mock };
  let currentUserIdSubject: BehaviorSubject<number | null>;

  beforeEach(async () => {
    postServiceSpy = { createPost: jest.fn() };
    animalServiceSpy = { getAnimalsByOwnerId: jest.fn() };
    routerSpy = { navigate: jest.fn() };
    currentUserIdSubject = new BehaviorSubject<number | null>(null);

    animalServiceSpy.getAnimalsByOwnerId.mockReturnValue(of({ data: [] }));
    postServiceSpy.createPost.mockReturnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [PostCreateComponent],
      providers: [
        { provide: PostService, useValue: postServiceSpy as Partial<PostService> },
        { provide: AnimalService, useValue: animalServiceSpy as Partial<AnimalService> },
        { provide: Router, useValue: routerSpy as Partial<Router> },
        {
          provide: UsuarioService,
          useValue: { currentUserId$: currentUserIdSubject.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir erro ao enviar formulario invalido', () => {
    component.onSubmit();

    expect(component.errorMessage).toContain('preencha todos os campos');
    expect(postServiceSpy.createPost).not.toHaveBeenCalled();
  });

  it('deve exibir erro quando usuario nao estiver logado', () => {
    component.postForm.patchValue({
      titulo: 'Titulo valido',
      descricao: 'Descricao valida',
    });

    component.onSubmit();

    expect(component.errorMessage).toContain('precisa estar logado');
    expect(postServiceSpy.createPost).not.toHaveBeenCalled();
  });

  it('deve enviar formulario valido e navegar apos sucesso', fakeAsync(() => {
    currentUserIdSubject.next(7);
    component.postForm.patchValue({
      titulo: 'Meu post',
      descricao: 'Descricao do post',
      animal_idAnimal: 2,
    });

    component.onSubmit();

    expect(postServiceSpy.createPost).toHaveBeenCalled();
    expect(component.successMessage).toContain('Postagem criada com sucesso');
    tick(1500);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/postagens']);
  }));
});


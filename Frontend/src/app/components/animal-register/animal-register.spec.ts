import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalRegister } from './animal-register';

describe('AnimalRegister', () => {
  let component: AnimalRegister;
  let fixture: ComponentFixture<AnimalRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

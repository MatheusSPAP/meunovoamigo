import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresseAdocaoList } from './interesse-adocao-list';

describe('InteresseAdocaoList', () => {
  let component: InteresseAdocaoList;
  let fixture: ComponentFixture<InteresseAdocaoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteresseAdocaoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteresseAdocaoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

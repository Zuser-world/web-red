import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerficarCorreoComponent } from './verficar-correo.component';

describe('VerficarCorreoComponent', () => {
  let component: VerficarCorreoComponent;
  let fixture: ComponentFixture<VerficarCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerficarCorreoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerficarCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

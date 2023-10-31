import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleAlumnoPage } from './detalle-alumno.page';

describe('DetalleAlumnoPage', () => {
  let component: DetalleAlumnoPage;
  let fixture: ComponentFixture<DetalleAlumnoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetalleAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

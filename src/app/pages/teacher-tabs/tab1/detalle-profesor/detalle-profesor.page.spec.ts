import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleProfesorPage } from './detalle-profesor.page';

describe('DetalleProfesorPage', () => {
  let component: DetalleProfesorPage;
  let fixture: ComponentFixture<DetalleProfesorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetalleProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

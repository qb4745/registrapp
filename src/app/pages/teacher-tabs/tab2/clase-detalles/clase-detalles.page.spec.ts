import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaseDetallesPage } from './clase-detalles.page';

describe('ClaseDetallesPage', () => {
  let component: ClaseDetallesPage;
  let fixture: ComponentFixture<ClaseDetallesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClaseDetallesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

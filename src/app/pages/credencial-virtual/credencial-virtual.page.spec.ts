import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredencialVirtualPage } from './credencial-virtual.page';

describe('CredencialVirtualPage', () => {
  let component: CredencialVirtualPage;
  let fixture: ComponentFixture<CredencialVirtualPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CredencialVirtualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

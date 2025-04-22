import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KhaoSatKhauPhanPage } from './khaosatkhauphan.page';

describe('KhaoSatKhauPhanComponent', () => {
  let component: KhaoSatKhauPhanPage;
  let fixture: ComponentFixture<KhaoSatKhauPhanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KhaoSatKhauPhanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

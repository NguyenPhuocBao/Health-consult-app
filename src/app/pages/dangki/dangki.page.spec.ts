import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DangKyPage } from './dangki.page';

describe('DangKyComponent', () => {
  let component: DangKyPage;
  let fixture: ComponentFixture<DangKyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DangKyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

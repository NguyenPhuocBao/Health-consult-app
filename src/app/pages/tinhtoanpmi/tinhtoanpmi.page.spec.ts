import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TinhToanBmiPage } from './tinhtoanpmi.page';

describe('TinhToanBmiComponent', () => {
  let component: TinhToanBmiPage;
  let fixture: ComponentFixture<TinhToanBmiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TinhToanBmiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

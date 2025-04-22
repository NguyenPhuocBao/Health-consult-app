import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrangCaNhanPage } from './trangcanhan.page';

describe('TrangcanhanPage', () => {
  let component: TrangCaNhanPage;
  let fixture: ComponentFixture<TrangCaNhanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrangCaNhanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

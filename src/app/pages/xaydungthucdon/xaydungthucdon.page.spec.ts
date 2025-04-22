import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XayDungThucDonPage} from './xaydungthucdon.page';

describe('XayDungThucDonComponent', () => {
  let component: XayDungThucDonPage;
  let fixture: ComponentFixture<XayDungThucDonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(XayDungThucDonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMainFooterComponent } from './client-main-footer.component';

describe('ClientMainFooterComponent', () => {
  let component: ClientMainFooterComponent;
  let fixture: ComponentFixture<ClientMainFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMainFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMainFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

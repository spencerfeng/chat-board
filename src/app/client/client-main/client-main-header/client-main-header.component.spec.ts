import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMainHeaderComponent } from './client-main-header.component';

describe('ClientMainHeaderComponent', () => {
  let component: ClientMainHeaderComponent;
  let fixture: ComponentFixture<ClientMainHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMainHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMainHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMainBodyComponent } from './client-main-body.component';

describe('ClientMainBodyComponent', () => {
  let component: ClientMainBodyComponent;
  let fixture: ComponentFixture<ClientMainBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMainBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMainBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

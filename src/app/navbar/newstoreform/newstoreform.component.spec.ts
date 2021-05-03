import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewstoreformComponent } from './newstoreform.component';

describe('NewstoreformComponent', () => {
  let component: NewstoreformComponent;
  let fixture: ComponentFixture<NewstoreformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewstoreformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewstoreformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

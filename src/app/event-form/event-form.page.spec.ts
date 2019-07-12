import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFormPage } from './event-form.page';

describe('EventFormPage', () => {
  let component: EventFormPage;
  let fixture: ComponentFixture<EventFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

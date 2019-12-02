import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHomePage } from './form-home.page';

describe('FormHomePage', () => {
  let component: FormHomePage;
  let fixture: ComponentFixture<FormHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

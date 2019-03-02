import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextMessagePage } from './text-message.page';

describe('TextMessagePage', () => {
  let component: TextMessagePage;
  let fixture: ComponentFixture<TextMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextMessagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

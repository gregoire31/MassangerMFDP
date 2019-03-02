import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCreationPage } from './channel-creation.page';

describe('ChannelCreationPage', () => {
  let component: ChannelCreationPage;
  let fixture: ComponentFixture<ChannelCreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCreationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

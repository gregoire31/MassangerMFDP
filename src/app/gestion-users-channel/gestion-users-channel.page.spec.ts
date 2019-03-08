import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionUsersChannelPage } from './gestion-users-channel.page';

describe('GestionUsersChannelPage', () => {
  let component: GestionUsersChannelPage;
  let fixture: ComponentFixture<GestionUsersChannelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionUsersChannelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionUsersChannelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersPage } from './list-users.page';

describe('ListUsersPage', () => {
  let component: ListUsersPage;
  let fixture: ComponentFixture<ListUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUsersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

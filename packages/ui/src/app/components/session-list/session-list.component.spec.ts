import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionListComponent } from './session-list.component';

describe('SessionList', () => {
  let component: SessionListComponent;
  let fixture: ComponentFixture<SessionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

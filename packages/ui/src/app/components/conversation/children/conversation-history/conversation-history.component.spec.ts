import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationHistoryComponent } from './conversation-history.component';

describe('ConversationHistory', () => {
  let component: ConversationHistoryComponent;
  let fixture: ComponentFixture<ConversationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

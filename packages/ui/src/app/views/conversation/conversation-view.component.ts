import { Component, input } from '@angular/core';
import { ConversationComponent } from '../../components/conversation/conversation.component';
import { SessionListComponent } from '../../components/session-list/session-list.component';
import { RouterLink } from '@angular/router';
import { ConversationId } from '../../types/conversation.type';

@Component({
  selector: 'app-conversation-view',
  imports: [ConversationComponent, SessionListComponent, RouterLink],
  templateUrl: './conversation-view.component.html',
  styleUrl: './conversation-view.component.scss',
})
export class ConversationViewComponent {
  protected conversationId = input.required<ConversationId>();
}

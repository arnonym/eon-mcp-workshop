import { Component, inject, input } from '@angular/core';
import { ConversationHistoryComponent } from './children/conversation-history/conversation-history.component';
import { PromptInput } from './children/prompt-input/prompt-input';
import { ConversationService } from '../../services/conversation.service';
import { ConversationId } from '../../types/conversation.type';

@Component({
  selector: 'app-conversation',
  imports: [ConversationHistoryComponent, PromptInput],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss',
})
export class ConversationComponent {
  public conversationId = input.required<ConversationId>();
  private conversationService = inject(ConversationService);

  protected handlePromptSubmit(prompt: string): void {
    this.conversationService.pushPromptToConversation(this.conversationId(), prompt);
  }
}

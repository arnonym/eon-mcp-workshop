import { Component, inject } from '@angular/core';
import { PromptInput } from '../conversation/children/prompt-input/prompt-input';
import { ConversationService } from '../../services/conversation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-conversation',
  imports: [PromptInput],
  templateUrl: './new-conversation.html',
  styleUrl: './new-conversation.scss',
})
export class NewConversation {
  private conversationService = inject(ConversationService);
  private router = inject(Router);

  protected handlePromptSubmit(prompt: string) {
    const newConversationId = this.conversationService.createConversation(prompt);
    this.router.navigate([`/${newConversationId}`]).then();
  }
}

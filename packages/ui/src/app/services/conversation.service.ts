import { inject, Injectable } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { asConversationId, ConversationId } from '../types/conversation.type';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private sessionService = inject(SessionService);
  private httpClient = inject(HttpClient);

  constructor() {}

  public createConversation(prompt: string): ConversationId {
    const newConversation = {
      id: asConversationId(crypto.randomUUID()),
      title: prompt,
      messageList: [{ createdBy: 'user', text: prompt } as const],
    };
    this.sessionService.createOrUpdateConversation(newConversation);
    this.promptRequest(newConversation.id, prompt);
    return newConversation.id;
  }

  public pushPromptToConversation(conversationId: ConversationId, prompt: string): void {
    this.sessionService.addMessageToConversation(conversationId, {
      createdBy: 'user',
      text: prompt,
    });
    this.promptRequest(conversationId, prompt);
  }

  private promptRequest(conversationId: ConversationId, prompt: string): void {
    this.sessionService.setBusy(conversationId, true);
    this.httpClient
      .post('http://localhost:3000/ask', { question: prompt, threadId: conversationId })
      .pipe(
        tap((response) => {
          this.sessionService.addMessageToConversation(conversationId, {
            createdBy: 'ai',
            text: (response as any).answer,
          });
        }),
        finalize(() => {
          this.sessionService.setBusy(conversationId, false);
        }),
      )
      .subscribe();
  }
}

import { Component, DestroyRef, inject, input } from '@angular/core';
import { ConversationId, Message } from '../../../../types/conversation.type';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, filter, mergeMap } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { NgClass } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-conversation-history',
  imports: [NgClass, MarkdownComponent],
  templateUrl: './conversation-history.component.html',
  styleUrl: './conversation-history.component.scss',
})
export class ConversationHistoryComponent {
  public conversationId = input.required<ConversationId>();
  private sessionService = inject(SessionService);
  protected messageList: Message[] = [];
  protected displayLoading: boolean = false;

  constructor(destroyRef: DestroyRef) {
    toObservable(this.conversationId)
      .pipe(
        filter((id): id is ConversationId => id !== null),
        mergeMap((conversationId) =>
          combineLatest([this.sessionService.getConversation$(conversationId), this.sessionService.isBusy(conversationId)])) ,
        takeUntilDestroyed(destroyRef),
      )
      .subscribe(([conversation, isBusy]) => {
        this.messageList = conversation!.messageList;
        this.displayLoading = isBusy;
      });
  }
}

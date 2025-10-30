import { Injectable } from '@angular/core';
import { Conversation, ConversationId, Message } from '../types/conversation.type';
import { replaceAt } from '../utils/array.helper';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

const CONVERSATION_SESSION_LOCAL_STORAGE_KEY = 'CONVERSATION_SESSION_LOCAL_STORAGE_KEY';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private conversationState: BehaviorSubject<Conversation[]>;
  private busyConversationIsList: BehaviorSubject<Set<ConversationId>>;

  constructor() {
    this.conversationState = new BehaviorSubject<Conversation[]>(this.getAllConversations());
    this.busyConversationIsList = new BehaviorSubject<Set<ConversationId>>(new Set());
  }

  public getAllConversations(): Conversation[] {
    const localStorageItem = localStorage.getItem(CONVERSATION_SESSION_LOCAL_STORAGE_KEY);
    return localStorageItem ? (JSON.parse(localStorageItem) as Conversation[]) : [];
  }

  public getConversation(conversationId: ConversationId): Conversation | undefined {
    return this.getAllConversations().find((c) => c.id === conversationId);
  }

  public getConversation$(conversationId: ConversationId): Observable<Conversation | null> {
    return this.conversationState.pipe(
      map((conversation) => conversation.find((c) => c.id === conversationId) ?? null),
      distinctUntilChanged(),
    );
  }

  public setBusy(conversationId: ConversationId, isBusy: boolean): void {
    const currentBusySet = this.busyConversationIsList.getValue();
    const updatedBusySet = new Set(currentBusySet);
    if (isBusy) {
      updatedBusySet.add(conversationId);
    } else {
      updatedBusySet.delete(conversationId);
    }
    this.busyConversationIsList.next(updatedBusySet);
  }

  public isBusy(conversationId: ConversationId): Observable<boolean> {
    return this.busyConversationIsList.pipe(
      map((busyIdList) => busyIdList.has(conversationId)),
      distinctUntilChanged(),
    );
  }

  public createOrUpdateConversation(conversation: Conversation): void {
    const allConversations = this.getAllConversations();
    const existingIndex = allConversations.findIndex((c) => c.id === conversation.id);
    const updatedConversationList =
      existingIndex === -1
        ? [...allConversations, conversation]
        : replaceAt(allConversations, existingIndex, conversation);
    localStorage.setItem(
      CONVERSATION_SESSION_LOCAL_STORAGE_KEY,
      JSON.stringify(updatedConversationList),
    );
    this.conversationState.next(updatedConversationList);
  }

  public addMessageToConversation(id: ConversationId, message: Message) {
    const conversation = this.getConversation(id);
    if (!conversation) {
      throw new Error(`Conversation with id ${id} not found`);
    }
    const updatedConversation: Conversation = {
      ...conversation,
      messageList: [...conversation.messageList, message],
    };
    this.createOrUpdateConversation(updatedConversation);
  }
}

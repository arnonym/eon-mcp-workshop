import { Branded } from './branded.type';

export type Message = {
  createdBy: 'user';
  text: string;
} | {
  createdBy: 'ai';
  text: string;
}

export type ConversationId = Branded<string, 'ConversationId'>;
export const asConversationId = (id: string): ConversationId => id as ConversationId;

export interface Conversation {
  id: ConversationId;
  title: string;
  messageList: Message[];
}

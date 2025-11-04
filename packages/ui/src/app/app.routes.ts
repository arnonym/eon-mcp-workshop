import { Routes } from '@angular/router';
import { ConversationViewComponent } from './views/conversation/conversation-view.component';
import { NewConversationViewComponent } from './views/new-conversation/new-conversation-view.component';

export const routes: Routes = [
  { path: '', component: NewConversationViewComponent },
  { path: ':conversationId', component: ConversationViewComponent },
];

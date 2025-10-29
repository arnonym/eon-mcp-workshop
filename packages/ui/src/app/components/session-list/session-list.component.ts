import { Component, inject } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-session-list',
  imports: [RouterLink],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.scss',
})
export class SessionListComponent {
  protected sessionService = inject(SessionService);
}

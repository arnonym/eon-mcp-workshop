import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prompt-input',
  imports: [FormsModule],
  templateUrl: './prompt-input.html',
  styleUrl: './prompt-input.scss'
})
export class PromptInput {
  @Output() onPromptSubmit = new EventEmitter<string>();
  // value: string;
  protected inputValue: string = '';

  protected handleInputEnter() {
    if (this.inputValue.length > 0) {
      this.onPromptSubmit.emit(this.inputValue);
      this.inputValue = '';
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();

  constructor() {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (this.game.stack.length > 0) {
      if (!this.pickCardAnimation) {
        this.currentCard = this.game.stack.pop()!;
        this.pickCardAnimation = true;

        setTimeout(() => (this.pickCardAnimation = false), 1500);
      }
    }
  }
}

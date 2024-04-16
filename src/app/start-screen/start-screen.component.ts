import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection, doc } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { log } from 'console';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);
  game: Game = new Game();

  constructor(private router: Router) {}

  newGame() {
    // Start game
    let game = new Game();
    console.log('Game:', this.game);
    const gameData = this.game.toJson();
    addDoc(collection(this.firestore, 'games'), gameData).then(
      (gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      }
    );
  }
}

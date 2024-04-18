import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection, doc } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { FirebaseService } from '../firebase-service/firebase.service';

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

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  newGame() {
    let game = new Game();
    this.firebaseService.addDoc(game).then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }
}

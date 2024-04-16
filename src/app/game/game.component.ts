import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, addDoc, collection, doc } from '@angular/fire/firestore';
import { FirebaseService } from '../firebase-service/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { onSnapshot } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/app-check';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    DialogAddPlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  firestore: Firestore = inject(Firestore);
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();
  unsubGameDescription: any;

  constructor(
    public dialog: MatDialog,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.unsubGameDescription = this.gameDescription();
  }

  gameDescription() {
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      this.unsubGameDescription = onSnapshot(
        doc(collection(this.firestore, 'games'), gameId),
        (snapshot) => {
          console.log('Game update onSnapshot:', snapshot.data());
          const game = snapshot.data();
          if (game) {
            this.game.currentPlayer = game['currentPlayer'];
            this.game.playedCards = game['playedCards'];
            this.game.players = game['players'];
            this.game.stack = game['stack'];
          }
        }
      );
    });
  }

  ngOnDestroy() {
    if (this.unsubGameDescription) {
      this.unsubGameDescription.unsubscribe();
    }
  }

  newGame() {
    this.game = new Game();
    // console.log('Game:', this.game);
    // const gameData = this.game.toJson();
    // addDoc(collection(this.firestore, 'games'), gameData);
  }

  takeCard() {
    if (this.game.stack.length > 0) {
      if (!this.pickCardAnimation) {
        this.currentCard = this.game.stack.pop()!;
        this.pickCardAnimation = true;

        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;

        setTimeout(() => {
          this.game.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }, 1000);
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}

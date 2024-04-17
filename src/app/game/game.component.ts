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
import { onSnapshot, updateDoc } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/app-check';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    PlayerMobileComponent,
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
  game: Game = new Game();
  unsubGameDescription: any;
  gameId!: string;

  constructor(
    public dialog: MatDialog,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.unsubGameDescription = this.gameDescription();
  }

  gameDescription() {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.unsubGameDescription = onSnapshot(
        doc(collection(this.firestore, 'games'), this.gameId),
        (snapshot) => {
          const game = snapshot.data();
          if (game) {
            this.game.currentPlayer = game['currentPlayer'];
            this.game.playedCards = game['playedCards'];
            this.game.players = game['players'];
            this.game.player_images = game['player_images'];
            this.game.stack = game['stack'];
            this.game.pickCardAnimation = game['pickCardAnimation'];
            this.game.currentCard = game['currentCard'];
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
  }

  takeCard() {
    if (this.game.stack.length > 0) {
      if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop()!;
        this.game.pickCardAnimation = true;
        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;

        this.saveGame();

        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }, 1000);
      }
    }
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Received change:', change);
      this.game.player_images[playerId] = change;
      this.saveGame();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('man.png');
        this.saveGame();
      }
    });
  }

  saveGame() {
    // const gameId = params['id'];
    updateDoc(
      doc(collection(this.firestore, 'games'), this.gameId),
      this.game.toJson()
    );
  }
}

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
import { ActivatedRoute } from '@angular/router';
import { onSnapshot, updateDoc } from 'firebase/firestore';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { FirebaseService } from '../firebase-service/firebase.service';

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
  game: Game = new Game();
  unsubGameDescription: any;
  gameId!: string;
  gameOver = false;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.unsubGameDescription = this.gameDescription();
  }

  gameDescription() {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.unsubGameDescription = onSnapshot(
        this.firebaseService.getSingleDocRef('games', this.gameId),
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
      this.gameOver = false;
      if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop()!;
        this.game.pickCardAnimation = true;
        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;

        this.firebaseService.saveGame(this.game, this.gameId);

        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.firebaseService.saveGame(this.game, this.gameId);
        }, 1000);
      }
    } else {
      this.gameOver = true;
    }
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Received change:', change);
      if (change) {
        if (change == 'DELETE') {
          this.game.player_images.splice(playerId, 1);
          this.game.players.splice(playerId, 1);
        } else {
          this.game.player_images[playerId] = change;
        }
        this.firebaseService.saveGame(this.game, this.gameId);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('man.png');
        this.firebaseService.saveGame(this.game, this.gameId);
      }
    });
  }
}

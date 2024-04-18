import { Injectable, OnInit, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
} from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnInit {
  game: Game[] = [];
  gameId!: string;

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}

  saveGame(game: Game, gameId: string) {
    let docRef = this.getSingleDocRef('games', gameId);
    updateDoc(docRef, this.toJson(game));
  }

  toJson(game: Game) {
    return {
      players: game.players,
      player_images: game.player_images,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer,
      pickCardAnimation: game.pickCardAnimation,
      currentCard: game.currentCard,
    };
  }

  addDoc(game: Game) {
    return addDoc(collection(this.firestore, 'games'), this.toJson(game));
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}

import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Injectable({
  providedIn: 'root',
})
export class FirebaseServicesService implements OnInit {
  game: Game[] = [];

  firestore: Firestore = inject(Firestore);

  constructor() {}

  ngOnInit(): void {
    this.firestore
      .collection('games')
      .valueChanges()
      .subscribe((game = this.game) => console.log('Game update:', game));
    // console.log('FirebaseServicesService');
    // this.getGamesRef();
  }

  // someFunction() {
  //   this.firestore.collection(this.firestore, 'games')
  //     .valueChanges()
  //     .subscribe((game) => console.log('Game update:', game));
  // }

  getGamesRef() {
    console.log(this.game);
    return collection(this.firestore, 'games');
  }
}

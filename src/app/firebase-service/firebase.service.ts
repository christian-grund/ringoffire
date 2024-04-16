import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnInit {
  game: Game[] = [];

  firestore: Firestore = inject(Firestore);

  constructor() {}

  ngOnInit(): void {
    // addDoc(collection(this.firestore, 'games'), { Hallo: 'Welt' });
    // collection(this.firestore, 'games');
    // this.firestore
    // collection(this.firestore, 'games')
    // .valueChanges()
    // .subscribe((game = this.game) => console.log('Game update:', game));
  }

  addDoc() {
    console.log('FirebaseService addDoc');
    addDoc(collection(this.firestore, 'games'), { Hallo: 'Welt' });
  }
}

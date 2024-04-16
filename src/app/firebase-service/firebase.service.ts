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

  ngOnInit(): void {}

  addDoc() {
    // addDoc(collection(this.firestore, 'games'), { Hallo: 'Welt' });
  }
}

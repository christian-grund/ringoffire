import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss',
})
export class EditPlayerComponent {
  allProfilePictures = [
    'man.png',
    'woman.png',
    'pinguin.svg',
    'serious-woman.svg',
    'winkboy.svg',
  ];

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}
}

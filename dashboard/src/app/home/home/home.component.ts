import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1s ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  showMessage: boolean = true;
  showButton: boolean = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showMessage = false;
      this.showButton = true;
    }, 3000); // Afficher le bouton après 3 secondes
  }

  openLogin() {
    this.dialog.open(LoginComponent, {
      width: '30%'
    });
  }
}

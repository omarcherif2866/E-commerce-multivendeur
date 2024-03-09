import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Models/user';
import { AuthService } from 'src/app/Service/Auth/auth.service';

@Component({
  selector: 'app-sidbar',
  templateUrl: './sidbar.component.html',
  styleUrls: ['./sidbar.component.css']
})
export class SidbarComponent implements OnInit {
  vendorId: any;
  user: User = {} as User;
  errorMessage: string = '';

  constructor(
    public authService: AuthService,

  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('user_id');
    this.vendorId= id;
    this.getUserById();

  }


  getUserById(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.authService.getUserProfile(userId).subscribe(
        (user: any) => {
          if (user) {
            this.user = user;

          }
        },
        (error) => {
          console.error('Error fetching user profile:', error);
          this.errorMessage = 'Failed to fetch user profile';
        }
      );
    } else {
      console.error('User ID not found in localStorage.');
      this.errorMessage = 'User ID not found';
    }
  }
}

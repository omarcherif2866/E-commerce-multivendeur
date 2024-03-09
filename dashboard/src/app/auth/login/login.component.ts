import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ServiceService } from 'src/app/service/service.service';
import { AuthService } from 'src/app/service/auth.service';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  role: Role[] = [];

  userForm!: FormGroup

  user!:User

  constructor(private formBuilder:FormBuilder,
     private dialog:MatDialog,
     private service: ServiceService,
     private router: Router,
     private serviceAuth: AuthService,
      ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      email : ['', Validators.required],
      password : ['', Validators.required],

    })

    this.getRoles()

  }



  signin() {
    const t = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    };

    this.service.signIn(t).subscribe(
      (data) => {
        this.user = data;
        localStorage.setItem('user_id', data._id); // Store user ID
        console.log('User ID:', data._id);
        console.log('User ID stored in localStorage:', localStorage.getItem('user_id'));
        console.log('User Roles:', this.user.roles);

        this.serviceAuth.setLoggedIn(true);

        if (this.serviceAuth.isLoggedIn()) {
          console.log('User is logged in');

          if (this.user.roles === 'vendeur') {
            this.router.navigate([`listproduct/${localStorage.getItem('user_id')}`]);
          } {
            console.log('Unknown role');
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }







  getRoles() {
    this.serviceAuth.getRoles().subscribe(
      (role: Role[]) => {
        this.role = role;
        console.log(role)
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


}

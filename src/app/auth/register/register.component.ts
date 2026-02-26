import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/Models/role';
import { AuthService } from 'src/app/Service/Auth/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  role: Role[] = [];

selectedFile: File | null = null;

  form!: FormGroup;

  submitted = false;
  constructor(
    private service: AuthService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      roles: ['', [Validators.required]],
      // recaptcha: ['', Validators.required],
      // image: [null, [Validators.required]], // Change to accept file input
      email: [null, [Validators.required, Validators.email]],
    });

    this.getRoles();

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  sendEmail(): void {

  }


  submit() {
    if (this.form.valid) {
      if (this.form.value.password) {
        const formData = new FormData();
        formData.append('username', this.form.value.username);
        formData.append('email', this.form.value.email);
        formData.append('password', this.form.value.password);
        formData.append('roles', this.form.value.roles);
        if (this.selectedFile) {
          formData.append('image', this.selectedFile);
        }
        console.log('Selected role:', this.form.value.roles); // Debugging: Log selected role
        console.log('Selected image:', this.selectedFile); // Debugging: Log selected image


        this.service.createAcount(formData) // Assurez-vous que le nom de la méthode est correct
          .subscribe(
            res => {
              this.toastr.success('Inscription avec succés');

              // this.toastr.success('inscription avec succés', 'success', {
              //   timeOut: 7000,
              //   progressAnimation: 'increasing',
              //   positionClass: 'toast-top-right',
              // });
  
              this.router.navigate(['/login']);
            },
            (error) => {
              console.log(error);
              if (error.status === 302) {
                this.toastr.error('Email deja existe');
              }
            }
          );
          this.sendEmail();
      } else {
        this.toastr.error('Confirm password');
      }
    }
  }

  siteKey:string ="6Ld8HIYjAAAAALw437G-L_PF1PNrNZH4Qq76MvSU";

  getRoles() {
    this.service.getRoles().subscribe(
      (roles: Role[]) => {
        console.log('Roles retrieved:', roles);
        this.role = roles; // Assign roles here once they're available
      },
      (error: any) => {
        console.error('Error retrieving roles:', error);
      }
    );
  }
  
  

  onFileSelected(event: any) {
  if (event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
  }
  }

}


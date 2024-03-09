import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/Auth/auth.service';

@Component({
  selector: 'app-changermotdepasee',
  templateUrl: './changermotdepasee.component.html',
  styleUrls: ['./changermotdepasee.component.css'],
})
export class ChangermotdepaseeComponent implements OnInit {

  @ViewChild('inputpassword') inputpassword!: ElementRef;
  @ViewChild('inputneuveaupassword') inputneuveaupassword!: ElementRef;
  @ViewChild('inputconfirmerpassword') inputconfirmerpassword!: ElementRef;

  idUser: any;
  bb: FormGroup;

  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.bb = this.formBuilder.group({
      password: ['', Validators.required],
      newpassword: ['', Validators.required],
      confirmpassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = localStorage.getItem('user_id');
    this.idUser = id;
  }

  submit(): void {
    this.submitted = true;

    if (this.bb.invalid) {
      return;
    }

    const password = this.bb.get('password')!.value;
    const newpassword = this.bb.get('newpassword')!.value;
    const confirmpassword = this.bb.get('confirmpassword')!.value;

    if (newpassword !== confirmpassword) {
      this.toastr.error('Password does not match');
      return;
    }

    this.authService.updateUserPassword(this.idUser, password, newpassword).subscribe(
      (res: any) => {
        if (res.status == 'success') {
          this.toastr.success('Password changed successfully');
          this.router.navigate(['/profileClient/:id']);
        } else if (res.status == 'error') {
          this.toastr.error('User not found');
        } else if (res.status == 400) {
          this.toastr.error('Wrong password');
        }
      },
      (err) => {
        this.toastr.error(err.error.message);
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.bb.controls;
  }
}

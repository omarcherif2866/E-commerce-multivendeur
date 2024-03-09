import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Service/Auth/auth.service';
import { User } from 'src/app/Models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // Définir la référence de vue

  @Input() fullWidthMode = false;
  idUser: any;

  imageUrl: string | ArrayBuffer | null = null;

  user: User = {} as User;
  ProfileForm!: FormGroup;
  PasswordForm! : FormGroup;
  errorMessage: string = '';

  submitted = false;

  public Toggledata = false;
  public Toggle = false;


  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  get f() { return this.ProfileForm.controls; }
  iconLogle() {
    this.Toggledata = !this.Toggledata;
   
   }
  
  icon(){
    this.Toggle = !this.Toggle;
  }



  ngOnInit(): void {
    const id = localStorage.getItem('user_id');
    this.idUser= id;
     this.initProfileForm();
     this.getUserById();

   }


  initProfileForm(): void {
    this.ProfileForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      image: ['']
    });
  }

  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
      console.log(file.name, file.type, file.size);

    }else {
      console.log("No file selected");
    }

  }
  
  

  onSubmit() {
    this.submitted = true;
  
    // Stop here if form is invalid
    if (this.ProfileForm.invalid) {
      return;
    }
  
    const id = localStorage.getItem('user_id');
    if (id !== null) {
      const formData = new FormData();
      formData.append('username', this.ProfileForm.value.username);
      formData.append('email', this.ProfileForm.value.email);
      
      // Ajoutez l'image au formData seulement si elle est sélectionnée
      const fileInput = this.fileInput.nativeElement;
      if (fileInput.files && fileInput.files[0]) {
        formData.append('image', fileInput.files[0]); // Ajoutez le fichier image réel
      }
  
      this.authService.updateUserProfile(id, formData).subscribe(
        (updatedUser) => {
          if (updatedUser ) {
            // Mise à jour de l'utilisateur local avec les données mises à jour
            this.user = updatedUser;
            // Affichez les informations de l'utilisateur mis à jour dans la console
            console.log('Profil utilisateur mis à jour avec succès:', updatedUser);
            // Affichez un message de réussite à l'utilisateur
            this.imageUrl = this.getProfileImageUrl(updatedUser.image);
            this.toastr.success('Mise à jour réussie');
          } else {
            // Affichez un message d'erreur si les données de l'utilisateur ne sont pas correctes
            this.toastr.error('Données utilisateur incorrectes');
          }
        },
        (error) => {
          // Affichez un message d'erreur si la mise à jour a échoué
          this.toastr.error('Erreur lors de la mise à jour du profil utilisateur');
          console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
        }
      );
  
    } else {
      // Handle the case when 'id' is not found in localStorage
      this.toastr.error('Utilisateur non-trouvé');
      console.error("ID not found in localStorage.");
    }
  }
  
  
  

  getUserById(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.authService.getUserProfile(userId).subscribe(
        (user: any) => {
          if (user) {
            this.user = user;
            this.ProfileForm.patchValue({
              username: user.username,
              email: user.email,
              image: user.image
            });
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



  getProfileImageUrl(images: string): string {
    return `http://localhost:9090/img/${images}`;
  }


  


}





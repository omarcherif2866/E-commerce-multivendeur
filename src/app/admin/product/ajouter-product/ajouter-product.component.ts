import { Component, OnInit, ElementRef, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Validations from './utils/validations';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Attribute, Product } from 'src/app/Models/product';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/Models/category';
import { ProductService } from 'src/app/Service/Product/product.service';
import { CategoryService } from 'src/app/Service/category/category.service';
@Component({
  selector: 'app-ajouter-product',
  templateUrl: './ajouter-product.component.html',
  styleUrls: ['./ajouter-product.component.css'],
})
export class AjouterProductComponent {
  category: Category[] = [];
  selectedCategoryId: string | null = null;
  selectedCategoryAttributes: any[] = [];
  product: Product | null = null;
  attributesFormArray!: FormArray;
  productForm!: FormGroup;
  data: any;
  sizeOptions = ['S', 'XS', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  colorOptions = ['noir', 'rouge', 'bleu', 'jaune'];
  ageRangeOptions = ['nouveau né', 'enfant', 'adulte'];  
  numberRangeOptions = ['30', '32', '34', '36', '38', '40', '42']; 
  // Déclarez une variable pour contrôler l'affichage des nouveaux attributs
  showAdditionalAttributes: boolean = false; // Variable pour contrôler l'affichage des attributs supplémentaires
  selectedAttribute: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private service: ProductService,
    private serviceCategory: CategoryService,
    private route: ActivatedRoute,
    @Inject('data') data: any,  ) {
      this.data = data;

    }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      image: [''],
      description: ['', Validators.required],
      attributeSets: this.formBuilder.array([]),
    });
  
    this.attributesFormArray = this.productForm.get('attributeSets') as FormArray;
  
    this.productForm.get('category')?.valueChanges.subscribe((categoryId) => {
      if (categoryId) {
        this.loadCategoryAttributes(categoryId);
      }
    });
  
    if (this.data && this.data.category) {
      this.product = this.data;
      this.productForm.patchValue(this.data);
      this.loadCategoryAttributes(this.product?.category._id); // Utilisez la propriété appropriée de la classe Category
    }

    this.getCategories();
  }
  

  onAttributeValueChange(index: number) {
    const attributeValue = this.attributesFormArray.at(index).get('value')?.value;
    if (attributeValue === 'S-M-L' || attributeValue === 'par age' || attributeValue === 'par numero') {
      this.selectedAttribute = attributeValue; // Mettre à jour l'attribut sélectionné
    } else {
      this.selectedAttribute = ''; // Réinitialiser si l'option n'est pas valide
    }
  }

  loadCategoryAttributes(categoryId: string) {
    console.log("Chargement des attributs pour la catégorie :", categoryId);

    this.service.getAttributesByCategory(categoryId).subscribe(
      (newAttributes: any[]) => {
        this.attributesFormArray.clear(); // Effacez les attributs existants
        newAttributes.forEach((newAttr) => {
          const attributeGroup = this.formBuilder.group({
            name: [newAttr],
            value: ['']
          });
          this.attributesFormArray.push(attributeGroup);
  
          // Si l'attribut est 'size', ajoutez une propriété supplémentaire pour gérer la deuxième liste déroulante
          if (newAttr.name === 'size') {
            attributeGroup.addControl('secondList', this.formBuilder.control(''));
          }
        });
      },
      (error: any) => {
        console.error("Error loading category attributes:", error);
      }
    );
  }
  

  onFormSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.value.name);
      formData.append('category', this.productForm.value.category);
      formData.append('price', this.productForm.value.price);

      formData.append('description', this.productForm.value.description);
  
      if (this.productForm.value.image instanceof File) {
        formData.append('image', this.productForm.value.image);
      }
  
      const attributeFields = this.productForm.get('attributeSets') as FormArray;
      const attributeSets: Attribute[] = attributeFields.value.map((attribute: Attribute) => {
        return { name: attribute.name, value: attribute.value };
      }); 
      // Utilisez JSON.stringify pour convertir attributeSets en une chaîne JSON
      formData.append('attributeSets', JSON.stringify(attributeSets));
  
        this.service.addProduct(formData, localStorage.getItem('user_id')).subscribe({
          next: (val: any) => {
            // this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error("Error submitting the form:", err);
          },
        });
      
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.productForm.get('image')?.setValue(file);
  }
  
  addAttributeGroup() {
    const attributesArray = this.productForm.get('attributeSets') as FormArray;
    const newAttributeGroup = this.formBuilder.group({
      name: [''],
      value: [''],
    });
    attributesArray.push(newAttributeGroup);
  }
  
  
  removeAttributeGroup(index: number) {
    if (index >= 0) {
      const attributesArray = this.productForm.get('attributeSets') as FormArray;
      attributesArray.removeAt(index);
    }
  }
  
  getCategories() {
    this.serviceCategory.getAllCategories().subscribe(
      (category: Category[]) => {
        this.category = category;
      },
      (error: any) => {
        console.error("Error loading categories:", error);
      }
    );
  }

  onCategorySelected(event: any) {
    const categoryId = event.value;
    this.loadCategoryAttributes(categoryId);
  }
  

  
  


  isSizeAttribute(index: number): boolean {
    return this.productForm.get('attributeSets.' + index + '.name')?.value === 'size';
  }
  
  isColorAttribute(index: number): boolean {
    return this.productForm.get('attributeSets.' + index + '.name')?.value === 'color';
  }
  
  isGenderAttribute(index: number): boolean {
    return this.productForm.get('attributeSets.' + index + '.name')?.value === 'gender';
  }



// Implémentez la méthode pour charger les attributs pour un sous-produit
// loadAttributesForSubProduct() {
//   const categoryId = this.productForm.get('category')?.value;
//   if (categoryId) {
//     this.loadCategoryAttributes(categoryId);
//     this.showAdditionalAttributes = true; // Activer l'affichage des nouveaux attributs
//   }
// }

// // Implémentez la méthode onAddSubProduct
// onAddSubProduct() {
//   console.log("Ajouter field sous produit cliqué");
//   this.loadAttributesForSubProduct();
// }

loadAttributesForSubProduct() {
  const categoryId = this.productForm.get('category')?.value;
  if (categoryId) {
    this.loadCategoryAttributes(categoryId);
    this.showAdditionalAttributes = true; // Activer l'affichage des nouveaux attributs
    this.cdr.detectChanges(); // Forcer la détection des changements
  }
}

// onAddSubProduct() {
//   console.log("Ajouter field sous produit cliqué");
//   const numberOfGroupsToAdd = 1;

//   const categoryId = this.productForm.get('category')?.value;

//   // Mettre à jour les attributs de la catégorie sélectionnée avant d'ajouter de nouveaux groupes d'attributs
//   this.updateAttributesForCategory(categoryId).then(() => {
//     for (let i = 0; i < numberOfGroupsToAdd; i++) {
//       console.log("le nombre de clique : ",i,"selectedCategoryAttributes: " , this.selectedCategoryAttributes)
//       // Créez un groupe d'attributs pour chaque attribut de la catégorie sélectionnée
//       this.selectedCategoryAttributes.forEach(attr => {
//         const newAttributeGroup = this.formBuilder.group({
//           name: [attr || '', Validators.required], // Utilisez attr directement
//           value: ['', Validators.required],
//         });
//         this.attributesFormArray.push(newAttributeGroup);
//       });
//     }
//   });
// }









onAddSubProduct() {
  console.log("Ajouter field sous produit cliqué");
  const numberOfGroupsToAdd = 1; // Ajoutez un seul groupe d'attributs à chaque clic

  const categoryId = this.productForm.get('category')?.value;

  // Vérifiez si le bloc attributeSets n'a pas encore été ajouté
  if (!this.showAdditionalAttributes) {
    // Mettre à jour les attributs de la catégorie sélectionnée avant d'ajouter de nouveaux groupes d'attributs
    this.updateAttributesForCategory(categoryId).then(() => {
      // Marquer l'affichage du bloc attributeSets comme true
      this.showAdditionalAttributes = true;
    });
  } else {
    // Ajoutez un seul groupe d'attributs à l'intérieur du bloc attributeSets
    for (let i = 0; i < numberOfGroupsToAdd; i++) {
      this.selectedCategoryAttributes.forEach(attr => {
        const newAttributeGroup = this.formBuilder.group({
          name: [attr || '', Validators.required],
          value: ['', Validators.required],
        });
        this.attributesFormArray.push(newAttributeGroup);
      });
    }
  }
}




updateAttributesForCategory(categoryId: string): Promise<void> {
  console.log("Chargement des attributs pour la catégorie :", categoryId);
  return new Promise<void>((resolve, reject) => {
    this.service.getAttributesByCategory(categoryId).subscribe(
      (newAttributes: any[]) => {
        // Mettre à jour les attributs de la catégorie sélectionnée
        this.selectedCategoryAttributes = newAttributes;
        this.showAdditionalAttributes = true;
        this.cdr.detectChanges();
        resolve();
      },
      (error: any) => {
        console.error("Error loading category attributes:", error);
        reject();
      }
    );
  });
}





  
  
}







import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ServiceService } from '../../service/service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { Attribute } from 'src/app/models/product';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  category: Category[] = [];
  selectedCategoryId: string | null = null;
  selectedCategoryAttributes: any[] = [];
  product: Product | null = null;
  attributesFormArray!: FormArray;
  productForm!: FormGroup;
  
  sizeOptions = ['S', 'XS', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  colorOptions = ['noir', 'rouge', 'bleu', 'jaune'];
  ageRangeOptions = ['nouveau né', 'enfant', 'adulte'];  
  numberRangeOptions = ['30', '32', '34', '36', '38', '40', '42']; 

  selectedAttribute: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private service: ServiceService,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

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
  
      if (this.data) {
        this.service.putProduct(this.data._id, formData).subscribe({
          next: (val: any) => {
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      } else {
        this.service.addProduct(formData, localStorage.getItem('user_id')).subscribe({
          next: (val: any) => {
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error("Error submitting the form:", err);
          },
        });
      }
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
    this.service.getAllCategories().subscribe(
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
}





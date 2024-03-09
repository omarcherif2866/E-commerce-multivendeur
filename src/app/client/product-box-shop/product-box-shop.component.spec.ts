import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBoxShopComponent } from './product-box-shop.component';

describe('ProductBoxShopComponent', () => {
  let component: ProductBoxShopComponent;
  let fixture: ComponentFixture<ProductBoxShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBoxShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBoxShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
  selector: 'pm-products',
  templateUrl: 'product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit, OnDestroy {

  pageTitle: string = '';

  arr: any[] = ['imageUrl', 'productName', 'productCode', 'releaseDate', 'price', 'starRating'];

  keyOrder = (a: any, b: any) => {
    return this.arr.indexOf(a.key) !== -1 ? this.arr.indexOf(b.key) !== -1 ?
      this.arr.indexOf(a.key) - this.arr.indexOf(b.key) : -1 : 0;
  };

  imageWidth: number = 50;
  imageMargin: number = 2;

  showImage: boolean = false;

  private _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.performFilter(value);
  }

  filteredProducts: IProduct[] = [];

  products: IProduct[] = [];

  $subscription!: Subscription;

  errorMessage: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.$subscription =
      this.productService.getProducts().subscribe({
        next: products => this.products = this.filteredProducts = products,
        error: err => this.errorMessage = err
      });
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  performFilter(filterBy: string): IProduct[] {
    return this.products.filter((i: IProduct) => i.productName.toLocaleLowerCase().includes(filterBy.toLocaleLowerCase()));
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'Product list' + message;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

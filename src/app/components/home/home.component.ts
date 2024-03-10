import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = '';
  selectedCategoryId: number = 0;
  visiblePages: number[] = [5];
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router:Router
  ) {}
  ngOnInit(){
    this.getProduct(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    this.getCategories(1, 100);
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategory(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger;
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('there are some errors in categories', error);
      },
    });
  }
  searchProduct() {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.getProduct(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    throw new Error('Method not implemented.');
  }

  getProduct(
    keyword: string,
    selectedCategory: number,
    page: number,
    limit: number
  ) {
    debugger;
    this.productService
      .getProduct(keyword, selectedCategory, page, limit)
      .subscribe({
        next: (response: any) => {
          debugger;
          response.products.forEach((product: Product) => {
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          });
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(
            this.currentPage,
            this.totalPages
          );
        },
        complete: () => {
          debugger;
        },
        error(error: any) {
          debugger;
          console.log('Error watching product:', error);
        },
      });
  }
  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getProduct(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 10;
    const haftVisiblePages = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - haftVisiblePages, 1);

    let endPage = Math.min(startPage + haftVisiblePages - 1, totalPages);
    if (endPage - startPage + 1 < haftVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }
  onClickProduct(productId: number){
  this.router.navigate(['/products', productId]);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiGetAllProduct = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}
  getProduct(
    keyword: string,
    selectedCategoryId: number,
    page: number,
    limit: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('keyword', keyword.toString())
      .set('selectedCategoryId', selectedCategoryId.toString());
    return this.http.get<Product[]>(this.apiGetAllProduct, { params });
  }
  getDetailProduct(productId: number) {
    return this.http.get(`${environment.apiBaseUrl}/products/${productId}`);
  }
  getProductsByIds(productIds: number[]): Observable<Product[]> {
    // Chuyển danh sách ID thành một chuỗi và truyền vào params
    debugger
    const params = new HttpParams().set('ids', productIds.join(',')); 
    return this.http.get<Product[]>(`${this.apiGetAllProduct}/by-ids`, { params });
  }
}

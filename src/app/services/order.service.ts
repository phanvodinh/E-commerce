import { Injectable } from '@angular/core';
import { OrderDTO } from '../dtos/user/order.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
   apiOrder =`${environment.apiBaseUrl}/orders`;
  constructor(private http: HttpClient) {}
  placeOrder(orderData: OrderDTO) {
    
  }
  getOrderById(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.get(url);
  }
}

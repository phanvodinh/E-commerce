import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderDTO } from 'src/app/dtos/user/order.dto';
import { environment } from 'src/app/environments/environment';
import { Product } from 'src/app/model/product';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { TokenService } from 'src/app/services/token.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  orderForm: FormGroup;  //Object FormGroup quản lý data của form
  cartItems: { product: Product; quantity: number }[] = [];
  couponCode: string = '';
  totalAmount: number = 0;
  

  orderData: OrderDTO = {
    user_id: 2,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: []
  };
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private fb:FormBuilder
    
  ) {
    this.orderForm = this.fb.group({
      fullname: ['',Validators.required],
      email: ['', Validators.email],
      phone_number: ['',Validators.required, Validators.minLength(6)],
      address:['', Validators.required, Validators.minLength(5)],
      note:[''],
      payment_method:['cod'],
      shipping_method:['express'],

    })
   }
 
  ngOnInit(): void {
    debugger;
    // if (!this.tokenService.getUserInfoFromToken() ||
    //       this.tokenService.isTokenExpired()) {
    //   this.router.navigate(['/']);
    // }
    // Lấy danh sách sản phẩm từ giỏ hàng
    debugger;
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    debugger;
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        debugger;
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          debugger;
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          debugger;
          return {
            product: product!,
            quantity: cart.get(productId)!,
          };
        });
        console.log('haha');
      },
      complete: () => {
        debugger;
        this.calculateTotal();
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      },
    });
  }
  placeOrder(){
    debugger
    if(this.orderForm.valid){
      // Gán giá trị từ form vào đối tượng orderData
      /*
      this.orderData.fullname = this.orderForm.get('fullname')!.value;
      this.orderData.email = this.orderForm.get('email')!.value;
      this.orderData.phone_number = this.orderForm.get('phone_number')!.value;
      this.orderData.address = this.orderForm.get('address')!.value;
      this.orderData.note = this.orderForm.get('note')!.value;
      this.orderData.shipping_method = this.orderForm.get('shipping_method')!.value;
      this.orderData.payment_method = this.orderForm.get('payment_method')!.value;
      */
      // Sử dụng toán tử spread (...) để sao chép giá trị từ form vào orderData
      // đoạn code dài dòng ở trên = đoạn code ngắn gọn ở dưới
      this.orderData ={
        ...this.orderData,
        ...this.orderForm.value
      }
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
    //   this.orderService.placeOrder(this.orderData).subscribe({
    //     next: (response:Order) => {
    //       debugger;          
    //       console.log('Đặt hàng thành công');
    //       this.router.navigate(['/orders/', response.id]);
    //     },
    //     complete: () => {
    //       debugger;
    //       this.calculateTotal();
    //     },
    //     error: (error: any) => {
    //       debugger;
    //       console.error('Lỗi khi đặt hàng:', error);
    //     },
    //   });
    // } else {
    //   // Hiển thị thông báo lỗi hoặc xử lý khác
    //   alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    // }        
    }
  }
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}

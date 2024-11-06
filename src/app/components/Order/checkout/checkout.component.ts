import { memberInfo } from './../../../interface/Order/memberInfo';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { LocalstorageService } from 'src/app/service/Order/localstorage.service';
import { cartItem } from 'src/app/interface/Order/cartItem';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  cartItems: cartItem[] = []
  quantity = 1
  totalAmount = 0
  discount = 100
  memberName: String = '';
  phone: String = '';
  email: String = '';

  constructor(private router: Router,
    private localstorageService: LocalstorageService) {
  }

  ngOnInit(): void {
    this.cartItems = this.localstorageService.getCartItems();
    this.calculateTotal();

    this.localstorageService.getMemberInfo().subscribe(
      (response) => {
        // this.memberId = JSON.stringify(response.loginmember.memberId);
        this.memberName = response.loginmember.chineseName;

        // 去除phone前後的"
        this.phone = JSON.stringify(response.loginmember.phone);
        if(this.phone.substring(0,1)=='"'){
          this.phone = this.phone.substring(1,this.phone.length);
        }
        if(this.phone.substring(this.phone.length-1)=='"'){
          this.phone = this.phone.substring(0,this.phone.length-1);
        }

        // 去除email前後的"
        this.email = JSON.stringify(response.loginmember.email);
        if(this.email.substring(0,1)=='"'){
          this.email = this.email.substring(1,this.email.length);
        }
        if(this.email.substring(this.email.length-1)=='"'){
          this.email = this.email.substring(0,this.email.length-1);
        }
      },
      (error) => {
        console.error('獲取會員資訊失敗', error);
        alert('獲取會員資訊失敗，重新登入');
      }
    );
  }

  calculateTotal(){
    this.totalAmount = this.cartItems.reduce((total, item)=>{
    return total + (item.price * item.quantity);
  },0);
  }

  removeCartItemAll(){
    this.localstorageService.removeCart();      // 清除localStorage中key為cart的資料
  }                                             // 使用時機為訂單成立存入資料庫後即清除


  goToConfirmation() {
    this.router.navigate(['orderconfirmation']);
  }

  goToCart() {
    this.router.navigate(['cart']);
  }

}

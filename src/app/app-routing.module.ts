import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItineraryListComponent } from './components/product/itinerary-list/itinerary-list.component';
import { ItineraryDetailComponent } from './components/product/itinerary-detail/itinerary-detail.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DetailComponent } from './components/Shipment/detail/detail.component';
import { TicketComponent } from './components/Shipment/ticket/ticket.component';
import { CartComponent } from './components/Order/cart/cart.component';
import { CheckoutComponent } from './components/Order/checkout/checkout.component';
import { OrderConfirmationComponent } from './components/Order/order-confirmation/order-confirmation.component';
import{BlogListComponent} from'./components/Blog/blog-list/blog-list.component';
import { SigninComponent } from './components/Member/signin/signin.component';
import { SignupComponent } from './components/Member/signup/signup.component';
import { ForgetpasswordComponent } from './components/Member/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/Member/resetpassword/resetpassword.component';
import { AccountComponent } from './components/Member/account/account.component';
import { MycollectionComponent } from './components/Member/mycollection/mycollection.component';
import { MyorderComponent } from './components/Member/myorder/myorder.component';
import { MemberorderdetailComponent } from './components/Member/memberorderdetail/memberorderdetail.component';
import { CouponComponent } from './components/Member/coupon/coupon.component';
import { MemberareaComponent } from './components/Member/memberarea/memberarea.component';
import { BlogDetailComponent } from './components/Blog/blog-detail/blog-detail.component';
import{BlogWriteComponent} from'./components/Blog/blog-write/blog-write.component';
import { CertificationSuccessComponent } from './components/Member/certification-success/certification-success.component';
import { ScheduleDetailComponent } from './components/Shipment/schedule-detail/schedule-detail.component';
import { Cart2Component } from './components/Shipment/cart2/cart2.component';
const routes: Routes = [
   {
    path: 'login',
    children:[
      {
        path:'signin',
        component: SigninComponent
      },
      {
        path:'signup',
        component: SignupComponent
      },
      {
        path:'certificationsuccess',
        component: CertificationSuccessComponent
      },
      {
        path:'forgetpassword',
        component: ForgetpasswordComponent
      },
      {
        path:'resetpassword',
        component: ResetpasswordComponent
      },

    ]
   },
   {
    path: 'member',
    component: MemberareaComponent
   },

   {
    path: 'itinerary-list',
    children:[
      {
        path:'',
        component: ItineraryListComponent
      },
      {
        path:'area',
        component: ItineraryListComponent
      },
      {
        path:'area_:region',
        component: ItineraryListComponent
      },
      {
        path:'theme',
        component: ItineraryListComponent
      },

    ]
   },
  { path: 'itinerary-detail/:id', component: ItineraryDetailComponent },
  { path: 'itineraries/theme/:themeId', component: ItineraryListComponent },
  { path: 'itineraries/activity/:activityId', component: ItineraryListComponent },
  { path: 'theme_activity/:id', component: ItineraryListComponent },

  // { path: 'shipment-detail', component: DetailComponent },
  { path: 'shipment-ticket', component: TicketComponent },
  { path: 'shipment-detail/:routeId', component: DetailComponent },
  { path: 'schedule/:scheduleId', component: ScheduleDetailComponent },
  { path: 'cart2', component: Cart2Component },


  { path: 'cart', component:CartComponent },
  { path: 'checkout', component:CheckoutComponent },
  { path: 'orderconfirmation', component:OrderConfirmationComponent },

  { path:'blog-list',component:BlogListComponent},

  { path:'blog-write',component:BlogWriteComponent},

  { path: 'blog-detail/:id', component: BlogDetailComponent },
  { path: '**', component:HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

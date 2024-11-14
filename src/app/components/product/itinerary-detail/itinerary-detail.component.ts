import { LocalstorageService } from 'src/app/service/Order/localstorage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItineraryDetail } from 'src/app/interface/Product/itinerary-detail.interface';
import { ItineraryList } from 'src/app/interface/Product/itinerary-list.interface';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { startOfDay, isSameDay, addMonths, subMonths } from 'date-fns';
import { ItineraryService } from 'src/app/service/Itinerary/itinerary.service';
import { cartItem } from 'src/app/interface/Order/cartItem';
import Swal from 'sweetalert2';
import { MyareaService } from 'src/app/service/Member/myarea.service';
import { theme_Activity } from 'src/app/interface/Product/Theme-Activity';


@Component({
  selector: 'app-itinerary-detail',
  templateUrl: './itinerary-detail.component.html',
  styleUrls: ['./itinerary-detail.component.css']
})


export class ItineraryDetailComponent implements OnInit {

  itineraryDetail: ItineraryDetail | null = null;
  tours: ItineraryDetail[] = [];
  relatedTours: ItineraryList[] = [];
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  selectedDay: CalendarMonthViewDay | null = null;
  batchStatus: ItineraryDetail["itineraryBatch"] = [];
  selectedDate: string | null = null;
  selectedDateTimes: string[] = [];
  quantity: number = 1;
  cartItems: cartItem[]=[];
  isActive: boolean = false;
  itineraryDateSystemId: number = 0;

  selectedIndex = 0;
  selectedImage = this.itineraryDetail?.imagePath[0];


  selectImage(index: number) {
    this.selectedIndex = index;
    this.selectedImage = this.itineraryDetail?.imagePath[index];
  }

  constructor(private route: ActivatedRoute, private itineraryService: ItineraryService, private localStorageService: LocalstorageService, private myareaService: MyareaService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const idParam = params['id'];
      if (idParam) {
        const id = parseInt(idParam, 10);
        this.loadItineraryDetail(id);
      }
    });
  }

  loadItineraryDetail(id: number): void {
    this.itineraryService.getItineraryById(id).subscribe(response => {
      this.itineraryDetail = response;
      this.loadRelatedItineraries(this.itineraryDetail.activitySystemId);
      this.initializeDayStatus();

        //=====確認是否為我的最愛===========================================================================
        this.myareaService.Ismyfavorite(this.itineraryDetail?.itinerarySystemId).subscribe(data => {
          if (data.result === 'ismyfavirite') {
            this.isActive = true;
          }
        })
     });
  }

  initializeDayStatus(): void {
    if (!this.itineraryDetail) return;

    this.batchStatus = [];
    this.events = [];

    this.itineraryDetail.itineraryBatch.forEach(itineraryBatch => {
      if (!itineraryBatch.departureDate) return;

        this.batchStatus.push({
          itineraryDateSystemId: itineraryBatch.itineraryDateSystemId,
          departureDate: itineraryBatch.departureDate,
          stock: itineraryBatch.stock || 0
        });

      const event: CalendarEvent = {
        start: new Date(itineraryBatch.departureDate),
        title: new Date(itineraryBatch.departureDate).toLocaleTimeString('zh-TW', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        meta: {
          dateSystemId: itineraryBatch.itineraryDateSystemId,
          hasEvent: true,
          hasStock: itineraryBatch.stock > 0
        }
      };
      this.events.push(event);
    });
  }

  loadRelatedItineraries(activityId: number): void {
    this.itineraryService.getRelatedItineraries(activityId).subscribe({
      next: (data) => {
        this.relatedTours = data
          .filter(item => item.itinerarySystemId !== this.itineraryDetail?.itinerarySystemId)
      },
      error: (error) => {
        console.error('加載相關行程失敗:', error);
      }
    });
  }

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  hasAvailableStock(day: CalendarMonthViewDay): boolean {
    const date = day.date;
    const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
    const batches = this.batchStatus.filter(batch => batch.departureDate.startsWith(dateStr));
    return batches.length > 0 && batches.some(batch => batch.stock > 0);
  }

  onDayClicked(day: CalendarMonthViewDay): void {
    const date = day.date;
    const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
    if (this.hasAvailableStock(day)) {
      if (this.selectedDate === dateStr) {
        this.selectedDate = null;
        this.selectedDateTimes = [];
      } else {
        this.selectedDate = dateStr;
      console.log('dateStr', this.selectedDate);
      const batches = this.batchStatus.filter(batch => batch.departureDate.startsWith(dateStr));
      this.selectedDateTimes = batches.map(batch => new Date(batch.departureDate).toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit'

      }));
      }
    }

  }

  hasTimeSlotStock(time: string): boolean {
    const batches = this.batchStatus.filter(batch => new Date(batch.departureDate).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    }) === time);
    return batches.length > 0 && batches.some(batch => batch.stock > 0);
  }

  getStockForTime(time: string): number {
    const batches = this.batchStatus.filter(batch => new Date(batch.departureDate).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    }) === time);
    return batches.length > 0? batches[0].stock : 0;
  }

  selectedTime: string | null = null;

  isSelectedTime(time: string): boolean {
    return this.selectedTime === time;
  }

  selectDateTime(time: string, batch: any): void {
    const formattedDateTime = this.selectedDate + ' ' + time;
    // 更新界面状态
    this.selectedTime = time;
    this.itineraryDateSystemId = batch.itineraryDateSystemId;
  }

  getBatchForTime(time: string): any {
    const batches = this.batchStatus.filter(batch => new Date(batch.departureDate).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    }) === time);
    return batches.length > 0? batches[0] : null;
  }

  decreaseQuantity(): void {
    this.quantity = Math.max(this.quantity - 1, 1);
  }

  // Method to increase the quantity
  increaseQuantity(): void {
    this.quantity = Math.min(this.quantity + 1, 100);
  }

  // Method to update the quantity manually
  updateQuantity(value: string): void {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      this.quantity = Math.max(Math.min(numericValue, 100), 1);
    } else {
      this.quantity = 1;
    }
  }

 //加入購物車
 addToCart():void{
  if(this.itineraryDateSystemId==0)
  {
    Swal.fire({
      icon: "info",
      title: "請選擇時段",
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }
  const newCartItem:cartItem={
    itineraryDateSystemId: this.itineraryDateSystemId as number,
    ItinerarySystemId:this.itineraryDetail?.itinerarySystemId as number,
    name:(this.itineraryDetail?.itineraryName as string)+' '+this.selectedDate+this.selectedTime,
    price:this.itineraryDetail?.price as number,
    quantity:this.quantity,
    imagePath:this.itineraryDetail?.imagePath[0] as string
  }
  this.localStorageService.addToCart(newCartItem);
  console.log(newCartItem);
 }

 getItineraryDetails():string[]{
  return this.itineraryDetail?.itineraryDetails as string[];
 }


 //mycollection相關======================================================

 mycollection()
 {
  this.isActive = !this.isActive
  if(!this.isActive)
    {
      console.log('行程ID',this.itineraryDetail?.itinerarySystemId);
      this.myareaService.Removemyfavorite(this.itineraryDetail?.itinerarySystemId).subscribe(data=>{
        if(data.result ==='success')
          {
            Swal.fire({
              icon: "success",
              title: "從我的最愛中移除",
              showConfirmButton: false,
              timer: 1000
            })
          }
      })
    }
    else if(this.isActive)
      {
        console.log('行程ID',this.itineraryDetail?.itinerarySystemId)
        this.myareaService.Addtomyfavorite(this.itineraryDetail?.itinerarySystemId).subscribe(data=>{
          if(data.result==='success')
            {
              Swal.fire({
                icon: "success",
                title: "加入我的最愛",
                showConfirmButton: false,
                timer: 1000
              })
            }
        })
      }
 }

}


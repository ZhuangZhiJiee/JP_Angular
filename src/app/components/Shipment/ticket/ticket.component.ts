import { Component, OnInit } from '@angular/core';
import { ShipmentService, Shipment } from '../../../service/Shipment/shipment.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  origins: string[] = ['基隆港', '台中港', '高雄港']; // 靜態出發地列表
  shipments: Shipment[] = [];
  sortedShipments: Shipment[] = [];
  selectedOriginPort: string = '';
  selectedDestinationPort: string = '';
  selectedSortBy: string = 'default';
  isAscending: boolean = true;
  destinations: string[] = []; // 動態目的地選項
  
  // 分頁屬性
  pageNumber: number = 1;
  pageSizeOptions: number[] = [12, 18, 24];
  pageSize: number = 12;
  totalRecords: number = 0;

  constructor(private shipmentService: ShipmentService) {}

  ngOnInit() {
    this.getShipments(); // 初始化時加載所有資料
  }

  getShipments() {
    // 調用服務層方法並加載圖片、分頁、排序和篩選結果
    this.shipmentService.getShipments(this.selectedSortBy, this.selectedOriginPort, this.selectedDestinationPort, this.pageNumber, this.pageSize, this.isAscending)
      .subscribe(response => {
        // 更新加載的 shipments 資料
        this.shipments = response.data;
        this.sortedShipments = response.data;
        this.totalRecords = response.totalRecords;
      });
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageNumber = 1;  // 重置為第一頁
    this.applyFilter();
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.applyFilter();
  }

  applyFilter() {
    this.shipmentService.getShipments(this.selectedSortBy, this.selectedOriginPort, this.selectedDestinationPort, this.pageNumber, this.pageSize, this.isAscending)
      .subscribe(response => {
        this.shipments = response.data;
        this.sortedShipments = response.data;
        this.totalRecords = response.totalRecords;
      });
  }
  
  onOriginPortChange() {
    if (this.selectedOriginPort) {
      this.shipmentService.getShipments('', this.selectedOriginPort, '', 1, this.pageSize, this.isAscending)
        .subscribe(response => {
          const uniqueDestinations = Array.from(new Set(response.data.map(shipment => shipment.destinationPortName)));
          this.destinations = uniqueDestinations;
        });
    } else {
      this.destinations = [];
    }
    // 重置頁碼並應用篩選條件
    this.pageNumber = 1;
    this.applyFilter();
  }

  onSearch() {
    this.applyFilter(); // 確保查詢按鈕點擊後會更新列表
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }
}

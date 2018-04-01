import { Component, OnInit } from '@angular/core';
import { DonDatHangService} from '../../../shared/don-dat-hang.service';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {DateService} from "../../../shared/date.service";


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  donDatHangList;
  donDatHangPaginationObj;

  searchForm = { 'ngay_bat_dau': null, 'ngay_ket_thuc': null};
  constructor(private donDatHangService: DonDatHangService,  private router: Router,
    private dateService: DateService) { }

  ngOnInit() {
    this.onLoadAllData();
  }

  onLoadAllData() {
    this.donDatHangService.getAll().subscribe(res=>{
      if (res) {
        console.log(res); this.donDatHangList = (<any>res).data;
        this.donDatHangPaginationObj = res;
      }
    });
  }

  onSearchData() {
    if (!this.searchForm.ngay_bat_dau&&!this.searchForm.ngay_ket_thuc) { this.onLoadAllData(); return; }
    let startDate = this.dateService.getDateString(this.searchForm.ngay_bat_dau);;
    let endDate = this.dateService.getDateString(this.searchForm.ngay_ket_thuc);;
    this.donDatHangService.filter(startDate, endDate)
    .subscribe(res => {
      if (res) {
        console.log(res); this.donDatHangList = (<any>res).data;
        this.donDatHangPaginationObj = res;
      }
    });
  }
  openOrder(id){
    this.router.navigateByUrl('/dashboard/tao-don-dat-hang?id='+ id.toString());
  }
  goToPageNext(){
    if (this.donDatHangPaginationObj.current_page === this.donDatHangPaginationObj.last_page) return;
    let pageNextUrl = this.donDatHangPaginationObj.next_page_url;
    this.donDatHangService.getPage(pageNextUrl).subscribe(res=>{
      if (res) {
        console.log(res); this.donDatHangList = (<any>res).data;
        this.donDatHangPaginationObj = res;
      }
    });
  }
  goToPagePrev() {
    if (this.donDatHangPaginationObj.current_page === 1)
      return;
    let pagePrevUrl = this.donDatHangPaginationObj.prev_page_url;
    this.donDatHangService.getPage(pagePrevUrl).subscribe(res => {
      if (res) {
        console.log(res); this.donDatHangList = (<any>res).data;
        this.donDatHangPaginationObj = res;
      }
    })
  }
  goToPageLast(){
    if(this.donDatHangPaginationObj.current_page == this.donDatHangPaginationObj.last_page) return;
    let pageLastUrl = this.donDatHangPaginationObj.last_page_url;
    this.donDatHangService.getPage(pageLastUrl).subscribe(res=>{
      if(res){
        console.log(res); this.donDatHangList = (<any>res).data;
        this.donDatHangPaginationObj = res;
      }
    });
  }
  goToPageFirst(){
    if(this.donDatHangPaginationObj.current_page == 1) return;
    let pageFirstUrl = this.donDatHangPaginationObj.first_page_url;
    this.donDatHangService.getPage(pageFirstUrl).subscribe(res=>{
      if(res){
        console.log(res); this.donDatHangList = (<any>res).data;
        this.donDatHangPaginationObj = res;
      }
    });
  }

}

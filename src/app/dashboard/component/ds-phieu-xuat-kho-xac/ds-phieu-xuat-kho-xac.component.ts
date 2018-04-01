import { Component, OnInit } from '@angular/core';
import {KhoService} from '../../../shared/kho.service';
import {ChungTuService} from '../../../shared/chung-tu.service';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {DateService} from "../../../shared/date.service";

@Component({
  selector: 'app-ds-phieu-xuat-kho-xac',
  templateUrl: './ds-phieu-xuat-kho-xac.component.html',
  styleUrls: ['./ds-phieu-xuat-kho-xac.component.scss']
})
export class DsPhieuXuatKhoXacComponent implements OnInit {
  khoXuat;
  chungTuList;
  chungTuPagination;
  searchForm = { 'ngay_bat_dau': null, 'ngay_ket_thuc': null};

  constructor(private khoService: KhoService, private chungTuService: ChungTuService,
     private dateService: DateService, private router: Router) { }

  ngOnInit() {
    this.khoService.khoSelected.subscribe((res:any)=>{
      if(res.length){
        this.khoXuat = res.find(x=>x.loai_kho ==  environment.loai_kho.kho_xac);
        this.onLoadAllData();
      }
    })
  }
  onLoadAllData(){
    this.chungTuService.getListChungTuKhoTot(environment.loai_chung_tu.phieu_xuat_kho,this.khoXuat.id).subscribe((res: any)=>{
      if(res){
        this.chungTuPagination = res; console.log(res);
        this.chungTuList = res.data;
        console.log(this.chungTuList);
      }
    });
  }
  openIssue(id){
    this.router.navigateByUrl('/dashboard/issue?id='+ id.toString());
  }
  onSearch(){
    event.preventDefault();
    if(!this.searchForm.ngay_bat_dau&&!this.searchForm.ngay_ket_thuc) { this.onLoadAllData(); return; }
    let startDate = this.dateService.getDateString(this.searchForm.ngay_bat_dau);
    let endDate = this.dateService.getDateString(this.searchForm.ngay_ket_thuc);
    this.chungTuService.filterListChungTuKhoTot(environment.loai_ct.xuat_kho,this.khoXuat.id,
      startDate, endDate).subscribe((res: any)=>{
        if(res){
          this.chungTuPagination = res; 
          this.chungTuList = res.data;
        }
    });
  }
  goToPageNext(){
    if(this.chungTuPagination.current_page == this.chungTuPagination.last_page) return;
    let pageNextUrl = this.chungTuPagination.next_page_url;
    this.chungTuService.getPage(pageNextUrl).subscribe(res=>{
      if(res){
        console.log(res); this.chungTuList = (<any>res).data;
        this.chungTuPagination = res;
      }
    })
  }
  goToPagePrev(){
    if(this.chungTuPagination.current_page == 1) return;
    let pagePrevUrl = this.chungTuPagination.prev_page_url;
    this.chungTuService.getPage(pagePrevUrl).subscribe(res=>{
      if(res){
        console.log(res); this.chungTuList = (<any>res).data;
        this.chungTuPagination = res;
      }
    })
  }
  goToPageLast(){
    if(this.chungTuPagination.current_page == this.chungTuPagination.last_page) return;
    let pageLastUrl = this.chungTuPagination.last_page_url;
    this.chungTuService.getPage(pageLastUrl).subscribe(res=>{
      if(res){
        console.log(res); this.chungTuList = (<any>res).data;
        this.chungTuPagination = res;
      }
    });
  }
  goToPageFirst(){
    if(this.chungTuPagination.current_page == 1) return;
    let pageFirstUrl = this.chungTuPagination.first_page_url;
    this.chungTuService.getPage(pageFirstUrl).subscribe(res=>{
      if(res){
        console.log(res); this.chungTuList = (<any>res).data;
        this.chungTuPagination = res;
      }
    });
  }
}

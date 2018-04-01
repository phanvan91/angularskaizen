import { Component, OnInit, Host } from '@angular/core';
import { TrungTamBaoHanhService} from '../../../shared/trung-tam-bao-hanh.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TramBaoHanhService } from '../../../shared/tram-bao-hanh.service';
import { CompanyService } from '../../../shared/company.service';
import {environment} from "../../../../environments/environment";

import { ToastyService } from 'ng2-toasty';
import { DashboardComponent } from '../../dashboard.component';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss']
})
export class CenterComponent implements OnInit {

  alive = true;
  trungTamBaoHanhList  = [];
  tramBaoHanhList = [];
  companyList;
  trungTamBaoHanhForm;
  trungTamBaoHanhEditForm;
  deleteIndex;
  editIndex;
  dsTram = [];
    toChuc = environment.toChuc;
    page = 1;
    pages;
    total_page = [];
    total;
    min ;
    max;
  constructor(
    private toastService: ToastyService, @Host() private parent: DashboardComponent,
    private trungTamBaoHanhService: TrungTamBaoHanhService,
     private tramBaoHanhService: TramBaoHanhService, private companyService: CompanyService) { }

  ngOnInit() {
    this.trungTamBaoHanhService.get_pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
      if (res) {
        this.trungTamBaoHanhList = res.data;
          this.total = res.total;
          this.page = res.current_page;
          this.pages = res.last_page;
          this.min = Math.max(this.page - 4, 1);
          this.max =  Math.min(this.page + 4 , this.pages );
          if (this.pages > 1 ) {
              this.total_page = [];
              for (let i =  this.min; i <= this.max; i++) {
                  this.total_page.push(i);
              }
          }
        console.log(res);
      }
    });

    this.companyService.all().takeWhile(() => this.alive).subscribe((res: any) => {
      if (res.length) {
        this.companyList = res;
        // console.log(['company', res]);
      }
    });
    this.tramBaoHanhService.all().takeWhile(() => this.alive).subscribe((res: any) => {
      if (res.length) {
        this.tramBaoHanhList = res;
        console.log(res);
        res.forEach(element => {
          let dataFilter = this.dsTram.find(x=>x.id == element.trung_tam_bao_hanh_id);
          if(dataFilter){
            dataFilter.tram.push(element);
          }else{
            let trams = [];
            trams.push(element);
            this.dsTram.push(
              { 'id': element.trung_tam_bao_hanh_id, 'tram': trams}
            );
          }
        });
        console.log(this.dsTram);
      }
    });
    this.trungTamBaoHanhForm = new FormGroup({
      ma: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten: new FormControl(null, {
        validators: [Validators.required]
      }),
      dia_chi: new FormControl(null, {
        validators: [Validators.required]
      }),
      cong_ty_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: null
      }),
      so_dien_thoai: new FormControl(null, {
        validators: null
      })
    });
    this.trungTamBaoHanhEditForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten: new FormControl(null, {
        validators: [Validators.required]
      }),
      dia_chi: new FormControl(null, {
        validators: [Validators.required]
      }),
      cong_ty_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: null
      }),
      so_dien_thoai: new FormControl(null, {
        validators: null
      })
    });
  }
    show_page(index) {
        this.page = index;
        this.trungTamBaoHanhService.get_pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                this.trungTamBaoHanhList = res.data;
                this.total = res.total;
                this.page = res.current_page;
                this.pages = res.last_page;
                this.min = Math.max(this.page - 4, 1);
                this.max =  Math.min(this.page + 4 , this.pages );
                if (this.pages > 1 ) {
                    this.total_page = [];
                    for (let i =  this.min; i <= this.max; i++) {
                        this.total_page.push(i);
                    }
                }
                console.log(res);
            }
        });
    }

    getDsTram(id){
    const trungTam = this.dsTram.find(x=>x.id==id);
    if(!trungTam) return;
    let ds = '';
    trungTam.tram.forEach(element => {
      ds += element.ten+', ';
    });
    return ds.substr(0,ds.length-2);
  }
  onSubmitAddData(event){
    event.preventDefault();
    const data = this.trungTamBaoHanhForm.value;
    this.trungTamBaoHanhService.create(data).subscribe(res=>{
      if(res){
        console.log(res);
        this.trungTamBaoHanhList.push(res);
        (<any>$('#add_center')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Thêm thành công', ''));
        this.parent.initHeader();
      }
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }
  onSubmitEditData(event){
    event.preventDefault();
    const data = this.trungTamBaoHanhEditForm.value;
    this.trungTamBaoHanhService.update(data).subscribe(res=>{
      if(res){
        console.log(res);
        this.trungTamBaoHanhList[this.editIndex]=res;
        (<any>$('#edit_center')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Sửa thành công', ''));
        this.parent.initHeader();
      }
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }
  onSubmitDeleteData(){
    let obj = this.trungTamBaoHanhList[this.deleteIndex];
    let data = { id: obj.id, cong_ty_id: obj.cong_ty_id};
    this.trungTamBaoHanhService.delete(data).subscribe(res=>{
      if(res){ 
        this.trungTamBaoHanhList.splice(this.deleteIndex, 1);
        this.deleteIndex = null;
        (<any>$('#delete_center')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Xóa thành công', ''));
        this.parent.initHeader();
      }
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }

  openEditTrungTamBaoHanh(i){
    this.editIndex = i;
    let obj = this.trungTamBaoHanhList[i];
    this.trungTamBaoHanhEditForm.get('id').patchValue(obj.id);
    // this.trungTamBaoHanhEditForm.get('to_chuc_id').patchValue(obj.to_chuc_id);
    this.trungTamBaoHanhEditForm.get('cong_ty_id').patchValue(obj.cong_ty_id);
    this.trungTamBaoHanhEditForm.get('ma').patchValue(obj.ma);
    this.trungTamBaoHanhEditForm.get('ten').patchValue(obj.ten);
    this.trungTamBaoHanhEditForm.get('dia_chi').patchValue(obj.dia_chi);
    this.trungTamBaoHanhEditForm.get('email').patchValue(obj.email);
    this.trungTamBaoHanhEditForm.get('so_dien_thoai').patchValue(obj.so_dien_thoai);
  }
  
}

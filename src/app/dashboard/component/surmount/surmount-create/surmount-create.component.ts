import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NganhHangService } from '../../../../shared/nganh-hang.service';
import { HuongKhacPhucService } from '../../../../shared/huong-khac-phuc.service';
import {environment} from '../../../../../environments/environment';
import { ToastyService } from "ng2-toasty";

@Component({
  selector: 'app-surmount-create',
  templateUrl: './surmount-create.component.html',
  styleUrls: ['./surmount-create.component.scss']
})
export class SurmountCreateComponent implements OnInit {

  huongKhacPhucForm;
  alive = true;
  nganhHangList;
    toChuc = environment.toChuc;
  @Output() huongKhacPhucAdded = new EventEmitter<boolean>();

  constructor(private huongKhacPhucService: HuongKhacPhucService, private nganhHangService: NganhHangService,
    private toastService: ToastyService) { }

  ngOnInit() {
      this.nganhHangService.all().takeWhile(() => this.alive).subscribe((res: any) => {
      if (res) {
        this.nganhHangList = res;
      }
    });
    this.huongKhacPhucForm = new FormGroup({
      nganh_hang_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_huong_khac_phuc: new FormControl(null, {
        validators: [Validators.required]
      }),
      mo_ta: new FormControl(null, {
        validators: [Validators.required]
      }), 
    });
  }

  onSubmitAddData() {
    const formData = new FormData();

    formData.append('nganh_hang_id', this.huongKhacPhucForm.controls.nganh_hang_id.value);
    formData.append('ma_huong_khac_phuc', this.huongKhacPhucForm.controls.ma_huong_khac_phuc.value);
    formData.append('mo_ta', this.huongKhacPhucForm.controls.mo_ta.value);
    this.huongKhacPhucService.create(formData).subscribe((res:any)=>{
      if (res) {
        this.huongKhacPhucAdded.next(res);
        (<any>$('#add_surmount')).modal('hide');
        this.toastService.success({title: 'Thao tác thành công', msg: ''});
      }
    }, error => {
      this.toastService.error({title: 'Thao tác lỗi', msg: error.error});
    });
  }
}

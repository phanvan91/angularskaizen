import { Component,EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TinhTrangHuHongService } from '../../../../shared/tinh-trang-hu-hong.service';
import { NganhHangService } from '../../../../shared/nganh-hang.service';
import {environment} from '../../../../../environments/environment';
import { ToastyService } from "ng2-toasty";

@Component({
  selector: 'app-ttht-create',
  templateUrl: './ttht-create.component.html',
  styleUrls: ['./ttht-create.component.scss']
})
export class TthtCreateComponent implements OnInit {

  tinhTrangHuHongForm;
  nganhHangList;
  alive = true;
  toChuc = environment.toChuc;
  @Output() tinTrangHuHongAdded = new EventEmitter<boolean>();

  constructor(private tinhTrangHuHongService: TinhTrangHuHongService, private nganhHangService: NganhHangService,
     private toastService: ToastyService) { }

  ngOnInit() {
      this.nganhHangService.all().takeWhile(() => this.alive).subscribe((res: any) => {
      this.nganhHangList = res;
    })
    this.tinhTrangHuHongForm = new FormGroup({
      nganh_hang_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_tinh_trang_hu_hong: new FormControl(null, {
        validators: [Validators.required]
      }),
      mo_ta: new FormControl(null, {
        validators: [Validators.required]
      }), 
    });
  }
  onSubmitAddData(){
    const formData = new FormData();

    formData.append('nganh_hang_id',this.tinhTrangHuHongForm.controls.nganh_hang_id.value);
    formData.append('ma_tinh_trang_hu_hong',this.tinhTrangHuHongForm.controls.ma_tinh_trang_hu_hong.value);
    formData.append('mo_ta',this.tinhTrangHuHongForm.controls.mo_ta.value);
    this.tinhTrangHuHongService.create(formData).takeWhile(() => this.alive).subscribe((res: any)=>{
      if(res){
        this.tinTrangHuHongAdded.next(res); (<any>$('#add_tthh')).modal('hide');
        this.toastService.success({title: 'Thao tác thành công', msg: ''});
      }
    }, error => {
      this.toastService.error({title: 'Thao tác lỗi', msg: error.error});
    });
  }

}

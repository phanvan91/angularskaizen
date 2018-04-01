import { Component,EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NguyenNhanService } from '../../../../shared/nguyen-nhan.service';
import { NganhHangService} from '../../../../shared/nganh-hang.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {environment} from "../../../../../environments/environment";
import { ToastyService } from "ng2-toasty";

@Component({
  selector: 'app-cause-create',
  templateUrl: './cause-create.component.html',
  styleUrls: ['./cause-create.component.scss']
})
export class CauseCreateComponent implements OnInit {

  nganhHangList;
  nguyenNhanHuHongForm;
    alive = true;
    toChuc = environment.toChuc;
  @Output() nguyenNhanHuHongAdded = new EventEmitter<boolean>();

  constructor(private nguyenNhanService: NguyenNhanService, private nganhHangService: NganhHangService,
    private toastService: ToastyService) { }

  ngOnInit() {
      this.nganhHangService.all().takeWhile(() => this.alive).subscribe((res: any) => {
      if (res) {
        this.nganhHangList = res;
      }
    });
    this.nguyenNhanHuHongForm = new FormGroup({
      nganh_hang_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_nguyen_nhan: new FormControl(null, {
        validators: [Validators.required]
      }),
      mo_ta: new FormControl(null, {
        validators: [Validators.required]
      }), 
    });
  }

  onSubmitAddData(){
    console.log(this.nguyenNhanHuHongForm);
    const formData = new FormData();

    formData.append('nganh_hang_id', this.nguyenNhanHuHongForm.controls.nganh_hang_id.value);
    formData.append('ma_nguyen_nhan', this.nguyenNhanHuHongForm.controls.ma_nguyen_nhan.value);
    formData.append('mo_ta', this.nguyenNhanHuHongForm.controls.mo_ta.value);
    this.nguyenNhanService.create(formData).subscribe((res:any)=>{
      if (res) {
        this.nguyenNhanHuHongAdded.next(res);
        (<any>$('#add_cause')).modal('hide');
        this.toastService.success({title: 'Thao tác thành công', msg: ''});
      }
    }, error => {
      this.toastService.error({title: 'Thao tác lỗi', msg: error.error});
    });
  }
}

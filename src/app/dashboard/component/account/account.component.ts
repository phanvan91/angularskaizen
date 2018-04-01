import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {LoaiNguoiDungService} from '../../../shared/loai-nguoi-dung.service';
import {TrungTamBaoHanhService} from '../../../shared/trung-tam-bao-hanh.service';
import {TramBaoHanhService} from '../../../shared/tram-bao-hanh.service';
import {AuthService} from "../../../shared/auth.service";
import {environment} from "../../../../environments/environment";
import {ToastyService} from 'ng2-toasty';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  userForm;
  // user = {
  //   id: 3,
  //   email: '21312431@gmail.com',
  //   name: '123123',
  //   dien_thoai: null,
  //   loai_nguoi_dung_id: 1,
  //   trung_tam_bao_hanh_id: 1,
  //   tram_bao_hanh_id: null
  // };
  me: any = {};
  alive = true;
  loaiNguoiDungs = [];
  loaiNguoiDungMap: any = {};
  ttbhs = [];
  ttbhMap: any = {};
  tbhs = [];
  tbhMap: any = {};
    toChuc = environment.toChuc;
  isNotConfirm = false;
  constructor(
    private loaiNguoiDungService: LoaiNguoiDungService,
    private trungTamBaoHanhService: TrungTamBaoHanhService,
    private tramBaoHanhService: TramBaoHanhService,
    private authService: AuthService,
    private toastService: ToastyService
  ) { }

  ngOnInit() {

      this.userForm = new FormGroup({
      id: new FormControl({value: null, disabled: true}),
      email: new FormControl({value: null, disabled: true}),
      name: new FormControl({value: null, disabled: true}),
      dien_thoai: new FormControl(),
      loai_nguoi_dung_id: new FormControl({value: null, disabled: true}),
      trung_tam_bao_hanh_id: new FormControl({value: null, disabled: true}),
      tram_bao_hanh_id: new FormControl({value: null, disabled: true}),
          password: new FormControl(),
          new_password: new FormControl(),
          confirm_password: new FormControl(),
      });
      this.trungTamBaoHanhService.all().takeWhile(() => this.alive).subscribe((resTT: any) => {
          if (resTT.length) {
              this.ttbhs = resTT;
              this.ttbhs.forEach((val: any) => {
                  this.ttbhMap[val.id] = val;
              });
              this.tramBaoHanhService.all().takeWhile(() => this.alive).subscribe((resTram: any) => {
                  if (resTram.length) {
                      this.tbhs = resTram;
                      this.tbhs.forEach((val: any) => {
                          this.tbhMap[val.id] = val;
                      });
                  }
              });
          }
      });

      this.authService.me().takeWhile(() => this.alive).subscribe(res => {
        this.loaiNguoiDungService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe((resLoai: any) => {
            if (resLoai.length) {
                this.loaiNguoiDungs = resLoai;
                this.loaiNguoiDungs.forEach((val: any) => {
                    this.loaiNguoiDungMap[val.id] = val;
                });

            }
        });

        this.me = res;
        this.userForm.get('id').patchValue(this.me.id);
        this.userForm.get('email').patchValue(this.me.email);
        this.userForm.get('name').patchValue(this.me.name);
        this.userForm.get('dien_thoai').patchValue(this.me.dien_thoai);
        this.userForm.get('loai_nguoi_dung_id').patchValue(this.me.loai_nguoi_dung_id);
        this.userForm.get('trung_tam_bao_hanh_id').patchValue(this.me.trung_tam_bao_hanh_id);
        this.userForm.get('tram_bao_hanh_id').patchValue(this.me.tram_bao_hanh_id);
        console.log(this.tbhs);

    }, err => console.log(err));


  }
    updateAccount() {
        // event.preventDefault();
        // console.log(this.me);
        const data = this.userForm.value;

        data.id = this.me.id;
        data.email = this.me.email;
        this.authService.updateAccount(data).takeWhile(() => this.alive).subscribe((res: any) => {
           console.log(res);
           if (res.status) {
                this.toastService.error({ title: 'Cập nhật thông tin', msg: res.status});
            } else {
               this.toastService.success({ title: 'Cập nhật thông tin', msg: 'thành công'});
               (<any>$('#pass_info')).modal('hide');
               (<any>$('#ask_info')).modal('hide');
           }


        });
    }
    setPass(event, type) {
        switch (type) {
            case 'old':
                this.userForm.get('password').patchValue(event.target.value);
                break;
            case 'new':
                this.userForm.get('new_password').patchValue(event.target.value);
                this.checkConfirm();
                break;
            case 'confirm':
                this.userForm.get('confirm_password').patchValue(event.target.value);
                this.checkConfirm();
                break;
        }

    }
    checkConfirm() {
        if ( this.userForm.value.new_password != this.userForm.value.confirm_password && this.userForm.value.confirm_password) {
            this.isNotConfirm = true;
        }else { this.isNotConfirm = false; }
    }

  ngOnDestroy(): void {
  }
}

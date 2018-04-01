import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import {LoaiNguoiDungService} from '../../../shared/loai-nguoi-dung.service';
import {TrungTamBaoHanhService} from '../../../shared/trung-tam-bao-hanh.service';
import {TramBaoHanhService} from '../../../shared/tram-bao-hanh.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../shared/user.service';
import { ToastyService } from 'ng2-toasty';
import { DashboardComponent } from '../../dashboard.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  options_role= {
    placeholder: {
      id: '0', // the value of the option
      text: 'Lựa chọn loại tài khoản'
    },
  };

  options_company = {
    placeholder: {
      id: '0', // the value of the option
      text: 'Lựa chọn loại trung tâm'
    },
  };

  options_tramBaoHanh = {
    placeholder: {
      id: '0', // the value of the option
      text: 'Lựa chọn loại trạm'
    },
    allowClear: true
  };

  alive = true;
  loaiNguoiDungs = [];
  trungTamBaoHanhs = [];
  tramBaoHanhs = [];
  createUserForm;
  toChuc = environment.toChuc;
  users;
  loaiNguoiDungMap: any = {};
  trungTamBaoHanhMap: any = {};
  tramBaoHanhMap: any = {};
  updateUserForm;
  editIndex;
  deleteIndex;
  Users;
    page = 1;
    pages;
    total_page = [];
    total;
    min ;
    max;
    doi_mk = false;
    me;
  constructor(
    private loaiNguoiDungService: LoaiNguoiDungService,
    private trungTamBaoHanhService: TrungTamBaoHanhService,
    private tramBaoHanhService: TramBaoHanhService,
    private userService: UserService,
    private toastService: ToastyService, @Host() private parent: DashboardComponent,
  ) {
  }

  ngOnInit() {
    this.loaiNguoiDungService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe((loaiNguoiDungRes: any) => {
      if (loaiNguoiDungRes.length) {
        this.loaiNguoiDungs = loaiNguoiDungRes.map(item => { item.text = item.ten_loai; return item; });
        this.loaiNguoiDungs.forEach((val) => {
          this.loaiNguoiDungMap[val.id] = val;
        });
      }
    });
    this.trungTamBaoHanhService.all().takeWhile(() => this.alive).subscribe((res: any) => {
      if (res.length) {
        this.trungTamBaoHanhs = res.map(item => {item.text = item.ma; return item; });
        this.trungTamBaoHanhs.forEach((val) => {
          this.trungTamBaoHanhMap[val.id] = val;
        });
      }
    });
    
    this.tramBaoHanhService.all().takeWhile(() => this.alive).subscribe((res: any) => {
      if (res.length) {
        this.tramBaoHanhs = res.map(item => {item.text = item.ma; return item; });
        // this.tramBaoHanhs.unshift({id: 0, text: 'Select'});
        this.tramBaoHanhs.forEach((val) => {
          this.tramBaoHanhMap[val.id] = val;
        });
          this.userService.userInfo.takeWhile(() => this.alive).subscribe(resMe => {
              this.me = resMe;
              console.log(this.me);
              this.userService.pagination(this.page, this.me.trung_tam_bao_hanh_id, this.me.tram_bao_hanh_id)
                  .takeWhile(() => this.alive).subscribe((res: any) => {
                  if (res) {
                      this.users = res.data;
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
                  }
              });

          });

      }
    });


    this.createUserForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      dien_thoai: new FormControl(null, {
        // validators: [Validators.required]
      }),
      loai_nguoi_dung_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      trung_tam_bao_hanh_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      tram_bao_hanh_id: new FormControl(null),
    });

    this.updateUserForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl({value: null, disabled: true}, {
        validators: [Validators.required, Validators.email]
      }),
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      dien_thoai: new FormControl(null, {
        // validators: [Validators.required]
      }),
      loai_nguoi_dung_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      trung_tam_bao_hanh_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      tram_bao_hanh_id: new FormControl(null),
    });
  }

  nguoiDungSelectCreateValueChanged(event) {
    this.createUserForm.get('loai_nguoi_dung_id').patchValue(event.value);
  }

  trungTamBaoHanhCreateSelectValueChanged(event) {
    const trungtam = this.createUserForm.get('trung_tam_bao_hanh_id').patchValue(event.value);
    console.log(trungtam);
  }

  tramBaoHanhCreateSelectValueChanged(event) {
    const baohanh = this.createUserForm.get('tram_bao_hanh_id').patchValue(event.value);
    // console.log(baohanh);
  }
    change_pass() {
    if (this.doi_mk) {
        this.doi_mk = false;

    } else {
        this.doi_mk = true;

    }
    }
    show_page(index) {
        this.page = index;
        this.userService.pagination(this.page, this.me.trung_tam_bao_hanh_id, this.me.tram_bao_hanh_id)
            .takeWhile(() => this.alive).subscribe((res: any) => {
                this.users = res.data;
            this.total = res.total;
            this.pages = res.last_page;
            this.min = Math.max(this.page - 4, 1);
            this.max =  Math.min(this.page + 4 , this.pages );
            if (this.pages > 1 ) {
                this.total_page = [];
                for (let i =  this.min; i <= this.max; i++) {
                    this.total_page.push(i);
                }
            }
        });
    }

  onCreate(event) {
    event.preventDefault();
    const data = this.createUserForm.value;
    data.to_chuc_id = this.toChuc.id;
    console.log(data);

    this.userService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.users.push(res);
      (<any>$('#add_user')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  openEdit(index) {
    this.updateUserForm.get('id').patchValue(this.users[index].id);
    this.updateUserForm.get('email').patchValue(this.users[index].email);
    this.updateUserForm.get('name').patchValue(this.users[index].name);
    this.updateUserForm.get('dien_thoai').patchValue(this.users[index].dien_thoai);
    this.updateUserForm.get('loai_nguoi_dung_id').patchValue(this.users[index].loai_nguoi_dung_id);
    this.updateUserForm.get('trung_tam_bao_hanh_id').patchValue(this.users[index].trung_tam_bao_hanh_id);
    this.updateUserForm.get('tram_bao_hanh_id').patchValue(this.users[index].tram_bao_hanh_id);
    this.editIndex = index;
  }

  nguoiDungEditreateValueChanged(event) {
    console.log(event);
    this.updateUserForm.get('loai_nguoi_dung_id').patchValue(event.value);
  }

  trungTamBaoHanhEditSelectValueChanged(event) {
    this.updateUserForm.get('trung_tam_bao_hanh_id').patchValue(event.value);
  }

  tramBaoHanhCreateEditValueChanged(event) {
    this.updateUserForm.get('tram_bao_hanh_id').patchValue(event.value);
  }

  onUpdate(event) {
    event.preventDefault();
    const data = this.updateUserForm.value;
    data.to_chuc_id = this.toChuc.id;
    console.log(data);

    this.userService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.users[this.editIndex] = res;
      (<any>$('#edit_user')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  onDelete() {
    const data: any = {};
    data.id = this.users[this.deleteIndex].id;
    data.to_chuc_id = this.toChuc.id;

    this.userService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.users.splice(this.deleteIndex, 1);
      (<any>$('#delete_user')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

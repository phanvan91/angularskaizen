import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import {LoaiNguoiDungService} from '../../../shared/loai-nguoi-dung.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {TrungTamBaoHanhService} from '../../../shared/trung-tam-bao-hanh.service';
import { ToastyService } from 'ng2-toasty';
import { DashboardComponent } from '../../dashboard.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {

  createLoaiNguoiDungForm;
  editLoaiNguoiDungForm;
  toChuc = environment.toChuc;
  alive = true;
  loaiNguoiDungs = [];
  editIndex;
  deleteIndex;

  constructor(
    private loaiNguoiDungService: LoaiNguoiDungService,
    private toastService: ToastyService, @Host() private parent: DashboardComponent,
  ) { }

  ngOnInit() {
    this.createLoaiNguoiDungForm = new FormGroup({
      ten_loai: new FormControl(null, {
        validators: [ Validators.required ],
      }),
      dien_giai: new FormControl(null, {
        validators: [ Validators.required ],
      })
    });

    this.editLoaiNguoiDungForm = new FormGroup({
      id: new FormControl(null, {
        validators: [ Validators.required ],
      }),
      ten_loai: new FormControl(null, {
        validators: [ Validators.required ],
      }),
      dien_giai: new FormControl(null, {
        validators: [ Validators.required ],
      })
    });


    this.loaiNguoiDungService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe((res: any) => {
      if (res.length) {
        this.loaiNguoiDungs = res;
      }
    });


  }

  onCreate(event) {
    event.preventDefault();
    const data = this.createLoaiNguoiDungForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.loaiNguoiDungService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.loaiNguoiDungs.push(res);
      (<any>$('#add_role')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  openEdit(index) {
    this.editLoaiNguoiDungForm.get('id').patchValue(this.loaiNguoiDungs[index].id);
    this.editLoaiNguoiDungForm.get('ten_loai').patchValue(this.loaiNguoiDungs[index].ten_loai);
    this.editLoaiNguoiDungForm.get('dien_giai').patchValue(this.loaiNguoiDungs[index].dien_giai);
    this.editIndex = index;
  }

  onUpdate(event) {
    event.preventDefault();
    const data = this.editLoaiNguoiDungForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.loaiNguoiDungService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.loaiNguoiDungs[this.editIndex] = res;
      (<any>$('#edit_role')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  onDelete() {
    const data: any = {};
    data.id = this.loaiNguoiDungs[this.deleteIndex].id;
    data.to_chuc_id = this.toChuc.id;

    this.loaiNguoiDungService.delete(data).takeWhile(() => this.alive).subscribe(res => {
      this.loaiNguoiDungs.splice(this.deleteIndex, 1);
      (<any>$('#delete_role')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

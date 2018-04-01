import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoaiChungTuService} from '../../../shared/loai-chung-tu.service';
import {environment} from '../../../../environments/environment';
import { ToastyService } from 'ng2-toasty';
import { DashboardComponent } from '../../dashboard.component';
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {


  createLoaiChungTuForm;
  editLoaiChungTuForm;
  toChuc = environment.toChuc;
  alive = true;
  loaiChungTus;
  editIndex;
  deleteIndex;

  constructor(private loaiChungTuService: LoaiChungTuService,
    private toastService: ToastyService, @Host() private parent: DashboardComponent) {
  }

  ngOnInit() {
    this.createLoaiChungTuForm = new FormGroup({
      loai_chung_tu: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten_chung_tu: new FormControl(null, {
        validators: [Validators.required]
      }),
      muc_dich_su_dung: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.editLoaiChungTuForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      loai_chung_tu: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten_chung_tu: new FormControl(null, {
        validators: [Validators.required]
      }),
      muc_dich_su_dung: new FormControl(null, {
        validators: [Validators.required]
      })
    });

      this.loaiChungTuService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe(res => {
      if (res) {
        this.loaiChungTus = res;
      }
    });
  }

  onCreateSubmit(event) {
    event.preventDefault();

    const data = this.createLoaiChungTuForm.value;
    data.to_chuc_id = this.toChuc.id;
    this.loaiChungTuService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.loaiChungTus.push(res);
      (<any>$('#add_document')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công',''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại',err.error));
    });
  }

  onEdit(index) {
    this.editLoaiChungTuForm.get('id').patchValue(this.loaiChungTus[index].id);
    this.editLoaiChungTuForm.get('loai_chung_tu').patchValue(this.loaiChungTus[index].loai_chung_tu);
    this.editLoaiChungTuForm.get('ten_chung_tu').patchValue(this.loaiChungTus[index].ten_chung_tu);
    this.editLoaiChungTuForm.get('muc_dich_su_dung').patchValue(this.loaiChungTus[index].muc_dich_su_dung);
    this.editIndex = index;
  }

  onEditSubmit(event) {
    event.preventDefault();
    const data = this.editLoaiChungTuForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.loaiChungTuService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.loaiChungTus[this.editIndex] = res;
      (<any>$('#edit_document')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công',''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại',err.error));
    });
  }

  onDeleteSubmit() {
      const data: any = {};
      data.id = this.loaiChungTus[this.deleteIndex].id;
      data.to_chuc_id = this.toChuc.id;

      this.loaiChungTuService.delete(data).takeWhile(() => this.alive).subscribe((res) => {
        this.loaiChungTus.splice(this.deleteIndex, 1);
        (<any>$('#delete_document')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Thao tác thành công',''));
      }, err => {
        this.toastService.error(this.parent.toastOptions('Thất bại',err.error));
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

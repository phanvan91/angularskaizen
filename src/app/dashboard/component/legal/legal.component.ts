import { Component, OnInit, Host } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {DoiTuongPhapNhanService} from '../../../shared/doi-tuong-phap-nhan.service';
import { ToastyService } from 'ng2-toasty';
import { DashboardComponent } from '../../dashboard.component';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {

  createDoiTuongPhapNhanForm;
  updateDoiTuongPhapNhanForm;
  loaiDoiTuongPhapNhan = environment.loai_doi_tuong_phap_nhan;
  toChuc = environment.toChuc;
  alive = true;
  doiTuongPhapNhans = [];
  editIndex;
  deleteIndex;
    page = 1;
    pages;
    total_page = [];
    total;
    min;
    max;
  constructor(private doiTuongPhapNhanService: DoiTuongPhapNhanService,
    private toastService: ToastyService, @Host() private parent: DashboardComponent,
  ) { }

  ngOnInit() {

    this.updateDoiTuongPhapNhanForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten: new FormControl(null, {
        validators: [Validators.required]
      }),
      loai: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.doiTuongPhapNhanService.pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
        if (res) {
            this.doiTuongPhapNhans = res.data;
            this.total = res.total;
            this.page = res.current_page;
            this.pages = res.last_page;
            if ( res.last_page > 1 ) {
                this.min = Math.max(this.page - 4, 1);
                this.max =  Math.min(this.page + 4 ,  this.total);
                for (let i =  this.min; i <= this.max; i++) {
                    this.total_page.push(i);
                }
            }
        }
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }
    show_page(index) {

        this.page = index;
        this.doiTuongPhapNhanService.pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                this.doiTuongPhapNhans = res.data;
                this.total = res.total;
                this.page = res.current_page;
                this.pages = res.last_page;
                this.min = Math.max(this.page - 4, 1);
                this.max =  Math.min(this.page + 4 ,  this.total);
                this.total_page = [];
                for (let i =  this.min; i <= this.max; i++) {
                    this.total_page.push(i);
                }
            }


        });

    }

  openEdit(index) {
    this.updateDoiTuongPhapNhanForm.get('id').patchValue(this.doiTuongPhapNhans[index].id);
    this.updateDoiTuongPhapNhanForm.get('ma').patchValue(this.doiTuongPhapNhans[index].ma);
    this.updateDoiTuongPhapNhanForm.get('ten').patchValue(this.doiTuongPhapNhans[index].ten);
    this.updateDoiTuongPhapNhanForm.get('loai').patchValue(this.doiTuongPhapNhans[index].loai);
    this.editIndex = index;
  }

  onUpdate(event) {
    event.preventDefault();
    const data = this.updateDoiTuongPhapNhanForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.doiTuongPhapNhanService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.doiTuongPhapNhans[this.editIndex] = res;
      (<any>$('#edit_legal')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  onDelete() {
    const data: any = {};
    data.to_chuc_id = this.toChuc.id;
    data.id = this.doiTuongPhapNhans[this.deleteIndex].id;

    this.doiTuongPhapNhanService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.doiTuongPhapNhans.splice(this.deleteIndex, 1);
      (<any>$('#delete_legal')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }


}

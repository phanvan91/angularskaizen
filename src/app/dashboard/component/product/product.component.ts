import {Component, OnDestroy, OnInit, Host} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {SanPhamService} from '../../../shared/san-pham.service';
import {NganhHangService} from "../../../shared/nganh-hang.service";

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy  {
    user = environment.user;
    toChuc = environment.toChuc;
    SanPham = [];
    categoies = [];
    alive = true;
    productEditForm;
    productCreateForm
    page = 1;
    pages;
    total_page = [];
    total;
    editIndex;
    deleteIndex;
    min;
    max;
    status = 1;
  constructor(
      private sanPhamService: SanPhamService,
      private nganhHangService: NganhHangService,
      private toastService: ToastyService, @Host() private parent: DashboardComponent
      ) {}

  ngOnInit() {
      this.productEditForm = new FormGroup({
          id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ma: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ten: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          to_chuc_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          nganh_hang_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          kich_hoat: new FormControl(null, {
              validators: [ Validators.required ]
          }),
      });
      this.productCreateForm = new FormGroup({
          id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ma: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ten: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          to_chuc_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          nganh_hang_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          kich_hoat: new FormControl(null, {
              validators: [ Validators.required ]
          }),
      });

      this.sanPhamService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
          this.SanPham = res.data;
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

      });
      this.nganhHangService.all().takeWhile(() => this.alive).subscribe((res: any) => {
          if (res.length) {
              this.categoies = res;
              console.log(res);
          }
      });
  }
    show_page(index) {

        this.page = index;
        this.sanPhamService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.SanPham = res.data;
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
    onCreateSanPhamSubmit(event) {
        event.preventDefault();
        const data = this.productCreateForm.value;
        data.to_chuc_id = this.toChuc.id;

        this.sanPhamService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.SanPham.push(res);
            (<any>$('#add_product')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    }
    onEditSubmit(event) {
        event.preventDefault();

        const data = this.productEditForm.value;
        data.to_chuc_id = this.toChuc.id;

        this.sanPhamService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
            console.log(res);
            this.SanPham[this.editIndex] = res;
            (<any>$('#edit_product')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });

    }

    openEdit(index) {
        this.productEditForm.get('id').patchValue(this.SanPham[index].id);
        this.productEditForm.get('ma').patchValue(this.SanPham[index].ma);
        this.productEditForm.get('ten').patchValue(this.SanPham[index].ten);
        this.productEditForm.get('nganh_hang_id').patchValue(this.SanPham[index].nganh_hang_id);
        this.productEditForm.get('kich_hoat').patchValue(this.SanPham[index].kich_hoat);
        this.editIndex = index;
    }
    onDeleteSubmit() {
        const data: any = {};
        data.id = this.SanPham[this.deleteIndex].id;
        data.to_chuc_id = this.toChuc.id;

        this.sanPhamService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
            console.log(res);

            this.SanPham.splice(this.deleteIndex, 1);
            (<any>$('#delete_product')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    }
    ngOnDestroy(): void {
        this.alive = false;
    }

}

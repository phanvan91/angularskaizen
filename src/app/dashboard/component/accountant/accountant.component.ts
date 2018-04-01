import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {AccountantService} from '../../../shared/accountant.service';

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';
@Component({
  selector: 'app-accountant',
  templateUrl: './accountant.component.html',
  styleUrls: ['./accountant.component.scss']
})
export class AccountantComponent implements OnInit, OnDestroy {
  accountantCreateForm;
  toChuc = environment.toChuc;
  accountants;
  alive = true;
  editIndex;
  deleteIndex;
  accountEditForm;
    page = 1;
    pages;
    total_page = [];
    total;
    min;
    max;
  constructor(private accountantService: AccountantService,
    private toastService: ToastyService,@Host() private parent: DashboardComponent,
  ) { }

  ngOnInit() {
    this.accountantCreateForm = new FormGroup({
      so_hieu_tai_khoang: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten_tai_khoang: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.accountEditForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      so_hieu_tai_khoang: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten_tai_khoang: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    //   this.accountantService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe(res => {
    //   if (res) {
    //     this.accountants = res;
    //   }
    // });
      this.accountantService.pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
          if (res) {
              this.accountants = res.data;
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



      });

  }
    show_page(index) {

        this.page = index;
        this.accountantService.pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                this.accountants = res.data;
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

  onCreate(event) {
    event.preventDefault();
    const data = this.accountantCreateForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.accountantService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.accountants.push(res);
      (<any>$('#add_accountant')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  onEdit(index) {
    this.accountEditForm.get('id').patchValue(this.accountants[index].id);
    this.accountEditForm.get('so_hieu_tai_khoang').patchValue(this.accountants[index].so_hieu_tai_khoang);
    this.accountEditForm.get('ten_tai_khoang').patchValue(this.accountants[index].ten_tai_khoang);
    this.editIndex = index;
  }

  onEditSubmit(event) {
    event.preventDefault();
    const data = this.accountEditForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.accountantService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.accountants[this.editIndex] = res;
      (<any>$('#edit_accountant')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  onDeleteSubmit() {
    const data: any = {};
    data.id = this.accountants[this.deleteIndex].id;
    data.to_chuc_id = this.toChuc.id;

    this.accountantService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.accountants.splice(this.deleteIndex, 1);
      (<any>$('#delete_accountant')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

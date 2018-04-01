import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../../../shared/company.service';

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy {

  user = environment.user;
  toChuc = environment.toChuc;
  alive = true;
  companyCreateForm;
  companyEditForm;
  companies;
  editIndex;
  deleteIndex;
    page = 1;
    pages;
    total_page = [];
    total;
    min ;
    max;
  constructor(
    private companyService: CompanyService,
    private toastService: ToastyService,@Host() private parent: DashboardComponent
  ) {

  }

  ngOnInit() {

    this.companyCreateForm = new FormGroup({
      ma: new FormControl(null, {
        validators: [ Validators.required ]
      }),
      ten: new FormControl(null, {
        validators: [ Validators.required ]
      }),
      dia_chi: new FormControl(null, {
        validators: [ Validators.required ]
      }),
      ma_so_thue: new FormControl(null, {
        // validators: [ Validators.required ]
      }),
      email: new FormControl(null, {
        // validators: [ Validators.required, Validators.email ]
      }),
      web: new FormControl(null),
      dien_thoai: new FormControl(null, {
        validators: [ Validators.required ]
      }),
    });

    this.companyEditForm = new FormGroup({
      id: new FormControl(null, {
        validators: [ Validators.required ]
      }),
      ma: new FormControl(null, {
        validators: [ Validators.required ]
      }),
      ten: new FormControl(null, {
        validators: [ Validators.required ]
      }),
      dia_chi: new FormControl(null, {
        validators: [ Validators.required ]
      }),
      ma_so_thue: new FormControl(null, {
        // validators: [ Validators.required ]
      }),
      email: new FormControl(null, {
        // validators: [ Validators.required, Validators.email ]
      }),
      web: new FormControl(null),
      dien_thoai: new FormControl(null, {
        validators: [ Validators.required ]
      }),
    });
      this.companyService.get_pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
          if (res) {
              this.companies = res.data;
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

  }
    show_page(index) {
        this.page = index;
        this.companyService.get_pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.companies = res.data;
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

  onCreateCompanySubmit(event) {
    event.preventDefault();
    const data = this.companyCreateForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.companyService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.companies.push(res);
      (<any>$('#add_company')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
    console.log(data);
  }

  openEdit(index) {
    this.companyEditForm.get('id').patchValue(this.companies[index].id);
    this.companyEditForm.get('ma').patchValue(this.companies[index].ma);
    this.companyEditForm.get('ten').patchValue(this.companies[index].ten);
    this.companyEditForm.get('dia_chi').patchValue(this.companies[index].dia_chi);
    this.companyEditForm.get('ma_so_thue').patchValue(this.companies[index].ma_so_thue);
    this.companyEditForm.get('email').patchValue(this.companies[index].email);
    this.companyEditForm.get('web').patchValue(this.companies[index].web);
    this.companyEditForm.get('dien_thoai').patchValue(this.companies[index].dien_thoai);
    this.editIndex = index;
  }

  onEditSubmit(event) {
    event.preventDefault();

    const data = this.companyEditForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.companyService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.companies[this.editIndex] = res;
      (<any>$('#edit_company')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
    console.log(data);
  }

  onDeleteSubmit() {
    const data: any = {};
    data.id = this.companies[this.deleteIndex].id;
    data.to_chuc_id = this.toChuc.id;

    this.companyService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.companies.splice(this.deleteIndex, 1);
      (<any>$('#delete_company')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

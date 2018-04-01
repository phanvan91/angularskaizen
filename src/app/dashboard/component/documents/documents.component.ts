import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoaiChungTuService} from '../../../shared/loai-chung-tu.service';
import {SoHieuChungTuService} from '../../../shared/so-hieu-chung-tu.service';
import {environment} from '../../../../environments/environment';
import {TaiKhoanService} from "../../../shared/tai-khoan.service";
import {AccountantService} from "../../../shared/accountant.service";
import { ToastyService } from 'ng2-toasty';
import { DashboardComponent } from '../../dashboard.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  createSoHieuChungTuForm;
  updateSoHieuChungTuForm;
  loaiChungTus;
  alive = true;
  toChuc = environment.toChuc;
  soHieuChungTus = [];
  loaiChungTuMap: any = {};
  editIndex;
  deleteIndex;
  ajaxOptions_tkkt;
  options_tkkt;
    page = 1;
    pages;
    total_page = [];
    total;
    min;
    max;
    doi_tuong;
    doituongMap: any = {};
  constructor(
    private loaiChungTuService: LoaiChungTuService,
    private soHieuChungTuService: SoHieuChungTuService,
    private taiKhoanService: AccountantService,
    private toastService: ToastyService, @Host() private parent: DashboardComponent,
    private accountantService: AccountantService
  ) { }

  ngOnInit() {
      this.ajaxOptions_tkkt = {
          url: this.taiKhoanService.searchAccountantUrl,
          dataType: 'json',
          delay: 250,
          cache: false,
          data: (params: any) => {
              if (params.term) {
                  if (params.term.length >= 3) {
                      return {
                          key_word: params.term
                      };
                  }
              }
          },
          processResults: (res: any, params: any) => {
              return {
                  results: $.map(res, function (obj) {
                      return { id: obj.id, text: obj.so_hieu_tai_khoang };
                  })
              };
          },
      };

      this.options_tkkt = {
          ajax: this.ajaxOptions_tkkt,
          placeholder: 'Tìm kiếm',
          language: {
              noResults: function(){
                  return '<a data-toggle="modal" data-target="#add_accountant"> ' +
                      '<i class="fa fa-plus-square" aria-hidden="true"></i> Thêm mới</a>';
              }
          },
          escapeMarkup: function (markup) {
              return markup;
          }
      };

    this.createSoHieuChungTuForm = new FormGroup({
      so_hieu_chung_tu: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten_chung_tu: new FormControl(null, {
        validators: [Validators.required]
      }),
      muc_dich_su_dung: new FormControl(null, {
        // validators: [Validators.required]
      }),
      tai_khoang_no_id: new FormControl(null, {
        validators: []
      }),
      tai_khoang_co_id: new FormControl(null, {
        validators: []
      }),
      loai_chung_tu_id: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      })
    });

    this.updateSoHieuChungTuForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      so_hieu_chung_tu: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten_chung_tu: new FormControl(null, {
        validators: [Validators.required]
      }),
      muc_dich_su_dung: new FormControl(null, {
        // validators: [Validators.required]
      }),
      tai_khoang_no_id: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      }),
      tai_khoang_co_id: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      }),
      loai_chung_tu_id: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      })
    });

      this.loaiChungTuService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe(res => {
      if (res) {
        this.loaiChungTus = res;
        this.loaiChungTus.forEach((val: any) => {
          this.loaiChungTuMap[val.id] = val;
        });
            this.accountantService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe(resDT => {
            if (resDT) {
                this.doi_tuong = resDT;
                this.doi_tuong.forEach((val: any) => {
                    this.doituongMap[val.id] = val;
                });
                this.soHieuChungTuService.pagination(this.page).takeWhile(() => this.alive).subscribe((soHieuRes: any) => {
                    if (soHieuRes) {
                        this.soHieuChungTus = soHieuRes.data;
                        this.total = soHieuRes.total;
                        this.page = soHieuRes.current_page;
                        this.pages = soHieuRes.last_page;
                        if ( soHieuRes.last_page > 1 ) {
                            this.min = Math.max(this.page - 4, 1);
                            this.max =  Math.min(this.page + 4 ,  this.total);
                            for (let i =  this.min; i <= this.max; i++) {
                                this.total_page.push(i);
                            }
                        }
                    }



                });


            }
          });

      }
    });
  }
    show_page(index) {

        this.page = index;
        this.soHieuChungTuService.pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                this.soHieuChungTus = res.data;
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

  changeTaiKhoanNo(value) {
      console.log(value.value);
      this.createSoHieuChungTuForm.tai_khoang_no_id = value.value;
      this.updateSoHieuChungTuForm.tai_khoang_no_id = value.value;
  }

  changeTaiKhoanCo(value) {
      this.createSoHieuChungTuForm.tai_khoang_co_id = value.value;
      this.updateSoHieuChungTuForm.tai_khoang_co_id = value.value;
  }

  onCreateSubmit(event) {
    event.preventDefault();
    const data = this.createSoHieuChungTuForm.value;
    data.tai_khoang_co_id = this.createSoHieuChungTuForm.tai_khoang_co_id;
    data.tai_khoang_no_id = this.createSoHieuChungTuForm.tai_khoang_no_id;
    data.to_chuc_id = this.toChuc.id;

    this.soHieuChungTuService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.soHieuChungTus.push(res);
      (<any>$('#add_documents')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  openEdit(index) {
      this.updateSoHieuChungTuForm.get('id').patchValue(this.soHieuChungTus[index].id);
      this.updateSoHieuChungTuForm.get('so_hieu_chung_tu').patchValue(this.soHieuChungTus[index].so_hieu_chung_tu);
      this.updateSoHieuChungTuForm.get('ten_chung_tu').patchValue(this.soHieuChungTus[index].ten_chung_tu);
      this.updateSoHieuChungTuForm.get('muc_dich_su_dung').patchValue(this.soHieuChungTus[index].muc_dich_su_dung);
      this.updateSoHieuChungTuForm.get('tai_khoang_no_id').patchValue(this.soHieuChungTus[index].tai_khoang_no_id);
      this.updateSoHieuChungTuForm.get('tai_khoang_co_id').patchValue(this.soHieuChungTus[index].tai_khoang_co_id);
      this.updateSoHieuChungTuForm.get('loai_chung_tu_id').patchValue(this.soHieuChungTus[index].loai_chung_tu_id);
      this.updateSoHieuChungTuForm.tai_khoang_no_id = this.soHieuChungTus[index].tai_khoang_no_id;
      this.updateSoHieuChungTuForm.tai_khoang_co_id = this.soHieuChungTus[index].tai_khoang_co_id;


      this.editIndex = index;
  }

  onUpdate(event) {
    event.preventDefault();
    const data = this.updateSoHieuChungTuForm.value;
      data.tai_khoang_co_id = this.updateSoHieuChungTuForm.tai_khoang_co_id;
      data.tai_khoang_no_id = this.updateSoHieuChungTuForm.tai_khoang_no_id;
    data.to_chuc_id = this.toChuc.id;
    console.log(data);

    this.soHieuChungTuService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.soHieuChungTus[this.editIndex] = res;
      (<any>$('#edit_documents')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  onDelete() {
    const data: any = {};
    data.id = this.soHieuChungTus[this.deleteIndex].id;
    data.to_chuc_id = this.toChuc.id;

    this.soHieuChungTuService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.soHieuChungTus.splice(this.deleteIndex, 1);
      (<any>$('#delete_documents')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.success(this.parent.toastOptions('Thất bại', err.error));
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

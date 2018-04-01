import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {PhieuDeNghiService} from '../../../shared/phieu-de-nghi.service';
import {LinhKienService} from "../../../shared/linh-kien.service";
import {KhoService} from "../../../shared/kho.service";
import {AuthService} from "../../../shared/auth.service";
import {DateService} from "../../../shared/date.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-dsphieudnvt',
  templateUrl: './dsphieudnvt.component.html',
  styleUrls: ['./dsphieudnvt.component.scss']
})
export class DsphieudnvtComponent implements OnInit, OnDestroy {
    user = environment.user;
    toChuc = environment.toChuc;
    phieuDeNghi = [];
    alive = true;
    page = 1;
    pages;
    total_page = [];
    total;
    editIndex;
    deleteIndex;
    min ;
    max;
    status_phieu_de_nghi_lk = environment.status_phieu_de_nghi_lk;
    phieu_de_nghi_id;
    openAddLK = false;
    me;
    tram_bao_hanh_id;
    trung_tam_bao_hanh;
    kho_tram_id;
    kho_tram;
    from;
    to;
    startDate =  new Date('2018-01-01');
    endDate =  new Date();
    kho_trung_tam_id;
    khoNhap;
    statusArr = [];
    trang_thai = 'all';
    bsConfig = {
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
    };
    constructor(
      private phieuDeNghiService: PhieuDeNghiService,
      private linhkien: LinhKienService,
      private khoService: KhoService,
      private authService: AuthService,
      private dateService: DateService,
      private router: Router,


  ) { }

  ngOnInit() {

      for (const key in this.status_phieu_de_nghi_lk) {
          if (this.status_phieu_de_nghi_lk.hasOwnProperty(key)) {
              const itemStatus = { id: key, text: this.status_phieu_de_nghi_lk[key]};
              this.statusArr.push(itemStatus);
          }
      }

      this.khoService.khoSelected.subscribe((res: any ) => {
          if (res.length) {
              this.khoNhap = res.find(x => x.loai_kho === environment.loai_kho.kho_tot);
              if (this.khoNhap.tram_bao_hanh_id > 0) {
                  this.kho_tram_id = this.khoNhap.id;
                  this.kho_trung_tam_id = 0;

              } else {
                  this.kho_trung_tam_id = this.khoNhap.id;
                  this.kho_tram_id = 0;


              }
              console.log(this.khoNhap);

              const startDate = this.dateService.getDateString(this.startDate);
              const endDate = this.dateService.getDateString(this.endDate);
              this.phieuDeNghiService.get_pagination(this.toChuc.id, this.page, this.kho_tram_id,
                  this.kho_trung_tam_id, this.trang_thai, startDate, endDate)
                  .takeWhile(() => this.alive).subscribe((resDN: any) => {
                  this.phieuDeNghi = resDN.data;
                  this.total = resDN.total;
                  this.page = resDN.current_page;
                  this.pages = resDN.last_page;
                  this.min = Math.max(this.page - 4, 1);
                  this.max = Math.min(this.page + 4, this.pages);
                  if (this.pages > 1) {
                      this.total_page = [];
                      for (let i = this.min; i <= this.max; i++) {
                          this.total_page.push(i);
                      }
                  }
              });

          }
      });
  }
    openPDN(id) {
        this.router.navigateByUrl('/dashboard/don-de-nghi-cap-vat-tu?id=' + id.toString());
    }
    submitSearch(event) {
        console.log(this.trang_thai);

        const startDate = this.dateService.getDateString(this.startDate);
        const endDate = this.dateService.getDateString(this.endDate);
        this.khoService.khoSelected.subscribe((res: any ) => {
            if (res.length) {
                this.khoNhap = res.find(x => x.loai_kho === environment.loai_kho.kho_tot);
                if (this.khoNhap.tram_bao_hanh_id > 0) {
                    this.kho_tram_id = this.khoNhap.id;
                    this.kho_trung_tam_id = 0;

                } else {
                    this.kho_trung_tam_id = this.khoNhap.id;
                    this.kho_tram_id = 0;


                }
                console.log(this.khoNhap);
                this.phieuDeNghiService.get_pagination(this.toChuc.id, this.page, this.kho_tram_id,
                    this.kho_trung_tam_id, this.trang_thai, startDate, endDate)
                    .takeWhile(() => this.alive).subscribe((resDN: any) => {
                    this.phieuDeNghi = resDN.data;
                    this.total = resDN.total;
                    this.page = resDN.current_page;
                    this.pages = resDN.last_page;
                    this.min = Math.max(this.page - 4, 1);
                    this.max = Math.min(this.page + 4, this.pages);
                    if (this.pages > 1) {
                        this.total_page = [];
                        for (let i = this.min; i <= this.max; i++) {
                            this.total_page.push(i);
                        }
                    }
                });

            }
        });


    }
    change_status($event) {
        console.log($event);
        this.trang_thai = $event;

    }
    show_page(index) {
        this.page = index;
        const startDate = this.dateService.getDateString(this.startDate);
        const endDate = this.dateService.getDateString(this.endDate);
        this.phieuDeNghiService.get_pagination(this.toChuc.id, this.page, this.kho_tram_id,
            this.kho_trung_tam_id, this.trang_thai, startDate, endDate)
            .takeWhile(() => this.alive).subscribe((res: any) => {
                this.phieuDeNghi = res.data;
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
    onDeleteDNSubmit() {
        const data: any = {};
        data.id = this.phieuDeNghi[this.deleteIndex].id;
        this.linhkien.deletePDN(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.phieuDeNghi.splice(this.deleteIndex, 1);
            (<any>$('#delete_pdn')).modal('hide');
        }, err => console.log(err));
    }
    OpenAddLK() {
        this.openAddLK = true;

    }
    openDNEdit(index) {
        this.phieu_de_nghi_id = this.phieuDeNghi[index].id;
        this.openAddLK = false;
        this.editIndex = index;

        setTimeout(() => {
            this.openAddLK = true;
            (<any>$('#add_edit_lk')).modal('show');
        }, 200);
        setTimeout(() => {
            (<any>$('#add_edit_lk')).modal('show');
        }, 400);


        setTimeout(() => {
            (<any>$('#add_edit_lk')).modal('show');
        }, 400);
    }
    ngOnDestroy(): void {
        this.alive = false;
    }
}

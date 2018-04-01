import { Component, OnInit } from '@angular/core';
import {PhieuSuaChuaService} from '../../../shared/phieu-sua-chua.service';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-pbhdsc',
  templateUrl: './pbhdsc.component.html',
  styleUrls: ['./pbhdsc.component.scss']
})
export class PbhdscComponent implements OnInit {
     PhieuSuaChua;
    user = environment.user;
    toChuc = environment.toChuc;
    alive = true;
    page = 1;
    pages;
    total_page = [];
    total;
    deleteIndex;
    min ;
    max;
    trang_thai = 0;
    loai_hinh_dv= environment.loai_hinh_dv;
    uu_tien= environment.uu_tien;
    status= environment.status_psc;
    constructor(
      private phieuSuaChuaService: PhieuSuaChuaService
  ) { }

  ngOnInit() {
      this.phieuSuaChuaService.get_pagination( this.toChuc.id, this.page, this.trang_thai).takeWhile(() => this.alive)
          .subscribe((res: any) => {
          this.PhieuSuaChua = res.data;
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

  }
    show_page(index) {
        this.page = index;
        this.phieuSuaChuaService.get_pagination( this.toChuc.id, this.page, 0).takeWhile(() => this.alive).subscribe((res: any) => {
            this.PhieuSuaChua = res.data;
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
    }


}

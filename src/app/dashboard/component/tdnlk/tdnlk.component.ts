import { Component, OnInit, Host } from '@angular/core';
import { TramBaoHanhService } from '../../../shared/tram-bao-hanh.service';
import { UserService } from '../../../shared/user.service';
import {DateService} from "../../../shared/date.service";
import {LinhKienService} from "../../../shared/linh-kien.service";
import {Router} from '@angular/router';

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';

@Component({
  selector: 'app-tdnlk',
  templateUrl: './tdnlk.component.html',
  styleUrls: ['./tdnlk.component.scss']
})
export class TdnlkComponent implements OnInit {

  constructor(
    private tramService: TramBaoHanhService, private userService: UserService,
    private dateService: DateService, private linhKienService: LinhKienService,
    private toastService: ToastyService,@Host() private parent: DashboardComponent,
    private router: Router
  ) { }

  loai_nhan_vien_bao_hanh = 4;
  searchForm;
  startDate;
  endDate;

  data_nhanvien_map;
  data_tram_map;
  listNoLinhKienXac;
  indexEdit;

  optionTram;
  ajaxOptionTram;
  optionsNhanVien;
  ajaxOptionNhanVien;

  noLinhKienEditObj = { so_luong: '', ghi_chu: '', id: ''};


  ngOnInit() {
    this.ajaxOptionTram = {
      url: this.tramService.searchUrl,
      dataType: 'json',
      delay: 250,
      cache: false,
      data: (params: any) => {
          return {
              key_word: params.term,
              token: JSON.parse(localStorage.getItem('sstoken')).access_token
          };
      },
      processResults: (res: any, params: any) => {
          this.data_tram_map = new Object();
          if (res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                  this.data_tram_map[res[i].id] = res[i];
              }
          }
          return {
              results: $.map(res, function (obj) {
                  // console.log('data', obj);
                  return { id: obj.id, text: obj.ten };
              })
          };
      },
    };
    this.optionTram = {
      ajax: this.ajaxOptionTram,
      placeholder: 'Tìm kiếm',
      language: {
          noResults: function(){
              return 'Không tồn tại';
          }
      },
      escapeMarkup: function (markup) {
          return markup;
      }
    };

    this.ajaxOptionNhanVien = {
      url: this.userService.searchNhanVienUrl,
      dataType: 'json',
      delay: 250,
      cache: false,
      data: (params: any) => {
          return {
              key_word: params.term,
              type: this.loai_nhan_vien_bao_hanh,
              token: JSON.parse(localStorage.getItem('sstoken')).access_token
          };
      },
      processResults: (res: any, params: any) => {
          this.data_nhanvien_map = new Object();
          if (res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                  this.data_nhanvien_map[res[i].id] = res[i];
              }
          }
          return {
              results: $.map(res, function (obj) {
                  // console.log('data', obj);
                  return { id: obj.id, text: obj.name };
              })
          };
      },
    };

    this.optionsNhanVien = {
      ajax: this.ajaxOptionNhanVien,
      placeholder: 'Tìm kiếm',
      language: {
          noResults: function(){
              return 'Không tồn tại';
          }
      },
      escapeMarkup: function (markup) {
          return markup;
      }
    };

    this.searchForm = {
      startDate: '', endDate: '',
      tram_bao_hanh_id: '', user_id: '', so_phieu: '', trang_thai: ''
    }
    this.search(null);
  }

  search(event) {
    //event.preventDefault();
    console.log(this.searchForm);
    if (this.startDate && this.endDate) {
      this.searchForm.startDate = this.dateService.getDateString(this.startDate);
      this.searchForm.endDate = this.dateService.getDateString(this.endDate);
    }
    this.linhKienService.getNoLinhKienXac(this.searchForm).subscribe((res: any) => {
      console.log(res);
      this.listNoLinhKienXac = res;
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }

  edit() {
    this.linhKienService.updateNoLinhKienXac(this.noLinhKienEditObj).subscribe((res: any) => {
      if(res) {
        console.log(res);
        (<any>$('#edit_no_lk')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        this.listNoLinhKienXac[this.indexEdit].so_luong_thu = this.noLinhKienEditObj.so_luong;
        this.listNoLinhKienXac[this.indexEdit].ghi_chu = this.noLinhKienEditObj.ghi_chu;
        if(this.noLinhKienEditObj.so_luong == '0') {
          this.listNoLinhKienXac[this.indexEdit].hoan_thanh_tra_xac = 0;
        }
      }
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }
  openPhieuSuaChua(id){
    this.router.navigateByUrl('/dashboard/tao-phieu-sua-chua?id='+ id.toString());
  }
  openEdit(i) {
    this.indexEdit = i;
    this.noLinhKienEditObj.id = this.listNoLinhKienXac[i].id;
    this.noLinhKienEditObj.so_luong = this.listNoLinhKienXac[i].so_luong_thu;
    this.noLinhKienEditObj.ghi_chu = this.listNoLinhKienXac[i].ghi_chu;
  }

  nhanDoiLinhKien(i) {
    const data = { so_luong: this.listNoLinhKienXac[i].so_luong_cap,
        id: this.listNoLinhKienXac[i].id
    };
    this.linhKienService.updateNoLinhKienXac(data).subscribe((res: any) => {
      if(res) {
        console.log(res);
        this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        this.listNoLinhKienXac[i].so_luong_thu = data.so_luong;
        this.listNoLinhKienXac[i].hoan_thanh_tra_xac = 1;
      }
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }

  changeTram(event){
    this.searchForm.tram_bao_hanh_id = event.value;
  }
  changeNhanVien(event){
    this.searchForm.user_id = event.value;
  }

}

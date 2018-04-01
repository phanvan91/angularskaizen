import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {KhoService} from '../../../shared/kho.service';
import {LinhKienService} from "../../../shared/linh-kien.service";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
    user = environment.user;
    toChuc = environment.toChuc;
    TonKho;
    alive = true;
    editform;
    page = 1;
    pages;
    total_page = [];
    total;
    min ;
    max;
    tram_id;
    ajaxOptions_lk;
    options_lk;
    data_lk;
    data_lk_map;
    linh_kien_id;
    khoNhap;
    sub;
    index;
    data_edit;
  constructor(
      private khoService: KhoService,
      private linhkien: LinhKienService
  ) { }

  ngOnInit() {
      this.editform = new FormGroup({
        id: new FormControl(null, {
          validators: [Validators.required]
        }),
        gia_ban: new FormControl(null, {
            validators: [Validators.required]
        }),
      });
      this.khoService.khoSelected.subscribe((resKho: any ) => {
          if (resKho.length) {
              this.khoNhap = resKho.find( x => x.loai_kho === environment.loai_kho.kho_tot );
              console.log(this.khoNhap);
              if (this.khoNhap.id > 0) {
                  this.khoService.getTonKhoTot(this.page, this.khoNhap.id, this.linh_kien_id )
                      .takeWhile(() => this.alive).subscribe((res: any) => {
                      console.log(res);
                      if (res) {
                          this.TonKho = res.data;
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

          }
      });
      this.ajaxOptions_lk = {
          url: this.linhkien.searchListUrl,
          dataType: 'json',
          delay: 250,
          cache: false,
          data: (params: any) => {
              if (params.term) {
                  if (params.term.length >= 3) {
                      return {
                          key_word: params.term,
                          kho_id: this.tram_id
                      };
                  }
              }
          },
          processResults: (res: any, params: any) => {
              this.data_lk = [];
              this.data_lk_map = new Object();
              if (res.length > 0) {
                  for (let i = 0; i < res.length; i++) {
                      this.data_lk_map[res[i].id] = res[i];


                  }
              }
              return {
                  results: $.map(res, function (obj) {
                      console.log('data', obj);
                      let text;
                      if ( obj.ma) {
                          text =  obj.ma + '-' + obj.ten;
                      } else {
                          text = obj.ten;

                      }
                      return { id: obj.id, text:text };
                  })
              };
          },
      };

      this.options_lk = {
          ajax: this.ajaxOptions_lk,
          placeholder: 'Xem theo linh kiện',
          language: {
              noResults: function(){
                  return 'Không tồn tại';
              }
          },
          escapeMarkup: function (markup) {
              return markup;
          }
      };

  }
    changeLinhKien(e: any) {
        this.linh_kien_id = e.value;
        if (this.khoNhap.id > 0) {

            this.khoService.getTonKhoTot(this.page, this.khoNhap.id, this.linh_kien_id)
                .takeWhile(() => this.alive).subscribe((res: any) => {

                if (res) {
                    this.TonKho = res.data;
                    this.total = res.total;
                    this.page = res.current_page;
                    this.pages = res.last_page;
                    this.min = Math.max(this.page - 4, 1);
                    this.max = Math.min(this.page + 4, this.pages);
                    if (this.pages > 1) {
                        this.total_page = [];
                        for (let i = this.min; i <= this.max; i++) {
                            this.total_page.push(i);
                        }
                    }
                }

            });
        }

    }
    show_page(index) {
        this.page = index;
        this.khoService.getTonKhoTot(this.page, this.khoNhap.id, this.linh_kien_id).takeWhile(() => this.alive).subscribe((res: any) => {
            this.TonKho = res.data;
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
    openedit(item,i){
      const edit = item;
      const i_d = this.editform.get('id').patchValue(edit.linh_kien_id);
      const don_gia = this.editform.get('gia_ban').patchValue(edit.gia_ban);
      this.index = i;
    }
    onSubmitEditData(event){
      event.preventDefault();
      const dataedit = this.editform.value;
      this.sub = this.khoService.update_don_gia(dataedit).subscribe(data => {
        this.data_edit = data;
         this.TonKho[this.index].gia_ban = this.data_edit.gia_ban;
         (<any>$('#edit')).modal('hide');
      },error =>{
        console.log(error);
      });
    }
}

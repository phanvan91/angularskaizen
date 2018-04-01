import { HuongKhacPhucService } from '../../../shared/huong-khac-phuc.service';
import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import {TrungTamBaoHanhService} from '../../../shared/trung-tam-bao-hanh.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {BangTinhCongSuaChuaService} from '../../../shared/bang-tinh-cong-sua-chua.service';

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';

import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-btcsc',
  templateUrl: './btcsc.component.html',
  styleUrls: ['./btcsc.component.scss']
})
export class BtcscComponent implements OnInit, OnDestroy {


  tpbhs = [];
  tpbhsMap: any = {};
  alive = true;
  createBTCSCForm;
  updateBTCSCForm;
  toChuc = environment.toChuc;
  btcscs;
  editIndex;
  deleteIndex;
  BTCSC;
  tTamBHUpload;
    page = 1;
    pages;
    total_page = [];
    total;
    min ;
    max;
  huongKhacPhucList = [];

  constructor(
    private trungTapBaoHanhService: TrungTamBaoHanhService,
    private bangTinhCongSuaChuaService: BangTinhCongSuaChuaService,
    private huongKhacPhucService: HuongKhacPhucService,
    private toastService: ToastyService, @Host() private parent: DashboardComponent
  ) { }

  ngOnInit() {
    this.huongKhacPhucService.getAll().subscribe((res: any) => { this.huongKhacPhucList = res; });
    this.createBTCSCForm = new FormGroup({
      trung_tam_bao_hanh_id:  new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      }),
      ma:  new FormControl(null, {
        validators: [Validators.required]
      }),
      ten:  new FormControl(null, {
        validators: [Validators.required]
      }),
      don_gia:  new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.updateBTCSCForm = new FormGroup({
      id:  new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      }),
        trung_tam_bao_hanh_id:  new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      }),
      ma:  new FormControl(null, {
        validators: [Validators.required]
      }),
      ten:  new FormControl(null, {
        validators: [Validators.required]
      }),
      don_gia:  new FormControl(null, {
        validators: [Validators.required]
      })
    });


      this.bangTinhCongSuaChuaService.get_pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
          this.trungTapBaoHanhService.all().takeWhile(() => this.alive).subscribe((resTT: any) => {
              if (resTT.length) {
                  console.log(resTT);
                  this.tpbhs = resTT;
                  this.tpbhs.forEach(val => {
                      this.tpbhsMap[val.id] = val;
                  });
                  this.btcscs = res.data;
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



      });

  }
    show_page(index) {
        this.page = index;
        this.bangTinhCongSuaChuaService.get_pagination(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.btcscs = res.data;
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

  onCreate(event) {
    event.preventDefault();
    const data = this.createBTCSCForm.value;
    data.to_chuc_id = this.toChuc.id;
    data.don_gia = this.createBTCSCForm.value.don_gia.replace(/[^0-9.]/g, '');
    this.bangTinhCongSuaChuaService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.btcscs.push(res);
      (<any>$('#add_btcsc')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }

  openEdit(index) {
    this.updateBTCSCForm.get('id').patchValue(this.btcscs[index].id);
    this.updateBTCSCForm.get('trung_tam_bao_hanh_id').patchValue(this.btcscs[index].trung_tam_bao_hanh_id);
    this.updateBTCSCForm.get('ma').patchValue(this.btcscs[index].ma_huong_khac_phuc);
    this.updateBTCSCForm.get('ten').patchValue(this.btcscs[index].ten_huong_khac_phuc);
    this.updateBTCSCForm.get('don_gia').patchValue(this.btcscs[index].don_gia);
    this.editIndex = index;
  }

  onUpdate(event) {
    event.preventDefault();
    const data = this.updateBTCSCForm.value;
    data.to_chuc_id = this.toChuc.id;
    data.don_gia = this.convertToDecimal(data.don_gia);

    this.bangTinhCongSuaChuaService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.btcscs[this.editIndex] = res;
      (<any>$('#edit_btcsc')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }

  onDelete() {
    const data: any = {};
    data.id = this.btcscs[this.deleteIndex].id;
    data.to_chuc_id = this.toChuc.id;
    data.don_gia = this.convertToDecimal(data.don_gia);

    this.bangTinhCongSuaChuaService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.btcscs.splice(this.deleteIndex, 1);
      (<any>$('#delete_btcsc')).modal('hide');
      this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }

  convertToDecimal(str) {
    return parseFloat(('' + str).replace(/[^0-9.]/g, ''));
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  export_excel_dslk() {
      this.bangTinhCongSuaChuaService.all().takeWhile(() => this.alive).subscribe(res => {
          if (res) {
              this.BTCSC = res;
              let list = this.BTCSC;
              let innerContent = ``;

              for (let i = 0; i < list.length; i++) {
                  let tTBh = this.tpbhs.find(x=>x.id == list[i].trung_tam_bao_hanh_id);
                  innerContent +=`
            <tr>
                <td>`+list[i].ma_huong_khac_phuc+`</td>
                <td>`+list[i].ten_huong_khac_phuc+`</td>
                <td>`+list[i].don_gia+`</td>
                <td>`+tTBh.ma+`</td>
            </tr>
        `;
              }
              let content = `
        <tr>
            <th colspan='7'>Danh sách bảng tính công sữa chửa</th>
        </tr>
        <tr>
            <th>Mã sửa chữa</th>
            <th>Tên sửa chữa</th>
            <th>Đơn giá</th>
            <th>Mã trung tâm bảo hành</th>
        </th>
        `+innerContent;
              const table = document.createElement('table');
              table.innerHTML = content;

              // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
              const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

              /* generate workbook and add the worksheet */
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

              // /* save to file */
              const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
              const d = new Date();
              let stringName = 'ds_bang_tcsc_'+d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+d.getHours()+'.xlsx';
              fileSaver.saveAs(new Blob([wbout]), stringName);
          }
      });

  }
  import_excel(event) {
      const target = event.target;
      if (target.files.length !== 1) throw alert('Cannot use multiple files');
      var extension = target.files[0].name.substr( (target.files[0].name.lastIndexOf('.') +1) );
      var extFilter = ['xlsx','xls','csv'];
      if(extFilter.indexOf(extension)==-1) { alert('Định dạng file phải là excel'); return;}

      const reader: FileReader = new FileReader();
      let data;
      const rowDataStart = 2;
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* push data */
        data = (XLSX.utils.sheet_to_json(ws, {header: 1}));

        const rowDataStart = 2;
          let dataImport = [];
          for (let i = rowDataStart; i < data.length; i++) {
              
              if(data[i].length>0){
                  let btcscItem = {
                    'ma': data[i][0],
                    'ten': data[i][1],
                    'don_gia': data[i][2]?data[i][2]:0,};
                  dataImport.push(btcscItem);
              }
          }
          const dataPush = { data: dataImport, trung_tam_bao_hanh_id: this.tTamBHUpload};

          console.log(dataPush);
          this.bangTinhCongSuaChuaService.upload(dataPush).subscribe(res=>{
              if(res){
                this.bangTinhCongSuaChuaService.all().subscribe(res => {
                  this.bangTinhCongSuaChuaService.setBangTinhCongSuaChuaSource(res);
                  this.toastService.success(this.parent.toastOptions('Upload', 'thành công.'));
                  (<any>$('#open_upload')).modal('hide');
                  this.ngOnInit();
                });
              }},
              error => {
                console.log(error);
                this.toastService.error(this.parent.toastOptions('Upload', 'thất bại.'));
              });
        
      };
      reader.readAsBinaryString(target.files[0]);
  }
  triggerFile() {
      $('#file').click();
  }
  onChangeMaSuaChua(type) {
    if (type == 'create') {
      const ma = this.createBTCSCForm.value.ma;
      const hkp = this.huongKhacPhucList.find(x => x.ma_huong_khac_phuc == ma);
      this.createBTCSCForm.get('ten').patchValue(hkp.mo_ta);
    } else {
      const ma = this.updateBTCSCForm.value.ma;
      const hkp = this.huongKhacPhucList.find(x => x.ma_huong_khac_phuc == ma);
      this.updateBTCSCForm.get('ten').patchValue(hkp.mo_ta);
    }
  }
}

import { Component, OnInit, Host } from '@angular/core';
import { TrungTamBaoHanhService } from '../../../shared/trung-tam-bao-hanh.service';
import { TramBaoHanhService } from '../../../shared/tram-bao-hanh.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {environment} from '../../../../environments/environment';
import { ToastyService } from 'ng2-toasty';
import { DashboardComponent } from '../../dashboard.component';
import { HeaderComponent } from '../../component/header/header.component';
import {ConfigService} from '../../../shared/config.service';

import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {

  tTamBaoHanhList = [];
  tramBaoHanhList = [];
  tramBaoHanhForm;
  tramBaoHanhEditForm;
  tTamIndex;
  alive = true;
  deleteIndex;
  editIndex;
  loaiTram = environment.loai_tram;

  tinhList = [];
  tinhMap = [];
  edit_city;
  editCity;
    page = 1;
    pages;
    total_page = [];
    total;
    min ;
    max;
  constructor(
    private toastService: ToastyService, @Host() private parent: DashboardComponent, private configService: ConfigService,
    private tTamBaoHanhService: TrungTamBaoHanhService, private tramBaoHanhService: TramBaoHanhService) { }

  ngOnInit() {
    this.configService.getCityProvince().subscribe((res: any) => {
      this.tinhList = [];
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          this.tinhList.push(res[key]);
          this.tinhMap[res[key].code] = res[key].name;
        }
      }
     });

    this.tramBaoHanhService.get_pagination(1).takeWhile(() => this.alive).subscribe((res: any) => {
      if (res) {
        this.tramBaoHanhList = res.data;
        // console.log(this.tramBaoHanhList);
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
    this.tTamBaoHanhService.all().takeWhile(() => this.alive).subscribe((res: any) => {
      if (res.length) {
        this.tTamBaoHanhList = res;
        // console.log(res);
      }
    });
    this.tramBaoHanhForm = new FormGroup({
      ma: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten: new FormControl(null, {
        validators: [Validators.required]
      }),
      dia_chi: new FormControl(null, {
        validators: [Validators.required]
      }),
      trung_tam_bao_hanh_id: new FormControl(null, {
        validators: [Validators.required]
      }),

      loai_tram: new FormControl(1, {
        validators: [Validators.required]
      }),
      so_dien_thoai: new FormControl(null, {
        validators: null
      }),
      tinh: new FormControl(null, {
        validators: null
      }),
      don_vi_van_chuyen: new FormControl(null, {
        validators: null
      }),
      nguoi_dai_dien: new FormControl(null,{
        validators: null
      })
    });
    this.tramBaoHanhEditForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten: new FormControl(null, {
        validators: [Validators.required]
      }),
      dia_chi: new FormControl(null, {
        validators: [Validators.required]
      }),
      cong_ty_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      trung_tam_bao_hanh_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      loai_tram: new FormControl(null, {
        validators: [Validators.required]
      }),
      so_dien_thoai: new FormControl(null, {
        validators: null
      }),
      tinh: new FormControl(null, {
        validators: null
      }),
      don_vi_van_chuyen: new FormControl(null, {
        validators: null
      }),
      nguoi_dai_dien: new FormControl(null,{
        validators: null
      })
    });
  }
    show_page(index) {
        this.page = index;
        this.tramBaoHanhService.get_pagination( this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.tramBaoHanhList = res.data;
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

    changeCity(event) {
    this.tramBaoHanhForm.get('tinh').patchValue(event.value);
  }
  changeEditCity(event) {
    this.tramBaoHanhEditForm.get('tinh').patchValue(event.value);
  }
  tTamBaoHanhName(id) {
    if (!this.tTamBaoHanhList.length) { return false; }
    return this.tTamBaoHanhList.find(x => x.id == id).ten;
  }

  onSubmitAddData(event){
    event.preventDefault();
    const data = this.tramBaoHanhForm.value;
    const tTamBH = this.tTamBaoHanhList.find(x=>x.id==data.trung_tam_bao_hanh_id);
    if(!tTamBH){
      this.toastService.error(this.parent.toastOptions('Thêm thất bại', 'Chưa chọn trung tâm bảo hành'));
      return ;
    }
    data.cong_ty_id = tTamBH.cong_ty_id;

    this.tramBaoHanhService.create(data).subscribe(res=>{
      if(res){
        console.log(res);
        this.tramBaoHanhList.push(res);
        (<any>$('#add_station')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Thêm thành công', ''));
        this.parent.initHeader();
      }
    }, error => { this.toastService.error(this.parent.toastOptions('Thêm thất bại', error.error));  });
  };

  onSubmitEditData(event){
    event.preventDefault();
    const data = this.tramBaoHanhEditForm.value;
    const tTamBH = this.tTamBaoHanhList.find(x=>x.id==data.trung_tam_bao_hanh_id);

    data.cong_ty_id = tTamBH.cong_ty_id;
    console.log(data.cong_ty_id);
    this.tramBaoHanhService.update(data).subscribe(res=>{
      if(res){
        console.log(res);
        this.tramBaoHanhList[this.editIndex] = res;
        (<any>$('#edit_station')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Sửa thành công', ''));
        this.parent.initHeader();
      }
    }, error => { this.toastService.error(this.parent.toastOptions('Thao tác thất bại', error.error));  });
  }
  onSubmitDeleteData(){
    let obj = this.tramBaoHanhList[this.deleteIndex];
    let data = { id: obj.id, cong_ty_id: obj.cong_ty_id};
    this.tramBaoHanhService.delete(data).subscribe(res=>{
      if(res){
        this.tramBaoHanhList.splice(this.deleteIndex, 1);
        this.deleteIndex = null;
        (<any>$('#delete_station')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Xoá thành công', ''));
        this.parent.initHeader();
      }
    },error => {  this.toastService.error(this.parent.toastOptions('Thao tác thất bại', error.error));  })
  }
  openEditTramBaoHanh(i){
    this.editIndex = i;
    this.editCity = false;
    let obj = this.tramBaoHanhList[i];
    this.tramBaoHanhEditForm.get('id').patchValue(obj.id);

    this.tramBaoHanhEditForm.get('cong_ty_id').patchValue(obj.cong_ty_id);
    this.tramBaoHanhEditForm.get('ma').patchValue(obj.ma);
    this.tramBaoHanhEditForm.get('ten').patchValue(obj.ten);
    this.tramBaoHanhEditForm.get('dia_chi').patchValue(obj.dia_chi);
    this.tramBaoHanhEditForm.get('so_dien_thoai').patchValue(obj.so_dien_thoai);
    this.tramBaoHanhEditForm.get('trung_tam_bao_hanh_id').patchValue(obj.trung_tam_bao_hanh_id);
    this.tramBaoHanhEditForm.get('loai_tram').patchValue(obj.loai_tram);

    this.tramBaoHanhEditForm.get('don_vi_van_chuyen').patchValue(obj.don_vi_van_chuyen);
    this.tramBaoHanhEditForm.get('nguoi_dai_dien').patchValue(obj.nguoi_dai_dien);
    this.tramBaoHanhEditForm.get('tinh').patchValue(obj.tinh);
    this.edit_city = this.tinhMap[obj.tinh];
    setTimeout(() => {
      this.editCity = true;
    }, 300);
    console.log(this.edit_city);
  }
  triggerFile() {
    $('#file').click();
  }
  importExcel(event) {
    let tTamBH = this.tTamBaoHanhList[this.tTamIndex];

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
        let maTrams = [];
        for (let i = rowDataStart; i < data.length; i++) {

            if(data[i].length>0){
              let loai_tram = this.loaiTram["1"]==data[i][1]?1:2;
                let tramItem = {
                  'ma': data[i][0],
                  'ten': data[i][2],
                  'loai_tram': loai_tram,
                  'so_dien_thoai': data[i][4]?data[i][4]:' ',
                  'dia_chi': data[i][5]
                };
                dataImport.push(tramItem);
                maTrams.push(data[i][0]);
            }
        }
        const dataPush = { data: dataImport, trung_tam_bao_hanh_id: tTamBH.id, cong_ty_id: tTamBH.cong_ty_id, ma: maTrams};

        this.tramBaoHanhService.import(dataPush).subscribe((res: any)=>{
            console.log(res);
            (<any>$('#open_upload')).modal("hide");
            this.ngOnInit();
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
          }, error =>{
            (<any>$('#open_upload')).modal("hide");
            console.log(error);
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', error.error));
          }
        )
    };
    reader.readAsBinaryString(target.files[0]);
  }

  exportExcel() {
     // let tableContent = document.getElementById('table-access');
    // let table = document.createElement('table');
    // table.innerHTML = tableContent.innerHTML;
    // $(table).find('.btn').remove();
    let list = this.tramBaoHanhList;
    let innerContent = ``;

    for (let i = 0; i < list.length; i++) {
      console.log(list[i]);
      let tTBh = this.tTamBaoHanhList.find(x=>x.id == list[i].trung_tam_bao_hanh_id);
      let sdt = list[i].so_dien_thoai?list[i].so_dien_thoai:'';
      innerContent +=
      `<tr>`+
        `<td>`+ list[i].ma +`</td>` +
        `<td>`+ this.loaiTram[list[i].loai_tram] +`</td>` +
        `<td>`+ list[i].ten +`</td>` +
        `<td>`+ tTBh.ten +`</td>` +
        `<td>`+ sdt +`</td>` +
        `<td>`+ list[i].dia_chi +`</td>` +
      `</tr>'`;
    }
    let content = `
        <tr>
            <th colspan='6'>Danh sách trạm bảo hành</th>
        </tr>
        <tr>
            <th>Mã trạm</th>
            <th>Loại trạm</th>
            <th>Tên trạm</th>
            <th>Trung tâm bảo hành</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
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
    let stringName = 'ds_tram_bh_'+d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+d.getHours()+'.xlsx';
    fileSaver.saveAs(new Blob([wbout]), stringName);
  }

}

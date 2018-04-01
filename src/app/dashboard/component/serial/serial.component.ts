import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {SerialService} from '../../../shared/serial.service';
import {SanPhamService} from '../../../shared/san-pham.service';
import {NganhHangService} from '../../../shared/nganh-hang.service';
import {ModelService} from '../../../shared/model.service';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-serial',
  templateUrl: './serial.component.html',
  styleUrls: ['./serial.component.scss']
})
export class SerialComponent implements OnInit, OnDestroy  {
    user = environment.user;
    toChuc = environment.toChuc;
    Serials = [];
    Model = [];
    SanPhamAll;
    ModelAll;
    NganhHang = [];
    SerialAll = [];
    page = 1;
    pages;
    total_page = [];
    total;
    alive = true;
    editIndex;
    deleteIndex;
    server_url = environment.server_url;
    code;
    open = false;
    status= environment.status_serial;
    min;
    max;
  constructor(
      private serialService: SerialService,
      private sanPhamService: SanPhamService,
      private nganhHangService: NganhHangService,
      private modelService: ModelService,

  ) { }

  ngOnInit() {
      this.nganhHangService.all().takeWhile(() => this.alive).subscribe((res: any) => {
          if (res.length) {
              this.NganhHang = res;
          }
      });

      this.modelService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe(res => {
          if (res) {
              this.ModelAll = res;
          }
      });
      this.sanPhamService.all().takeWhile(() => this.alive).subscribe(res => {
          if (res) {
              this.SanPhamAll = res;
          }
      });

      this.serialService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
          this.Serials = res.data;
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
          for (let j = 0; j < this.Serials.length; j ++ ) {
              this.Serials[j].PBH = JSON.parse( this.Serials[j].PBH);
              const arr = [];
              for (const k in  this.Serials[j].PBH ) {
                  arr[k] =  this.Serials[j].PBH[k];
                   // console.log( this.Serials[j].PBH[k]);
              }
              this.Serials[j].PBH = arr;

          }

      });
  }
    show_page(index) {

        this.page = index;
        this.serialService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.Serials = res.data;
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
            for (let j = 0; j < this.Serials.length; j ++ ) {
                this.Serials[j].PBH = JSON.parse( this.Serials[j].PBH);
                const arr = [];
                for (const k in  this.Serials[j].PBH ) {
                    arr[k] =  this.Serials[j].PBH[k];
                    console.log( this.Serials[j].PBH[k]);
                }
                this.Serials[j].PBH = arr;

            }


        });
    }
    openEdit(index) {
        this.open = false;
        this.editIndex = index;

        setTimeout(() => {
            this.open = true;
            (<any>$('#edit_serial')).modal('show');
        }, 200);
        setTimeout(() => {
            (<any>$('#edit_serial')).modal('show');
        }, 400);


        setTimeout(() => {
          (<any>$('#edit_serial')).modal('show');
        }, 400);

    }
    onDeleteSubmit() {
        const data: any = {};
        data.id = this.Serials[this.deleteIndex].id;
        data.to_chuc_id = this.toChuc.id;

        this.serialService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.Serials.splice(this.deleteIndex, 1);
            (<any>$('#delete_serial')).modal('hide');
        }, err => console.log(err));
    }
    export_excel_dslk() {
        this.serialService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res.length) {
                this.SerialAll = res;
                const list = this.SerialAll;
                let innerContent = ``;
                console.log(list);

                for (let i = 0; i < list.length; i++) {
                    const nhomsp = this.SanPhamAll.find(x => x.id === list[i].san_pham_id);
                    const nhomngangh = this.NganhHang.find(x => x.id === list[i].nganh_hang_id);
                    const nhomModel = this.ModelAll.find(x => x.id === list[i].model_id);
                    if (list[i].trang_thai === 1) {
                        list[i].trang_thai = 'Chưa kích hoạt bảo hành';
                    }
                    if (list[i].trang_thai === 2) {
                        list[i].trang_thai = 'Còn bảo hành';

                    }
                    if (list[i].trang_thai === 3) {
                        list[i].trang_thai = 'Đang bảo hành';

                    }
                    if (list[i].trang_thai === 4) {
                        list[i].trang_thai = 'Hết bảo hành';

                    }
                    let arr = '';
                    const PBH = JSON.parse(list[i].PBH);
                    for (const k in PBH ) {
                        if (PBH[k] !== 'undefined') {
                            arr += PBH[k] + ',';
                        }
                    }
                    innerContent += `
                <tr>
                    <td>` + list[i].serial + `</td>
                    <td>` + list[i].trang_thai + `</td>
                    <td>` + nhomModel.ma + `</td>
                    <td>` + nhomsp.ma + `</td>
                    <td>` + nhomngangh.ma + `</td>
                    <td>` + list[i].ngay_san_xuat + `</td>
                    <td>` + list[i].ngay_xuat_kho + `</td>
                    <td>` + list[i].ngay_kich_hoat_bh + `</td>
                    <td>` + list[i].ngay_het_han + `</td>
                    <td>` + arr + `</td>
                </tr>
            `;
                }
                const content = `
            <tr>
                <th colspan='7'>Bảng thống kê danh sách Serial</th>
            </tr>
            <tr>
                <th>Serial</th>
                <th>Trạng thái</th>
                <th>Model</th>
                <th>Nhóm sản phẩm</th>
                <th>Ngành hàng</th>
                <th>Ngày sản xuất</th>
                <th>Ngày xuất kho</th>
                <th>Ngày kích hoạt bảo hành</th>
                <th>Ngày hết hạn bảo hành</th>
                <th>DS phiếu BH</th>

            </th>
            ` + innerContent;
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
         const stringName = 'ds_serial_' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() + '_' + d.getHours() + '.xlsx';
                fileSaver.saveAs(new Blob([wbout]), stringName);
            }
        });

    }
    import_excel(event) {
        document.getElementById('loader').style.display = 'block';

        const target = event.target;

        if (target.files.length !== 1) throw alert('Cannot use multiple files');
        const extension = target.files[0].name.substr( (target.files[0].name.lastIndexOf('.') + 1) );
        const extFilter = ['xlsx', 'xls'];
        if (extFilter.indexOf(extension) === -1) { alert('Định dạng file phải là excel'); return; }

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
            console.log(data);

            const dataPush = { data: data};

            this.serialService.importExcel(dataPush).subscribe((res: any) => {

                    if (res.length) {
                        document.getElementById('loader').style.display = 'none';
                        console.log(res);
                        location.reload(true);

                    }

                }
            , err => {
            });




        }
        reader.readAsBinaryString(target.files[0]);

    }
    replaceFormat(e) {
        return e.replace(/[',]/g, '');
    }
    importPortfolioFunction() {
        let fileUpload , reader, data, xhr, server_url, to_chuc_id;
        server_url = this.server_url;
        to_chuc_id = this.toChuc.id;
        const data_obj: any = {};
        document.getElementById('loader').style.display = 'block';
        fileUpload  =  document.getElementById('file')
        const fileName = fileUpload.value;
        const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext === 'csv' || ext === 'CSV') {
            if (typeof(FileReader) !== 'undefined') {
                reader = new FileReader();
                reader.onload = function (e) {
                        const string = e.target.result;
                        data = 'data=' + string + '&to_chuc_id=' + to_chuc_id + '';
                        xhr = new XMLHttpRequest();
                        xhr.open('POST', server_url + '/api/v1/serial-upload-csv', true);
                        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        xhr.onload = function () {
                            // do something to response
                            console.log(this.responseText);
                            if ( this.responseText) {
                                document.getElementById('loader').style.display = 'none';

                            }
                        };
                        xhr.send(data);

                }


                reader.readAsText(fileUpload.files[0]);
            } else {
                alert('This browser does not support HTML5.');
            }
        } else {
            alert('Đây không phải là file CSV');

        }
        this.serialService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.Serials = res.data;
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
            for (let j = 0; j < this.Serials.length; j ++ ) {
                this.Serials[j].PBH = JSON.parse( this.Serials[j].PBH);
                const arr = [];
                for (const k in  this.Serials[j].PBH ) {
                    arr[k] =  this.Serials[j].PBH[k];
                    // console.log( this.Serials[j].PBH[k]);
                }
                this.Serials[j].PBH = arr;

            }

        });



    }
    ngOnDestroy(): void {
        this.alive = false;
    }
}

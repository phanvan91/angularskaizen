import { Component, OnInit, Host } from '@angular/core';
import { HuongKhacPhucService } from '../../../shared/huong-khac-phuc.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NganhHangService } from '../../../shared/nganh-hang.service';
import { environment } from "../../../../environments/environment";
import { ToastyService } from 'ng2-toasty';
import { DashboardComponent } from '../../dashboard.component';

import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-surmount',
  templateUrl: './surmount.component.html',
  styleUrls: ['./surmount.component.scss']
})
export class SurmountComponent implements OnInit {
  user = environment.user;
  toChuc = environment.toChuc;
  alive = true;
  huongKhacPhucList = [];
  nganhHangList;
  nganhHangMap;
  huongKhacPhucEditForm;
  deleteIndex;
  editIndex;
  importForm;
  uploadForm: FormData;
  huongKhacPhucAll;
  page = 1;
  pages;
  total_page = [];
  total;
  min;
  max;
  constructor(private huongKhacPhucService: HuongKhacPhucService, private nganhHangService: NganhHangService,
    private toastService: ToastyService, @Host() private parent: DashboardComponent) { }

  ngOnInit() {
    this.importForm = new FormGroup({
      nganh_hang_id: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.uploadForm = new FormData();


    // });
    this.huongKhacPhucService.get_pagination(this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
      this.huongKhacPhucList = res.data;
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
    });
    this.huongKhacPhucEditForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      nganh_hang_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_huong_khac_phuc: new FormControl(null, {
        validators: [Validators.required]
      }),
      mo_ta: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.nganhHangService.all().subscribe((res: any) => {
      if (res.length) {
        this.nganhHangList = res;
        this.nganhHangMap = [];
        this.nganhHangList.forEach(element => {
          this.nganhHangMap[element.id] = element.ma;
        });
      }
    });
  }

  show_page(index) {
    this.page = index;
    this.huongKhacPhucService.get_pagination(this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
      this.huongKhacPhucList = res.data;
      this.total = res.total;
      this.pages = res.last_page;
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

  onSubmitEditData() {
    const data = this.huongKhacPhucEditForm.value;

    this.huongKhacPhucService.update(data).subscribe(res => {
      if (res) {
        this.huongKhacPhucList[this.editIndex] = res;
        (<any>$('#edit_surmount')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Sửa thành công', ''));
      }
    },error =>{
      this.toastService.error(this.parent.toastOptions('Sửa thất bại', ''));
    })
  }
  onSubmitDeleteData() {
    let obj = this.huongKhacPhucList[this.deleteIndex];
    let data = { id: obj.id };
    this.huongKhacPhucService.delete(data).subscribe(res => {
      if (res) {
        this.huongKhacPhucList.splice(this.deleteIndex, 1);
        this.deleteIndex = null;
        (<any>$('#delete_surmount')).modal('hide');
        this.toastService.success(this.parent.toastOptions('Xóa', 'thành công'));
      }
    }, error => { this.toastService.error(this.parent.toastOptions('Xóa', 'thất bại'));  })
  }

  openEditHuongKhacPhuc(i) {
    this.editIndex = i;
    let obj = this.huongKhacPhucList[i];
    this.huongKhacPhucEditForm.get('id').patchValue(obj.id);
    this.huongKhacPhucEditForm.get('nganh_hang_id').patchValue(obj.nganh_hang_id);
    this.huongKhacPhucEditForm.get('ma_huong_khac_phuc').patchValue(obj.ma_huong_khac_phuc);
    this.huongKhacPhucEditForm.get('mo_ta').patchValue(obj.mo_ta);
  }

  uploadExcel(event) {
    event.preventDefault();
    const data = this.importForm.value;
    this.uploadForm.append('nganh_hang_id', data.nganh_hang_id);

    this.huongKhacPhucService.import(this.uploadForm).takeWhile(() => this.alive).subscribe((res: any) => {
      res.forEach((val: any) => {
        this.huongKhacPhucList.push(val);
      });
      (<any>$('#open_upload')).modal('hide');
    }, err => {
      alert('Import error');
      console.log(err);
    });
  }

  import_excel(event) {
    const target = event.target;
    if (target.files.length !== 1) throw alert("Cannot use multiple files");
    var extension = target.files[0].name.substr(target.files[0].name.lastIndexOf(".") + 1);
    var extFilter = ["xlsx", "xls", "csv"];
    if (extFilter.indexOf(extension) == -1) { alert("Định dạng file phải là excel");  return; }

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
      const rowDataStart = 2;
      let dataImport = [];
      for (let i = rowDataStart; i < data.length; i++) {
        if (data[i].length > 0) {
          let nganhHang = this.nganhHangList.find(x => x.ma == data[i][2]);
          if (!nganhHang) {
            this.toastService.error(this.parent.toastOptions('Lỗi', 'Bổ sung đầy đủ ngành hàng trước khi upload')); return ;
          }
          let tthh = {
            'ma_huong_khac_phuc': data[i][0],
            'mo_ta': data[i][1],
            'nganh_hang_id': nganhHang.id
          };
          dataImport.push(tthh);
        }
      }
      const dataPush = { data: dataImport};

      this.huongKhacPhucService.import(dataPush).subscribe((res: any) => {
        this.toastService.success(this.parent.toastOptions('Upload', 'thành công.'));
        this.ngOnInit();
        (<any>$('#open_upload')).modal('hide');
      }, error => {
        this.toastService.error(this.parent.toastOptions('Error', error.error));
      });


    };
    reader.readAsBinaryString(target.files[0]);
  }
  triggerFile() {
    $('#file').click();
  }
  export_excel_hkp() {
      this.huongKhacPhucService.getAll().takeWhile(() => this.alive).subscribe((res: any) => {
          if (res.length > 0) {
              this.huongKhacPhucAll = res;
              let innerContent = ``;
              const data = this.huongKhacPhucAll;
              if (data.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                    let nganhHang = this.nganhHangList.find(x => x.ma == data[i].nganh_hang_id).ten;
                      innerContent +=
                          `<tr>` +
                          `<td>` + data[i].ma_huong_khac_phuc + `</td>` +
                          `<td>` + data[i].mo_ta + `</td>` +
                          `<td>` + nganhHang.ma + `</td>` +
                          `<td>` + nganhHang.ten + `</td>` +
                          `</tr>`;
                  }
                  const content = `
        <tr>
            <th colspan='7'>Danh sách hướng khắc phục</th>
        </tr>
        <tr>
            <th>Mã hướng khắc phục</th>
            <th>Mô tả</th>
            <th>Mã ngành</th>
            <th>Ngành hàng</th>
        </th>
        ` + innerContent;

                  const table = document.createElement('table');
                  table.innerHTML = content;

                  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
                  // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(content);

                  /* generate workbook and add the worksheet */
                  const wb: XLSX.WorkBook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

                  // /* save to file */
                  const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                  const d = new Date();
                  const stringName = 'ds_huong_khac_phuc_' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() + '_' + d.getHours() + '.xlsx';
                  fileSaver.saveAs(new Blob([wbout]), stringName);
                  this.toastService.success(this.parent.toastOptions('Xuất Excel', 'thành công'));
              }
          }
      });


  }


}

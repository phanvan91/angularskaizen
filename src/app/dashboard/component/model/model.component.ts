import {Component, Host, OnDestroy, OnInit} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {ModelService} from "../../../shared/model.service";
import {SanPhamService} from "../../../shared/san-pham.service";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import {DashboardComponent} from "../../dashboard.component";
import {ToastyService} from "ng2-toasty";
@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})

export class ModelComponent implements OnInit, OnDestroy  {
    user = environment.user;
    toChuc = environment.toChuc;
    server_url = environment.server_url;
    ModelAll;
    Models;
    SanPham;
    alive = true;
    page = 1;
    pages;
    total_page = [];
    total;
    modelEditForm;
    modelCreateForm;
    editIndex;
    deleteIndex;
    min;
    max;
    select = 1;
  constructor(
      private modelService: ModelService,
      private sanPhamService: SanPhamService,
      private toastService: ToastyService, @Host() private parent: DashboardComponent

  ) { }
  ngOnInit() {

      this.modelCreateForm = new FormGroup({
          id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ma: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ten: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          san_pham_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          to_chuc_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          kich_hoat: new FormControl(null, {
              validators: [ Validators.required ]
          }),
      });
      this.modelEditForm = new FormGroup({
          id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ma: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ten: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          san_pham_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          to_chuc_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          kich_hoat: new FormControl(null, {
              validators: [ Validators.required ]
          }),
      });

      this.sanPhamService.all().takeWhile(() => this.alive).subscribe((res: any) => {
          if (res.length) {
              this.SanPham = res;
          }
      });




      this.modelService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
          this.Models = res.data;
          this.total = res.total;
          this.page = res.current_page;
          this.pages = res.last_page;
          if ( res.last_page > 1 ) {
              this.min = Math.max(this.page - 4, 1);
              this.max =  Math.min(this.page + 4 ,  this.total);
              for (let i =  this.min; i <= this.max; i++) {
                  this.total_page.push(i);
              }
          }

      });

  }

    show_page(index) {

        this.page = index;
        this.modelService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.Models = res.data;
            this.total = res.total;
            this.pages = res.last_page;
            this.min = Math.max(this.page - 4, 1);
            this.max =  Math.min(this.page + 4 , this.pages );
            this.total_page = [];
            for (let i =  this.min; i <= this.max; i++) {
                this.total_page.push(i);
            }


        });
    }
    onCreateModelSubmit(event) {
        event.preventDefault();
        const data = this.modelCreateForm.value;
        data.to_chuc_id = this.toChuc.id;

        this.modelService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.Models.push(res);
            (<any>$('#add_model')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));

        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    }
    onEditSubmit(event) {
        event.preventDefault();

        const data = this.modelEditForm.value;
        data.to_chuc_id = this.toChuc.id;
        // console.log(data);
        this.modelService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
            console.log(res);
            this.Models[this.editIndex] = res;
            (<any>$('#edit_model')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));

        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });

    }

    openEdit(index) {
        this.modelEditForm.get('id').patchValue(this.Models[index].id);
        this.modelEditForm.get('ma').patchValue(this.Models[index].ma);
        this.modelEditForm.get('ten').patchValue(this.Models[index].ten);
        this.modelEditForm.get('san_pham_id').patchValue(this.Models[index].san_pham_id);
        this.modelEditForm.get('kich_hoat').patchValue(this.Models[index].kich_hoat);
        this.editIndex = index;
    }
    onDeleteSubmit() {
        const data: any = {};
        data.id = this.Models[this.deleteIndex].id;
        data.to_chuc_id = this.toChuc.id;
        this.modelService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.Models.splice(this.deleteIndex, 1);
            console.log(res);
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));

            (<any>$('#delete_model')).modal('hide');
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    }
    export_excel_dslk() {
        this.modelService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe(res => {
            if (res) {
                this.ModelAll = res;
                const list = this.ModelAll;
                let innerContent = ``;

                for (let i = 0; i < list.length; i++) {
                    const nhomsp = this.SanPham.find(x => x.id === list[i].san_pham_id);
                    if ( list[i].kich_hoat === 0) {
                        list[i].kich_hoat = 'Không kích hoạt';
                    } else {
                        list[i].kich_hoat = 'Kích hoạt';

                    }
                    innerContent += `
                <tr>
                    <td>` + list[i].ma + `</td>
                    <td>` + list[i].ten + `</td>
                    <td>` + nhomsp.ma + `</td>
                    <td>` + list[i].kich_hoat + `</td>
                </tr>
            `;
                }
                const content = `
            <tr>
                <th colspan='7'>Bảng thống kê danh sách Model</th>
            </tr>
            <tr>
                <th>Model No.</th>
                <th>Tên máy</th>
                <th>Nhóm sản phẩm</th>
                <th>Trạng Thái</th>
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
            const stringName = 'ds_model_' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() + '_' + d.getHours() + '.xlsx';
                fileSaver.saveAs(new Blob([wbout]), stringName);
            }
        });

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
                    xhr.open('POST', server_url + '/api/v1/upload-csv', true);
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    xhr.onload = function () {
                        // do something to response
                        console.log(this.responseText);
                        if ( this.responseText) {
                            document.getElementById('loader').style.display = 'none';
                            location.reload(true);


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

    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}

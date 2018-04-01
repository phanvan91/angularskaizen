import { Component, OnInit, Host } from '@angular/core';
import {NganhHangService} from '../../../shared/nganh-hang.service';
import {SanPhamService} from '../../../shared/san-pham.service';
import {LinhKienService} from '../../../shared/linh-kien.service';
import {environment} from '../../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';

import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.scss']
})
export class AccessoriesComponent implements OnInit {


    toChucId = environment.toChuc.id;
    sanPhamList;
    sanPhamResList;
    nganhHangList;
    linhKienList;
    linhKienAllList;
    linhKienPagination;
    toChuc = environment.toChuc;
    linhKienForm;
    linhKienEditForm;
    deleteIndex;
    editIndex;
    alive = true;
    search;
    key_word;
    constructor(
        private toastService: ToastyService,@Host() private parent: DashboardComponent,
        private nganhHangService: NganhHangService, private sanPhamService: SanPhamService,
         private linhKienService: LinhKienService) {

    }

    ngOnInit() {
        // $("#xlsxFile").change(function(event) {
        //     var file = this.files[0],
        //         sheets;
        //     XLSXReader(file, true, function(xlsxData) {
        //         sheets = xlsxData.sheets;
        //         // Do somehting with sheets. It's a
        //         // Javascript object with sheet names
        //         // as keys and data as value in form of 2D array
        //     });
        // });
        this.parent.showLoading();
        this.linhKienService.getAll().subscribe(res => {
            if (res) {
                // console.log(res);
                this.linhKienAllList = res;
                this.parent.hideLoading();
            }
        });
        this.onLoadData();
        this.linhKienForm = new FormGroup({
            ma: new FormControl(null, {
              validators: [Validators.required]
            }),
            ten: new FormControl(null, {
                validators: [Validators.required]
            }),
            san_pham_id: new FormControl(null, {
            }),
            gia_ban: new FormControl(null, {
                validators: [Validators.required]
            }),
            don_vi: new FormControl(null, {
                validators: [Validators.required]
            }),
            thang_gia_han_sau_bao_hanh: new FormControl(null, {
            }),
            tra_xac: new FormControl(1, {
            })
        });
        this.linhKienEditForm = new FormGroup({
            id: new FormControl(null, {
                validators: [Validators.required]
            }),
            ma: new FormControl(null, {
              validators: [Validators.required]
            }),
            ten: new FormControl(null, {
                validators: [Validators.required]
            }),
            san_pham_id: new FormControl(null, {
            }),
            gia_ban: new FormControl(null, {
                validators: [Validators.required]
            }),
            don_vi: new FormControl(null, {
                validators: [Validators.required]
            }),
            nganh_hang_id: new FormControl(null, {
            }),
            thang_gia_han_sau_bao_hanh: new FormControl(null, {
            }),
            tra_xac: new FormControl(1, {
            })
        });
    }

    onLoadData(){
        this.nganhHangService.all().subscribe(res => {
            if (res) {
                console.log(res); this.nganhHangList = res;
                this.sanPhamService.all().subscribe(resSP => {
                    if (resSP) {
                        console.log(resSP);
                        this.sanPhamResList = resSP;
                        if (!this.search) {
                            this.linhKienService.paginate(this.key_word).subscribe(reslk => {
                                if (reslk) {
                                    // console.log(res);
                                    this.linhKienList = (<any>reslk).data;
                                    this.linhKienPagination = reslk;
                                    this.getNameSanPham();
                                    this.parent.hideLoading();
                                }

                            });
                        }

                    }
                });
            }
        });



    }
    getNameSanPham(){
        this.linhKienList.forEach(element => {
            const sanPhamId = element.san_pham_id;
            if ( !this.sanPhamResList || !this.nganhHangList || ! sanPhamId) { return; }
            const nhomsp = this.sanPhamResList.find(x => x.id == sanPhamId);
            const nganhHangId = nhomsp.nganh_hang_id;
            const nganhHang = this.nganhHangList.find(x => x.id == nganhHangId);
            element['nhom_san_pham'] = nhomsp.ten;
            element['nganh_hang'] = nganhHang.ten;
        });
    }
    onChangeNganhHang(event){
        this.sanPhamList = [];
        const nganhHangIdSelect = event.target.value;

        this.sanPhamResList.forEach(element => {
            if(element.nganh_hang_id == nganhHangIdSelect){
                this.sanPhamList.push(element);
            }
        });
    }
    onSubmitAddData(event){
        event.preventDefault();
        const data = this.linhKienForm.value;

        this.linhKienService.create(data).subscribe(res=>{
          if(res){
            console.log(res);
            this.linhKienList.push(res);
            this.getNameSanPham();
            (<any>$('#add_accessories')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
          }
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    };
    onSubmitEditData(event){
        event.preventDefault();
        const data = this.linhKienEditForm.value;

        this.linhKienService.update(data).subscribe(res=>{
          if(res){
            console.log(res);
            this.linhKienList[this.editIndex] = res;
            this.getNameSanPham();
            (<any>$('#edit_accessories')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
          }
        },err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
      }
    onSubmitDeleteData(){
        let obj = this.linhKienList[this.deleteIndex];
        let data = { id: obj.id , to_chuc_id: obj.to_chuc_id};
        this.linhKienService.delete(data).subscribe(res=>{
          if(res){
            this.linhKienList.splice(this.deleteIndex, 1);
            this.deleteIndex = null;
            (<any>$('#delete_accessories')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
          }
        },err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        })
    }

    openEdit(i) {
        this.editIndex = i;
        const obj = this.linhKienList[i];

        if (obj.san_pham_id) {
            const sp = this.sanPhamResList.find(x => x.id == obj.san_pham_id);
            const nganhHang = this.nganhHangList.find(x => x.id == sp.nganh_hang_id);
            this.sanPhamList = [];
            this.sanPhamResList.forEach(element => {
                if (element.nganh_hang_id == nganhHang.id) {
                    this.sanPhamList.push(element);
                }
            });
            this.linhKienEditForm.get('nganh_hang_id').patchValue(nganhHang.id);
            this.linhKienEditForm.get('san_pham_id').patchValue(obj.san_pham_id);
        }


        this.linhKienEditForm.get('id').patchValue(obj.id);

        this.linhKienEditForm.get('ma').patchValue(obj.ma);

        this.linhKienEditForm.get('ten').patchValue(obj.ten);
        this.linhKienEditForm.get('gia_ban').patchValue(obj.gia_ban);
        this.linhKienEditForm.get('don_vi').patchValue(obj.don_vi);
        this.linhKienEditForm.get('thang_gia_han_sau_bao_hanh').patchValue(obj.thang_gia_han_sau_bao_hanh);

    }

    onImportDataExcel(data) {
        const rowDataStart = 2;
        const dataImport = [];
        for (let i = 0; i < data.length; i++) {

            if (data[i].length > 0) {
                const linhKien = {'ma': data[i][0], 'ten': data[i][1], 'gia_ban': data[i][4] ? data[i][4] : 0,
                 'don_vi': data[i][5], 'thoi_han': data[i][6] ? data[i][6] : 0, 'san_pham_id': null};

                const nhom_san_pham = this.sanPhamResList.find(x=>x.ma==data[i][2]);
                if (!nhom_san_pham) {
                    // alert('Nhóm sản phẩm ' + data[i][2] + ' khong ton tai, [lỗi ở hàng '+(i+3)+' của file]'); return;
                    linhKien.san_pham_id = null;
                }else {
                    linhKien.san_pham_id = nhom_san_pham.id;
                }
                dataImport.push(linhKien);
            }
        }
        const dataPush = { data: dataImport};

        this.linhKienService.import(dataPush).subscribe(res=>{
            if (res) {console.log(res); this.onLoadData();
                this.toastService.success(this.parent.toastOptions('Upload', 'thành công.'));
            }
        }, error => {
            this.toastService.success(this.parent.toastOptions('Upload', 'thất bại'));
        },
    );
    }
    export_excel_dslk() {
        // let tableContent = document.getElementById('table-access');
        // let table = document.createElement('table');
        // table.innerHTML = tableContent.innerHTML;
        // $(table).find('.btn').remove();
        let list = this.linhKienAllList;
        let innerContent = ``;

        for (let i = 0; i < list.length; i++) {
            let nhomsp = this.sanPhamResList.find(x => x.id == list[i].san_pham_id);
                nhomsp = nhomsp ? nhomsp : {ma: ''};
            let nganhHang = this.nganhHangList.find(x => x.id == nhomsp.nganh_hang_id);
                nganhHang = nganhHang ? nganhHang : {ma: ''};
            innerContent +=`
                <tr>
                    <td>`+list[i].ma+`</td>
                    <td>`+list[i].ten+`</td>
                    <td>`+nhomsp.ma+`</td>
                    <td>`+nganhHang.ma+`</td>
                    <td>`+list[i].gia_ban+`</td>
                    <td>`+list[i].don_vi+`</td>
                    <td>`+list[i].thang_gia_han_sau_bao_hanh+`</td>
                </tr>
            `;
        }
        let content = `
            <tr>
                <th colspan='7'>Bảng thống kê danh sách linh kiện</th>
            </tr>
            <tr>
                <th>Mã LK</th>
                <th>Tên LK</th>
                <th>Nhóm sản phẩm</th>
                <th>Ngành hàng</th>
                <th>Giá bán ngoài bảo hành</th>
                <th>Đơn vị</th>
                <th>Thời hạn (tháng)</th>
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
        let stringName = 'ds_linh_kien_'+d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+d.getHours()+'.xlsx';
        fileSaver.saveAs(new Blob([wbout]), stringName);
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

          console.log(data);
          let maArray = [];
          let dataRow = [];
          for (let i = 2; i < data.length; i++) {
              maArray.push(data[i][0]); dataRow.push(data[i]);
          }
          const dataCheck = { data: maArray};

          this.linhKienService.checkExist(dataCheck).subscribe(res=>{
              if(res){
                console.log(res);
                if((<any>res).exist=='true') alert('Da ton tai');
                else {
                    this.onImportDataExcel(dataRow);
                }
            }
          })
        };
        reader.readAsBinaryString(target.files[0]);
    }
    goToPageNext(){
        if(this.linhKienPagination.current_page == this.linhKienPagination.last_page) return;
        let pageNextUrl = this.linhKienPagination.next_page_url;
        this.linhKienService.getPage(pageNextUrl).subscribe(res=>{
          if(res){
            console.log(res); this.linhKienList = (<any>res).data;
            this.linhKienPagination = res;
            this.getNameSanPham();
          }
        })
    }
    goToPagePrev(){
        if(this.linhKienPagination.current_page == 1) return;
        let pagePrevUrl = this.linhKienPagination.prev_page_url;
        this.linhKienService.getPage(pagePrevUrl).subscribe(res=>{
          if(res){
            console.log(res); this.linhKienList = (<any>res).data;
            this.linhKienPagination = res;
            this.getNameSanPham();
          }
        })
    }
    goToPageLast(){
        if(this.linhKienPagination.current_page == this.linhKienPagination.last_page) return;
        let pageLastUrl = this.linhKienPagination.last_page_url;
        this.linhKienService.getPage(pageLastUrl).subscribe(res=>{
          if(res){
            console.log(res); this.linhKienList = (<any>res).data;
            this.linhKienPagination = res;
            this.getNameSanPham();
          }
        });
    }
    goToPageFirst(){
        if(this.linhKienPagination.current_page == 1) return;
        let pageFirstUrl = this.linhKienPagination.first_page_url;
        this.linhKienService.getPage(pageFirstUrl).subscribe(res=>{
          if(res){
            console.log(res); this.linhKienList = (<any>res).data;
            this.linhKienPagination = res;
            this.getNameSanPham();
          }
        });
    }
    onKey(event: any){
      this.search = event.target.value;
      this.linhKienService.paginate(this.search).subscribe(res => {
          if (res) {
              // console.log(res);
              this.linhKienList = (<any>res).data;
              this.linhKienPagination = res;
              this.getNameSanPham();
              this.parent.hideLoading();
          }

      });
    }
}

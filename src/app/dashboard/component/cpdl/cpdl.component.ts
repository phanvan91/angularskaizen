import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import {ConfigService} from '../../../shared/config.service';
import {TramBaoHanhService} from '../../../shared/tram-bao-hanh.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {ChiPhiDiLaiService} from '../../../shared/chi-phi-di-lai.service';

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';

import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-cpdl',
  templateUrl: './cpdl.component.html',
  styleUrls: ['./cpdl.component.scss']
})
export class CpdlComponent implements OnInit, OnDestroy {

  alive = true;
  cities;
  districts;
  villages;
  tramBaoHanhs = [];
  createCPDLForm;
  updateCPDLForm;
  toChuc = environment.toChuc;
  cpdls = [];
  editIndex;
  deleteIndex;
  createSelectDisctricts: any = {};
  createSelectVillages: any = {};
  updateSelectDisctricts: any = {};
  updateSelectVillages: any = {};
  importForm;
  uploadForm: FormData;
    CpdlAll;
    page = 1;
    pages;
    total_page = [];
    total;
    min;
    max;
    code;
    city = [];
    cityMap = {};
    dictrict = [];
    dictrictMap = {};
    village = [];
    villageMap = {};
    edit_city;
    edit_dictrict;
    edit_village;
    open = false;
    search;
    key_word;
    txtsearch;
    
    constructor(
    private configService: ConfigService,
    private tramBaoHanhServices: TramBaoHanhService,
    private chiPhiDiLaiService: ChiPhiDiLaiService,
    private toastService: ToastyService, @Host() private parent: DashboardComponent
  ) { }


  ngOnInit() {
    this.uploadForm = new FormData();
    this.importForm = new FormGroup({
      tram_bao_hanh_id: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.tramBaoHanhServices.all().subscribe((res: any)=>{
      if (res) {
        this.tramBaoHanhs = res;
      }
    });


      this.configService.getCityProvince().takeWhile(() => this.alive).subscribe(res => {
          if (Object.getOwnPropertyNames(res).length) {
              this.cities = res;
              // console.log(this.cities);
              for( let key in res) {
                  this.city.push(res[key]);
              }

              this.configService.getDistrict().takeWhile(() => this.alive).subscribe((dRes: any) => {
                  if (Object.getOwnPropertyNames(dRes).length) {
                      this.districts = dRes;
                      this.configService.getVillage().takeWhile(() => this.alive).subscribe((vRes: any) => {
                          if (Object.getOwnPropertyNames(vRes).length) {
                              this.villages = vRes;
                              this.initMapCities();
                              if(!this.txtsearch){
                                this.chiPhiDiLaiService.get_pagination( this.toChuc.id, this.page, this.key_word).takeWhile(() => this.alive).subscribe((res: any) => {
                                               if (res) {
                                                   this.cpdls = res.data;
                                                   // console.log(this.cpdls);
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
                                               }



                                           });
                              }


                          }
                      });
                  }
              });
          }

      });


    this.createCPDLForm = new FormGroup({
      tram_bao_hanh_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      thanh_pho: new FormControl(null, {
        validators: [Validators.required]
      }),
      quan: new FormControl(null, {
        validators: [Validators.required]
      }),
      phuong: new FormControl(null, {
        validators: [Validators.required]
      }),
      km_mot_chieu: new FormControl(null, {
        validators: [Validators.required]
      }),
      km_khu_hoi: new FormControl(null, {
        validators: [Validators.required]
      }),
      don_gia: new FormControl(null, {
        validators: [Validators.required]
      }),
      thanh_tien_mot: new FormControl(null, {
        validators: [Validators.required]
      }),
      thanh_tien_hai: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten_thanh_pho: new FormControl(null, {}),
      ten_quan: new FormControl(null, {}),
      ten_phuong: new FormControl(null, {}),
    });


    this.updateCPDLForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      tram_bao_hanh_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      thanh_pho: new FormControl(null, {
        validators: [Validators.required]
      }),
      quan: new FormControl(null, {
        validators: [Validators.required]
      }),
      phuong: new FormControl(null, {
        validators: [Validators.required]
      }),
      km_mot_chieu: new FormControl(null, {
        validators: [Validators.required]
      }),
      km_khu_hoi: new FormControl(null, {
        validators: [Validators.required]
      }),
      don_gia: new FormControl(null, {
        validators: [Validators.required]
      }),
      thanh_tien_mot: new FormControl(null, {
        validators: [Validators.required]
      }),
      thanh_tien_hai: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten_thanh_pho: new FormControl(null, {}),
      ten_quan: new FormControl(null, {}),
      ten_phuong: new FormControl(null, {}),
    });

  }
  initMapCities() {
    for (const key in this.cities) {
      if (this.cities.hasOwnProperty(key)) {
        this.cityMap[this.cities[key].name] = key;
      }
    }
    for (const key in this.districts) {
      if (this.districts.hasOwnProperty(key)) {
        this.dictrictMap[this.districts[key].name] = key;
      }
    }
    for (const key in this.villages) {
      if (this.villages.hasOwnProperty(key)) {
        this.villageMap[this.villages[key].name] = key;
      }
    }
  }

  show_page(index) {

        this.page = index;
        this.chiPhiDiLaiService.get_pagination( this.toChuc.id, this.page, this.key_word).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                this.cpdls = res.data;
                this.total = res.total;
                this.pages = res.last_page;
                this.min = Math.max(this.page - 4, 1);
                this.max =  Math.min(this.page + 4 , this.pages );
                this.total_page = [];
                for (let i =  this.min; i <= this.max; i++) {
                    this.total_page.push(i);
                }
            }


        });

    }
  onCreate(event) {
    event.preventDefault();

    const data = this.createCPDLForm.value;
    data.to_chuc_id = this.toChuc.id;
    data.km_mot_chieu = this.convertToDecimal(data.km_mot_chieu);
    data.km_khu_hoi = this.convertToDecimal(data.km_khu_hoi);
    data.don_gia = this.convertToDecimal(data.don_gia);
    data.thanh_tien_mot = this.convertToDecimal(data.thanh_tien_mot);
    data.thanh_tien_hai = this.convertToDecimal(data.thanh_tien_hai);
    data.ten_thanh_pho = this.cities[data.thanh_pho].name;
    data.ten_quan = this.districts[data.quan].name;
    data.ten_phuong = this.villages[data.phuong].name;

    this.chiPhiDiLaiService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.cpdls.push(res);
      (<any>$('#add_cpdl')).modal('hide');
    }, err => console.log(err));
  }

  openUpdate(index) {
      this.open = false;
      this.editIndex = index;

      setTimeout(() => {
          this.open = true;
      }, 200);
      setTimeout(() => {
          (<any>$('#edit_cpdl')).modal('show');
      }, 400);
    this.updateCPDLForm.get('id').patchValue(this.cpdls[index].id);
    this.updateCPDLForm.get('tram_bao_hanh_id').patchValue(this.cpdls[index].tram_bao_hanh_id);
    this.updateCPDLForm.get('thanh_pho').patchValue(this.cpdls[index].thanh_pho);
    this.updateCPDLForm.get('quan').patchValue(this.cpdls[index].quan);
    this.updateCPDLForm.get('phuong').patchValue(this.cpdls[index].phuong);
    this.updateCPDLForm.get('km_mot_chieu').patchValue(this.cpdls[index].km_mot_chieu);
    this.updateCPDLForm.get('km_khu_hoi').patchValue(this.cpdls[index].km_khu_hoi);
    this.updateCPDLForm.get('don_gia').patchValue(this.cpdls[index].don_gia);
    this.updateCPDLForm.get('thanh_tien_mot').patchValue(this.cpdls[index].thanh_tien_mot);
    this.updateCPDLForm.get('thanh_tien_hai').patchValue(this.cpdls[index].thanh_tien_hai);

      this.code = this.cpdls[index].thanh_pho;
      this.configService.getCityProvince().takeWhile(() => this.alive).subscribe(res => {
          for (let key in res) {
              this.city.push(res[key]);
          }

      });
      this.configService.getDistrict(this.cpdls[index].thanh_pho).takeWhile(() => this.alive).subscribe((res: any) => {
          this.dictrict = [];
          for (let key in res) {
              this.dictrict.push(res[key]);
          }

      });
      this.configService.getVillage(this.cpdls[index].thanh_pho, this.cpdls[index].quan).takeWhile(() =>
          this.alive).subscribe((res: any) => {
          this.village = [];
          for (let key in res) {
              this.village.push(res[key]);
          }

      });
      this.edit_city = this.cities[this.cpdls[index].thanh_pho].name;
      this.edit_dictrict = this.districts[this.cpdls[index].quan].name;
      this.edit_village = this.villages[this.cpdls[index].phuong].name;
    this.editIndex = index;

  }
  onUpdate(event) {
    event.preventDefault();
    const data = this.updateCPDLForm.value;
    data.to_chuc_id = this.toChuc.id;
    data.km_mot_chieu = this.convertToDecimal(data.km_mot_chieu);
    data.km_khu_hoi = this.convertToDecimal(data.km_khu_hoi);
    data.don_gia = this.convertToDecimal(data.don_gia);
    data.thanh_tien_mot = this.convertToDecimal(data.thanh_tien_mot);
    data.thanh_tien_hai = this.convertToDecimal(data.thanh_tien_hai);
    data.ten_thanh_pho = this.cities[data.thanh_pho].name;
    data.ten_quan = this.districts[data.quan].name;
    data.ten_phuong = this.villages[data.phuong].name;

    this.chiPhiDiLaiService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.cpdls[this.editIndex] = res;
      (<any>$('#edit_cpdl')).modal('hide');
    }, err => console.log(err));
  }

  onDelete() {
    const data: any = {};
    data.id = this.cpdls[this.deleteIndex].id;
    data.to_chuc_id = this.toChuc.id;

    this.chiPhiDiLaiService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.cpdls.splice(this.deleteIndex, 1);
      (<any>$('#delete_cpdl')).modal('hide');
    }, err => console.log(err));
  }

  cityCreateOnChange(event) {
    this.configService.getDistrict(event.target.value).takeWhile(() => this.alive).subscribe((res: any) => {
      this.createSelectDisctricts = res;
    }, err => console.log(err));
  }

  districtCreateOnChange(event) {
    this.configService.getVillage(this.createCPDLForm.get('thanh_pho').value, event.target.value)
      .takeWhile(() => this.alive).subscribe((res: any) => {
      this.createSelectVillages = res;
    }, err => console.log(err));
  }

  cityUpdateOnChange(event) {
    this.configService.getDistrict(event.target.value).takeWhile(() => this.alive).subscribe((res: any) => {
      this.updateSelectDisctricts = res;
    }, err => console.log(err));
  }

  districtUpdateOnChange(event) {
    this.configService.getVillage(this.updateCPDLForm.get('thanh_pho').value, event.target.value)
      .takeWhile(() => this.alive).subscribe((res: any) => {
      this.updateSelectVillages = res;
    }, err => console.log(err));
  }

  convertToDecimal(str) {
    return parseFloat(('' + str).replace(/[^0-9.]/g, ''));
  }


  triggerFile() {
    $('#file').click();
  }
  trigerFileTool() {
    $('#file-tool').click();
  }

  importToolExcel(event) {
    const target = event.target;

    this.parent.showLoading();
    const reader: FileReader = new FileReader();
    let data;
    const rowDataStart = 2;
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      wb.SheetNames.forEach(wsname => {
        if (wsname && wsname !== 'Địa chỉ các trạm') {
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          const dataWSheet = (XLSX.utils.sheet_to_json(ws, {header: 1}));
          // console.log(dataWSheet);

          let innerContent = ``;
          dataWSheet.forEach(row => {
            if ((<any>row).length === 8 && row[0] !== 'STT') {
              // tao worksheet
              const rowData = {
                thanh_pho: wsname,
                phuong: row[1],
                quan: row[2],
                km_1c: row[3],
                km_khu_hoi: row[4],
                don_gia: row[5],
                thanh_tien_mot: row[6],
                thanh_tien_hai: row[7],
                ma_tp: this.cityMap[wsname],
                ma_quan: this.dictrictMap[row[2]] ? this.dictrictMap[row[2]] : '',
                ma_phuong: this.villageMap[row[1]] ? this.villageMap[row[1]] : ''
              };

              innerContent +=
                  `<tr>` +
                  `<td>` + rowData.thanh_pho + `</td>` +
                  `<td>` + rowData.quan + `</td>` +
                  `<td>` + rowData.phuong + `</td>` +
                  `<td>` + rowData.km_1c + `</td>` +
                  `<td>` + rowData.km_khu_hoi + `</td>` +
                  `<td>` + rowData.don_gia + `</td>` +
                  `<td>` + rowData.thanh_tien_mot + `</td>` +
                  `<td>` + rowData.thanh_tien_hai + `</td>` +
                  `<td>'` + rowData.ma_tp + `'</td>` +
                  `<td>'` + rowData.ma_quan + `'</td>` +
                  `<td>'` + rowData.ma_phuong + `'</td>` +
                  `</tr>`;

            }
          });
          const content = `
            <tr>
                <th colspan='11'>Danh sách chi phí đi lại</th>
            </tr>
            <tr>
                <th>Thành phố</th>
                <th>Quận/ huyện</th>
                <th>Phường/xã</th>
                <th>Km 1 chiều</th>
                <th>Km khứ hồi</th>
                <th>Đơn giá</th>
                <th>Thành tiền 1</th>
                <th>Thành tiền 2</th>
                <th>Mã thành phố</th>
                <th>Mã quận/huyện</th>
                <th>Mã phường/xã</th>
            </th>
            ` + innerContent;
          const table = document.createElement('table');
          table.innerHTML = content;

          const ws_new: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
          // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(content);

          /* generate workbook and add the worksheet */
          const wb_new: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb_new, ws_new, 'Sheet1');

          // /* save to file */
          const wbout: string = XLSX.write(wb_new, { bookType: 'xlsx', type: 'array' });
          const d = new Date();
          let stringName = 'ds_cpdl_'+ wsname +'_'+d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+d.getHours()+'.xlsx';
          fileSaver.saveAs(new Blob([wbout]), stringName);

          if (wsname == wb.SheetNames[wb.SheetNames.length - 1]) {
              this.parent.hideLoading();
          }

        }
      });

      /* push data */
      // data = (XLSX.utils.sheet_to_json(ws, {header: 1}));

      // console.log(data);

    };
    reader.readAsBinaryString(target.files[0]);
  }


  import_excel(event) {
    const target = event.target;

    if (target.files.length !== 1) throw alert('Cannot use multiple files');
      const extension = target.files[0].name.substr( (target.files[0].name.lastIndexOf('.') +1) );
      const extFilter = ['xlsx','xls'];
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
                let chiPhiItem = {
                  'thanh_pho': this.replaceFormat(data[i][8]),
                  'quan': this.replaceFormat(data[i][9]),
                  'phuong': this.replaceFormat(data[i][10]),
                  'km_mot_chieu': data[i][3],
                  'km_khu_hoi': data[i][4],
                  'don_gia': data[i][5],
                  'thanh_tien_mot': this.replaceFormat(data[i][6]),
                  'thanh_tien_hai': this.replaceFormat(data[i][7]),
                  'ten_thanh_pho': data[i][0],
                  'ten_quan': data[i][1],
                  'ten_phuong': data[i][2]
                };
                dataImport.push(chiPhiItem);
            }
        }

        const dataPush = { data: dataImport, tram_bao_hanh_id: this.importForm.value.tram_bao_hanh_id};
        this.chiPhiDiLaiService.import(dataPush).subscribe((res: any) => {
          this.ngOnInit();
          (<any>$('#open_upload')).modal('hide');
          $('#file').val('');
          this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
          this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        })

        console.log(dataPush);

    }
    reader.readAsBinaryString(target.files[0]);

  }
  replaceFormat(e){
    return e.replace(/[',]/g, "");
  }

  export_excel_cpdl() {
      this.chiPhiDiLaiService.all().takeWhile(() => this.alive).subscribe((res: any) => {
          this.CpdlAll = res;
          let innerContent = ``;

          const data = this.CpdlAll;
          for (let i = 0; i < data.length; i ++) {

              if (!this.villages[data[i].phuong]) {
                console.log(this.districts[268].name);
                console.log('Ma phuong : ' + data[i].phuong + ' khong ton tai');
                continue;
              }


              innerContent +=
                  `<tr>`+
                  `<td>`+this.cities[data[i].thanh_pho].name+`</td>`+
                  `<td>`+this.districts[data[i].quan].name+`</td>`+
                  `<td>`+this.villages[data[i].phuong].name+`</td>`+
                  `<td>`+data[i].km_mot_chieu+`</td>`+
                  `<td>`+data[i].km_khu_hoi+`</td>`+
                  `<td>`+data[i].don_gia+`</td>`+
                  `<td>`+data[i].thanh_tien_mot+`</td>`+
                  `<td>`+data[i].thanh_tien_hai+`</td>`+
                  `<td>'`+data[i].thanh_pho+`'</td>`+
                  `<td>'`+data[i].quan+`'</td>`+
                  `<td>'`+data[i].phuong+`'</td>`+
                  `</tr>`;
          }

          let content = `
            <tr>
                <th colspan='7'>Danh sách chi phí đi lại</th>
            </tr>
            <tr>
                <th>Thành phố</th>
                <th>Quận/huyện</th>
                <th>Phường/xã</th>
                <th>Km 1 chiều</th>
                <th>Km khứ hồi</th>
                <th>Đơn giá</th>
                <th>Thành tiền 1</th>
                <th>Thành tiền 2</th>
                <th>Mã thành phố</th>
                <th>Mã quận/ huyện</th>
                <th>Mã phường/xã</th>

            </th>
            `+innerContent;
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
          let stringName = 'ds_cpdl_'+d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+d.getHours()+'.xlsx';
          fileSaver.saveAs(new Blob([wbout]), stringName);
      });
    }

    changeCity(event) {
        const code = event.value;
        this.code = code;
        this.createCPDLForm.get('thanh_pho').patchValue(code);
        this.updateCPDLForm.get('thanh_pho').patchValue(code);


        this.configService.getDistrict(this.code).takeWhile(() => this.alive).subscribe((res: any) => {
            console.log(res);
            this.dictrict = [];
            for (let key in res) {
                this.dictrict.push(res[key]);
            }
        });
    }

    changeDictrict(event) {
        this.createCPDLForm.get('quan').patchValue(event.value);
        this.updateCPDLForm.get('quan').patchValue(event.value);

        this.configService.getVillage(this.code, event.value).takeWhile(() => this.alive).subscribe((res: any) => {
            this.village = [];
            for (let key in res) {
                this.village.push(res[key]);
            }
            console.log(this.village);

        });
    }
    changeVillage(event) {
        this.createCPDLForm.get('phuong').patchValue(event.value);
        this.updateCPDLForm.get('phuong').patchValue(event.value);

    }
    onKey(event){
       this.txtsearch = event.target.value ;
       console.log(this.txtsearch);
       this.chiPhiDiLaiService.get_pagination(this.toChuc.id, this.page, this.txtsearch).takeWhile(() => this.alive).subscribe((res: any) => {
         if (res) {
             this.cpdls = res.data;
             this.total = res.total;
             this.page = res.current_page;
             this.pages = res.last_page;
             this.min = Math.max(this.page - 4, 1);
             this.max =  Math.min(this.page + 4 ,  this.total);
             this.total_page =[];
             for (let i =  this.min; i <= this.max; i++) {
                 this.total_page.push(i);
             }
         }


                  });
    }
    ngOnDestroy(): void {
    this.alive = false;
  }



}

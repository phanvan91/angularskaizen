import { Component, OnInit, Host } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DonDatHangService } from '../../../shared/don-dat-hang.service';
import { LinhKienService } from '../../../shared/linh-kien.service';
import { ActivatedRoute, Router } from '@angular/router';
import {DateService} from "../../../shared/date.service";
import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  dataAccessories = [];
  linhKienList = [];
  orderDate = new Date();
  orderForm = { 'num': null, 'duration': new Date(), 'accessory': null, 'quantity': null };
  dateShow = { 'date': null, 'month': null, 'year': null };
  dateDurationShow = { 'date': null, 'month': null, 'year': null };
  orderTable = [];
  orderQuantitySumary;
  isNotCheckTime = false;

  idOrderEdit;

  ajaxOptions_lk;
  options_lk;
  data_lk;
  data_lk_map;

  nguoi_dat_hang;
  orderId;

  existOrder;
  alive;
  createOrderForm;

  congty;

  constructor(private donDatHangService: DonDatHangService, private linhKienService: LinhKienService,
    private toastService: ToastyService, @Host() private parent: DashboardComponent, private router: Router,
    private activatedRoute: ActivatedRoute, private dateService: DateService) { }

  ngOnInit() {


    this.initData();
    this.activatedRoute.queryParams.subscribe(params => {
      this.orderId = params['id'];
    });
    if (this.orderId) {
      this.initExistOrder(this.orderId);
    }
  }
  openOrder(id) {
    this.router.navigateByUrl('/dashboard/tao-don-dat-hang?id='+ id.toString());
  }
  initExistOrder(orderId) {
    this.isNotCheckTime = true;
    this.donDatHangService.getDonDatHang(orderId).subscribe((res: any) => {
      console.log(res);
      this.congty = res.trung_tam_bao_hanh.cong_ty;
      this.nguoi_dat_hang = res.user;
      const ngay_dat = new Date(res.ngay_dat_hang);
      const ngay_nhan = new Date(res.ngay_nhan_hang);
      this.orderForm.duration = ngay_nhan;
      this.dateShow = { 'date': ngay_dat.getDate(), 'month': ngay_dat.getMonth() + 1, 'year': ngay_dat.getFullYear() };
      this.dateDurationShow = { 'date': ngay_nhan.getDate(), 'month': ngay_nhan.getMonth() + 1, 'year': ngay_nhan.getFullYear() };
      this.createOrderForm.controls.ly_do.patchValue(res.ly_do);
      this.createOrderForm.controls.so_ct.patchValue(res.so_ct);
      res.danh_sach_don_dat_hang_chi_tiet.forEach(element => {
        const orderItemTable = {
          'ma': element.linh_kien_id,
          'time': res.ngay_nhan_hang,
          'accessory': element.linh_kien.ma,
          'quantity': element.so_luong,
          'name': element.linh_kien.ten,
          'unit': element.linh_kien.don_vi
        };
        this.orderTable.push(orderItemTable);
        this.orderQuantitySumary += element.so_luong;
      });

      console.log(this.createOrderForm);
    });
  }
  initData() {
    this.linhKienService.getAll().subscribe((res: any)=>{ this.linhKienList = res; }, err => { console.log(err); });
    this.dateShow.date = this.orderDate.getDate();
    this.dateShow.month = this.orderDate.getMonth() + 1;
    this.dateShow.year = this.orderDate.getFullYear();
    this.createOrderForm = new FormGroup({
      ngay_dat_hang: new FormControl(null, {
        validators: [Validators.required]
      }),
      ngay_nhan_hang: new FormControl(null, {
        validators: [Validators.required]
      }),
      so_ct: new FormControl(null, {
        validators: [Validators.required]
      }),
      ly_do: new FormControl(null, {
        validators: [Validators.required]
      }),
      data_chitiet: new FormControl(null, {
        validators: [Validators.required]
      }),
      id:  new FormControl(null, {}),
    });
    this.orderDate = new Date();
    this.orderForm = { 'num': null, 'duration': new Date(), 'accessory': null, 'quantity': null };
    this.dateShow = { 'date': null, 'month': null, 'year': null };
    this.dateDurationShow = { 'date': null, 'month': null, 'year': null };
    this.orderTable = [];
    this.orderQuantitySumary = 0;
    this.existOrder = this.orderId ? true : false;

    this.ajaxOptions_lk = {
      url: this.linhKienService.searchUrl,
      dataType: 'json',
      delay: 250,
      cache: false,
      data: (params: any) => {
          return {
              key_word: params.term
          };
      },
      processResults: (res: any, params: any) => {
          this.data_lk = [];
          this.data_lk_map = new Object();
          if (res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                  this.data_lk_map[res[i].id] = res[i];
              }
          }
          console.log(this.data_lk_map);
          return {
              results: $.map(res, function (obj) {
                  // console.log('data', obj);
                  return { id: obj.id, text: obj.ma + '-' + obj.ten };
              })
          };
      },
    };

    this.options_lk = {
      ajax: this.ajaxOptions_lk,
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
  }
  onAddItemOrder() {
    this.isNotCheckTime = true;

    if (!this.orderForm.quantity || !this.orderForm.accessory) return;
    let existItem = this.orderTable.find(x => x.ma == this.orderForm.accessory);
    if (existItem) { existItem.quantity += this.orderForm.quantity; this.orderQuantitySumary += this.orderForm.quantity; }
    else {
      const orderItemTable = {
        'ma': this.orderForm.accessory,
        'time': this.dateService.getDateString(this.orderForm.duration),
        'accessory': '',
        'quantity': this.orderForm.quantity,
        'name': 'không có',
        'unit': 'k co'
      };
      console.log(orderItemTable);
      let lk = this.linhKienList.find(x => x.id == this.orderForm.accessory);
      orderItemTable.name = lk.ten;
      orderItemTable.unit = lk.don_vi;
      orderItemTable.accessory = lk.ma;
      this.orderTable.push(orderItemTable);
      this.orderQuantitySumary += orderItemTable.quantity;
    }

    // fix thoi han can vtlk
    this.orderTable.forEach(element => {
      if(element.time != this.dateService.getDateString(this.orderForm.duration))
          element.time = this.dateService.getDateString(this.orderForm.duration);
    });
    
  }
  onCheck(e) {
    if (this.isNotCheckTime) return;
    else e.toggle();
  }
  onChangeDate(type) {
    if (type !== 'duration') {
      const d = this.orderDate;
      this.dateShow.date = d.getDate();
      this.dateShow.month = d.getMonth() + 1;
      this.dateShow.year = d.getFullYear();
    } else {
      const d = this.orderForm.duration;
      this.dateDurationShow.date = d.getDate();
      this.dateDurationShow.month = d.getMonth() + 1;
      this.dateDurationShow.year = d.getFullYear();

      
    }
  }
  removeOrderItem(id) {
    const index = this.orderTable.findIndex(item => item.id === id);
    this.orderQuantitySumary -= this.orderTable[index].quantity;
    this.orderTable.splice(index, 1);
  }

  changeLinhKien(value: any) {
    this.orderForm.accessory = value.value;
  }
  onSubmitOrder(event) {
    event.preventDefault();
    this.parent.showLoading();
    this.createOrderForm.value.ngay_dat_hang = this.dateShow.year + '-' + this.dateShow.month + '-' + this.dateShow.date;
    this.createOrderForm.value.ngay_nhan_hang = this.dateService.getDateString(this.orderForm.duration);
    console.log(this.createOrderForm.value.ngay_nhan_hang);
    
    let data = [];
    this.orderTable.forEach(element => {
      let obj = {
        'so_luong': element.quantity,
        'linh_kien_id': element.ma,
        'don_dat_hang_id': null
      }
      data.push(obj);
    });
    this.createOrderForm.value.data_chitiet = data;
    if(this.idOrderEdit){
      this.createOrderForm.value.id = this.idOrderEdit;
    }
    
    this.donDatHangService.create(this.createOrderForm.value).subscribe(res => {
      if (res) {
        console.log(res);
        this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        this.initData();
        this.openOrder((<any>res).id);
        this.initExistOrder((<any>res).id);
        this.parent.hideLoading();
      }
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
      this.parent.hideLoading();
    });
  }
  onPrintOrder() {
    let printContents, popupWin;
    printContents = document.getElementById('order-print').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
          <html>
            <head>
                <style>
                  table{width: 100%;border-collapse: collapse; margin: 20px 0px;}
                  td, th{border: 1px solid #aaa; padding: 5px;}
                  .order-header .title{font-size: 20px; font-weight: bold}
                  .order-body .title{font-size: 25px; font-weight: bold; margin-bottom: 15px;}
                  .order-body .title, .order-body .order-time, .order-body .order-no{text-align: center}
                  .order-no{margin-bottom: 20px;}
                  .order-body{ margin : 30px 0px;}
                  .order-info div{display: flex;}
                  .order-info .dot-inline{border-bottom: 1px dotted #aaa; flex: 1}
                  .text.left{text-align: left;}
                  .text.right{text-align: right;}
                  .text.center{text-align: center;}
                  .row{width: 100%; clear: both;}
                  .row .col{width: 50%; float: left; text-align: center; line-height: 60px;}
                  @media screen {
                        .print-footer{
                            display: none;
                        }
                  }
                  @media print {
                        .print-footer{
                            position: fixed;
                            bottom: 0px;
                            text-align: center;
                            display: block;
                            width: 100%;
                        }
                  }
                </style>
            </head>
            <body onload="window.print();window.close()">${printContents}</body>
          </html>`
    );
    popupWin.document.close();
  }
  openEdit() {
    this.idOrderEdit = this.orderId;
    console.log(this.createOrderForm);
    this.orderId = null;
    this.isNotCheckTime = false;
  }
}

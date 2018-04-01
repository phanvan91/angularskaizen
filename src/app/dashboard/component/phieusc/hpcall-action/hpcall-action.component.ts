import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../../environments/environment';
import {HpcallService} from '../../../../shared/hpcall.service';
import {AuthService} from "../../../../shared/auth.service";
import {ToastyService} from "ng2-toasty";

@Component({
  selector: 'app-hpcall-action',
  templateUrl: './hpcall-action.component.html',
  styleUrls: ['./hpcall-action.component.scss']
})
export class HpcallActionComponent implements OnInit {
    user = environment.user;
    toChuc = environment.toChuc;
    alive = true;
    cauhoi;
    data_ctl: any = {};
    me;
    @Input() phieu_sua_chua_id;
    @Output() trang_thai_psc = new EventEmitter<boolean>();

    constructor(
        private hpcallService: HpcallService,
        private authService: AuthService,
        private toastService: ToastyService,

    ) { }

  ngOnInit() {
        console.log(this.phieu_sua_chua_id);
      this.data_ctl.to_chuc_id = this.toChuc.id;
      this.data_ctl.phieu_sua_chua_id = this.phieu_sua_chua_id;


      this.hpcallService.get_hpcall_index(this.data_ctl).takeWhile(() => this.alive).subscribe((res: any) => {
          this.cauhoi = res;
          console.log(res);

      });

      this.authService.me().takeWhile(() => this.alive).subscribe(res => {
          this.me = res;

      });
  }
    show_box(e) {
        const value = 'note-hpcall-' + e.target.value;
        // console.log(value);
        if (document.getElementById(value).style.display === 'block') {
            document.getElementById(value).style.display = 'none';
        } else {
            document.getElementById(value).style.display = 'block';
        }

    }
    selectOnlyThis(event) {
        const value = event.target.value;
        const myCheckbox = document.getElementsByClassName('myCheckbox-' + value);
        Array.prototype.forEach.call(myCheckbox, function(el){
            if (el.id !== event.target.id) {
                el.checked = false;

            } else {
                el.checked = true;

            }
        });

    }
    hpCallSubmit(event) {
        event.preventDefault();
        const data: any = {};
        const list_cau_hoi = this.cauhoi;
        data.phieu_sua_chua_id = this.phieu_sua_chua_id;
        data.to_chuc_id = this.toChuc.id;
        data.da_thuc_hien = 1;
        data.user_id = this.me.id;
        const cau_tra_loi: any = {};
        for (let j = 0; j < this.cauhoi.length ; j ++) {
            if (this.cauhoi[j].loai === 1) {
                const value = 'myCheckbox-' + this.cauhoi[j].id;
                const myCheckbox = document.getElementsByClassName(value);
                const checked = [];
                Array.prototype.forEach.call(myCheckbox, function(el){
                    if (el.checked === true) {
                        checked.push(el.id);
                    }
                });
                for (let i = 0 ; i < checked.length; i++) {
                    const id_checkbox = checked[i];
                    let val_checkbox = '';
                    if (id_checkbox.indexOf('check-1') === 0) {
                        val_checkbox = '1';

                    }
                    if (id_checkbox.indexOf('check-2') === 0) {
                        val_checkbox = '2';
                    }
                    if (id_checkbox.indexOf('check-3') === 0) {
                        val_checkbox = '3';
                    }
                    if (id_checkbox.indexOf('check-4') === 0) {
                        val_checkbox = (document.getElementById('note-hpcall-' + this.cauhoi[j].id) as HTMLTextAreaElement).value;
                    }

                    cau_tra_loi[this.cauhoi[j].id] = val_checkbox;
                }

            }else {
                cau_tra_loi[this.cauhoi[j].id] = (document.getElementById('cautraloi-' + this.cauhoi[j].id) as HTMLTextAreaElement).value;

            }

        }
        data.cau_tra_loi = cau_tra_loi;
        this.hpcallService.actionHpcall(data).takeWhile(() => this.alive).subscribe((res: any) => {
            console.log(res);
            this.trang_thai_psc.next( res.trang_thai_psc);
            this.toastService.success('Thao tác thành công');

        }, err => {
            this.toastService.error('Mã đã tồn tại');
        });

    }
}

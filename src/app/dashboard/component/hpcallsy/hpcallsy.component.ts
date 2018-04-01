import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {HpcallService} from '../../../shared/hpcall.service';
import {AuthService} from "../../../shared/auth.service";
@Component({
  selector: 'app-hpcallsy',
  templateUrl: './hpcallsy.component.html',
  styleUrls: ['./hpcallsy.component.scss']
})
export class HpcallsyComponent implements OnInit {

    user = environment.user;
    toChuc = environment.toChuc;
    alive = true;
    cauhoi;
    HpCall;
    page = 1;
    pages;
    total_page = [];
    total;
    editIndex;
    ActionIndex;
    min;
    max;
    me;
    constructor(
        private hpcallService: HpcallService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.hpcallService.all( this.toChuc.id).takeWhile(() => this.alive).subscribe((res: any) => {
            this.cauhoi = res;

        });

        this.hpcallService.get_HpcallYes_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.HpCall = res.data;
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
            this.authService.me().takeWhile(() => this.alive).subscribe(res => {
                this.me = res;

            });
        });
    }
    show_page(index) {
        this.page = index;
        this.hpcallService.get_HpcallNo_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.HpCall = res.data;
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
        data.phieu_sua_chua_id = this.HpCall[this.ActionIndex].phieu_sua_chua_id;
        data.khach_hang_id = this.HpCall[this.ActionIndex].khach_hang_id;
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
            (<any>$('#edit_hpcallsy')).modal('hide');
        }, err => console.log(err));

    }
    OpenForm(index) {
        const data: any = {};

        this.ActionIndex = index;
        data.phieu_sua_chua_id = this.HpCall[this.ActionIndex].phieu_sua_chua_id;
        data.khach_hang_id = this.HpCall[this.ActionIndex].khach_hang_id;
        data.to_chuc_id = this.toChuc.id;
        console.log(data);

        this.hpcallService.get_hpcall_index(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.cauhoi = res;
            console.log(res);
        }, err => console.log(err));



}


}

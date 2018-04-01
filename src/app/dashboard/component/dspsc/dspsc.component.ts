import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import {PhieuSuaChuaService} from '../../../shared/phieu-sua-chua.service';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import {TramBaoHanhService} from '../../../shared/tram-bao-hanh.service';
import {TrungTamBaoHanhService} from '../../../shared/trung-tam-bao-hanh.service';

@Component({
  selector: 'app-dspsc',
  templateUrl: './dspsc.component.html',
  styleUrls: ['./dspsc.component.scss']
})
export class DspscComponent implements OnInit {


    PhieuSuaChua;
    user = environment.user;
    toChuc = environment.toChuc;
    alive = true;
    page = 1;
    pages;
    total_page = [];
    total;
    deleteIndex;
    min ;
    max;
    trang_thai = 'all';
    loai_hinh_dv= environment.loai_hinh_dv;
    uu_tien= environment.uu_tien;
    status= environment.status_psc;
    statusArr = [];

    serial;

    tramList;
    tram;
    loaiDichVuArr;
    uuTienArr;
    tramArr;
    tramId;
    loai_dich_vu;
    uu_tien_id;
    tTbhId;

    constructor(
        private phieuSuaChuaService: PhieuSuaChuaService, private activatedRoute: ActivatedRoute,
        private tramBaoHanhService: TramBaoHanhService, private tTbhService: TrungTamBaoHanhService
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.serial = params['serial'];
            this.search();
        });

        this.tTbhService.trungTamSelect.subscribe(res => {
            this.tTbhId = res;
            this.tramBaoHanhService.getTramThuocTT(res).subscribe(data => {
                console.log(data); this.tramList = data;
                this.tramArr = [];

                this.tramList.forEach(e => {
                    const itemTram = { id: e.id, text: e.ten, checked: 0};
                    this.tramArr.push(itemTram);
                });


            });
        });
        this.initFilterTable();

        this.phieuSuaChuaService.get_pagination( this.toChuc.id,
             this.page, this.trang_thai, this.serial ? this.serial : '').takeWhile(() => this.alive)
            .subscribe((res: any) => {
                this.PhieuSuaChua = res.data;
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
            });
    }
    initFilterTable() {
        this.loaiDichVuArr = [];
        for (const key in this.loai_hinh_dv) {
            if (this.loai_hinh_dv.hasOwnProperty(key)) {
                const item = { id: key, text: this.loai_hinh_dv[key], checked: 0};
                this.loaiDichVuArr.push(item);
            }
        }
        this.uuTienArr = [];
        for (const key in this.uu_tien) {
            if (this.uu_tien.hasOwnProperty(key)) {
                const item = { id: key, text: this.uu_tien[key], checked: 0};
                this.uuTienArr.push(item);
            }
        }

        for (const key in this.status) {
            if (this.status.hasOwnProperty(key)) {
                const itemStatus = { id: key, text: this.status[key], checked: 0};
                this.statusArr.push(itemStatus);                
            }
        }


    }
    show_page(index) {
        this.page = index;
        this.phieuSuaChuaService.get_pagination( this.toChuc.id, this.page, this.trang_thai, this.serial ? this.serial : '')
        .takeWhile(() => this.alive).subscribe((res: any) => {
            this.PhieuSuaChua = res.data;
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
        });
    }

    search() {
        this.page = 0;
        this.phieuSuaChuaService.get_pagination( this.toChuc.id, this.page, this.trang_thai, 
            this.serial ? this.serial : '', this.uu_tien_id ? this.uu_tien_id : '', this.tramId ? this.tramId : '')
        .takeWhile(() => this.alive).subscribe((res: any) => {
            this.PhieuSuaChua = res.data;
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
        });
    }
    selectDichVu(event, item) {
        event.preventDefault();
        this.loaiDichVuArr.forEach(e => { e.checked = 0; });
        item.checked = !item.checked;
        this.setParamSearch();
        this.search();
    }
    selectUuTien(event, item) {
        event.preventDefault();
        this.uuTienArr.forEach(e => { e.checked = 0; });
        item.checked = !item.checked;
        this.setParamSearch();
        this.search();
    }
    selectTrangThai(event, item) {
        event.preventDefault();
        this.statusArr.forEach(e => { e.checked = 0; });
        item.checked = !item.checked;
        this.setParamSearch();
        this.search();
    }
    selectTram(event, item) {
        event.preventDefault();
        this.tramArr.forEach(e => { e.checked = 0; });
        item.checked = !item.checked;
        this.setParamSearch();
        this.search();
    }

    setParamSearch() {
        this.statusArr.forEach(e => { if (e.checked) { this.trang_thai = e.id; } else { this.trang_thai = null; } });
        this.tramArr.forEach(e => { if (e.checked) { this.tramId = e.id; } else { this.tramId = null; } });
        this.loaiDichVuArr.forEach(e => { if (e.checked) { this.loai_dich_vu = e.id; } else { this.loai_dich_vu = null; } });
        this.uuTienArr.forEach(e => { if (e.checked) { this.uu_tien_id = e.id; } else { this.uu_tien_id = null; } });
    }
}

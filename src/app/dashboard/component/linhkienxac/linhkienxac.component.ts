import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {KhoService} from '../../../shared/kho.service';
@Component({
  selector: 'app-linhkienxac',
  templateUrl: './linhkienxac.component.html',
  styleUrls: ['./linhkienxac.component.scss']
})
export class LinhkienxacComponent implements OnInit {

    user = environment.user;
    toChuc = environment.toChuc;
    LinhKienXac;
    alive = true;
    page = 1;
    pages;
    total_page = [];
    total;
    min ;
    max;
    constructor(private khoService: KhoService) { }

    ngOnInit() {
        this.khoService.getLinhKienXac(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.LinhKienXac = res.data;
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
    show_page(index) {
        this.page = index;
        this.khoService.getLinhKienXac(this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.LinhKienXac = res.data;
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

}

import {Component, OnDestroy, OnInit, Host} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {NganhHangService} from '../../../shared/nganh-hang.service';

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
    user = environment.user;
    toChuc = environment.toChuc;
    alive = true;
    categoies;
    nganhHangEditForm;
    nganhHangCreateForm;
    page = 1;
    pages;
    total_page = [];
    total;
    editIndex;
    deleteIndex;
    min ;
    max;
    status = 1;

    constructor(private nganhHangService: NganhHangService,
        private toastService: ToastyService, @Host() private parent: DashboardComponent
    ) {}

    ngOnInit() {
        this.nganhHangCreateForm = new FormGroup({
            id: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            ma: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            ten: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            to_chuc_id: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            kich_hoat: new FormControl(null, {
                validators: [ Validators.required ]
            }),
        });
        this.nganhHangEditForm = new FormGroup({
            id: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            ma: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            ten: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            to_chuc_id: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            kich_hoat: new FormControl(null, {
                validators: [ Validators.required ]
            }),
        });

        this.nganhHangService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
          console.log(res);
            this.categoies = res.data;
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
        this.nganhHangService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.categoies = res.data;
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
    onCreateNganhHangSubmit(event) {
        event.preventDefault();
        const data = this.nganhHangCreateForm.value;
        data.to_chuc_id = this.toChuc.id;

        this.nganhHangService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
            // console.log(res);
            this.categoies.push(res);
            (<any>$('#add_category')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    }
    openEdit(index) {
        this.nganhHangEditForm.get('id').patchValue(this.categoies[index].id);
        this.nganhHangEditForm.get('ma').patchValue(this.categoies[index].ma);
        this.nganhHangEditForm.get('ten').patchValue(this.categoies[index].ten);
        this.nganhHangEditForm.get('kich_hoat').patchValue(this.categoies[index].kich_hoat);
        this.editIndex = index;
    }
    onEditSubmit(event) {
        event.preventDefault();

        const data = this.nganhHangEditForm.value;
        data.to_chuc_id = this.toChuc.id;

        this.nganhHangService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.categoies[this.editIndex] = res;
            (<any>$('#edit_category')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });

    }

    onDeleteSubmit() {
        const data: any = {};
        data.id = this.categoies[this.deleteIndex].id;
        data.to_chuc_id = this.toChuc.id;

        this.nganhHangService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
            // console.log(res);
            this.categoies.splice(this.deleteIndex, 1);
            (<any>$('#delete_category')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    }


    ngOnDestroy(): void {
        this.alive = false;
    }
}

import {Component, Host, OnInit} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {HpcallService} from '../../../shared/hpcall.service';
import {ToastyService} from "ng2-toasty";
import {DashboardComponent} from "../../dashboard.component";
@Component({
  selector: 'app-hpcall',
  templateUrl: './hpcall.component.html',
  styleUrls: ['./hpcall.component.scss']
})
export class HpcallComponent implements OnInit {
    user = environment.user;
    toChuc = environment.toChuc;
    alive = true;
    HpCall;
    hpCallEditForm;
    hpCallCreateForm;
    page = 1;
    pages;
    total_page = [];
    total;
    editIndex;
    deleteIndex;
    min;
    max;

  constructor(
      private hpcallService: HpcallService,
      private toastService: ToastyService, @Host() private parent: DashboardComponent

  ) { }

  ngOnInit() {
      this.hpCallCreateForm = new FormGroup({
          id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          loai: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          cau_hoi: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          to_chuc_id: new FormControl(null, {
              validators: [ Validators.required ]
          })
      });
      this.hpCallEditForm = new FormGroup({
          id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          loai: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          cau_hoi: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          to_chuc_id: new FormControl(null, {
              validators: [ Validators.required ]
          })
      });

      this.hpcallService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
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
      });


  }
    show_page(index) {
        this.page = index;
        this.hpcallService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
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
    onCreateHpCallSubmit(event) {
        event.preventDefault();
        const data = this.hpCallCreateForm.value;
        data.to_chuc_id = this.toChuc.id;
        console.log(data);

        this.hpcallService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.HpCall.push(res);
            (<any>$('#add_hpcall')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    }
    openEdit(index) {

        this.hpCallEditForm.get('id').patchValue(this.HpCall[index].id);
        this.hpCallEditForm.get('loai').patchValue(this.HpCall[index].loai);

        this.hpCallEditForm.get('cau_hoi').patchValue(this.HpCall[index].cau_hoi);
        this.hpCallEditForm.get('to_chuc_id').patchValue(this.HpCall[index].to_chuc_id);

        this.editIndex = index;
    }
    onEditSubmit(event) {
        event.preventDefault();

        const data = this.hpCallEditForm.value;
        data.to_chuc_id = this.toChuc.id;

        this.hpcallService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.HpCall[this.editIndex] = res;
            (<any>$('#edit_hpcall')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    }

    onDeleteSubmit() {
        const data: any = {};
        data.id = this.HpCall[this.deleteIndex].id;
        data.to_chuc_id = this.toChuc.id;

        this.hpcallService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
            console.log(res);
            this.HpCall.splice(this.deleteIndex, 1);
            (<any>$('#delete_hpcall')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
        });
    }

}

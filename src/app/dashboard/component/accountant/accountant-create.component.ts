import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {AccountantService} from '../../../shared/accountant.service';

@Component({
  selector: 'app-accountant-create',
  templateUrl: './accountant-create.component.html',
  styleUrls: ['./accountant-create.component.scss']
})

export class AccountantCreateComponent implements OnInit, OnDestroy {
  accountantCreateForm;
  toChuc = environment.toChuc;
  accountants;
  alive = true;
  editIndex;
  deleteIndex;
  accountEditForm;

  constructor(private accountantService: AccountantService) { }

  ngOnInit() {
    this.accountantCreateForm = new FormGroup({
      so_hieu_tai_khoang: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten_tai_khoang: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }

  onCreate(event) {
    event.preventDefault();
    const data = this.accountantCreateForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.accountantService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      (<any>$('#add_accountant')).modal('hide');
    }, err => console.log(err));
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

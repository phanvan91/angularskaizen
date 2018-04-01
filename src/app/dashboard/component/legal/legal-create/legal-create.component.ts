import {Component, EventEmitter, OnDestroy, OnInit, Output, Host} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DoiTuongPhapNhanService} from '../../../../shared/doi-tuong-phap-nhan.service';
import {environment} from '../../../../../environments/environment';
import { ToastyService } from 'ng2-toasty';
@Component({
  selector: 'app-legal-create',
  templateUrl: './legal-create.component.html',
  styleUrls: ['./legal-create.component.scss']
})
export class LegalCreateComponent implements OnInit, OnDestroy {

  createDoiTuongPhapNhanForm;
  toChuc = environment.toChuc;
  alive = true;
  loaiDoiTuongPhapNhan = environment.loai_doi_tuong_phap_nhan;

  @Output() doiTuongPhapNhanAdded = new EventEmitter<boolean>();

  constructor(private doiTuongPhapNhanService: DoiTuongPhapNhanService,
              private toastService: ToastyService  ) { }

  ngOnInit() {
    this.createDoiTuongPhapNhanForm = new FormGroup({
      ma: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten: new FormControl(null, {
        validators: [Validators.required]
      }),
      loai: new FormControl(1, {
        validators: [Validators.required]
      })
    });
  }

  onCreate(event) {
    event.preventDefault();

    const data = this.createDoiTuongPhapNhanForm.value;
    data.to_chuc_id = this.toChuc.id;

    this.doiTuongPhapNhanService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.doiTuongPhapNhanAdded.next(res);
      (<any>$('#add_legal')).modal('hide');
      this.toastService.success({ title: 'Thao tác thành công', msg: '' });
    }, err => {
      this.toastService.error({ title: 'Thất bại', msg: err.error });
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

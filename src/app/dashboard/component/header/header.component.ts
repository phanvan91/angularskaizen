import { Component, OnInit } from '@angular/core';
import {TrungTamBaoHanhService} from '../../../shared/trung-tam-bao-hanh.service';
import {KhoService} from '../../../shared/kho.service';
import {AuthService} from '../../../shared/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  trungTamBaoHanh;
  tramBHSelected;
  serialSearch;
  userInfo;
  openListTTBH = false;

  constructor(private trungTamBaoHanhService: TrungTamBaoHanhService, private khoService: KhoService,
          private authService: AuthService,
          private router: Router) {
  }

  ngOnInit() {
    this.trungTamBaoHanhService.getList().subscribe((res: any) => {
      if (res.length > 0) {
        this.trungTamBaoHanh = res;
        // console.log(res);
        this.authService.me().subscribe((info: any) => {
          this.userInfo = info;

          if (this.userInfo.tram_bao_hanh_id) {
            const tTbh = this.trungTamBaoHanh.find(x => x.id == this.userInfo.trung_tam_bao_hanh_id);
            const tBh = tTbh.tram_bao_hanh.find(x => x.id == this.userInfo.tram_bao_hanh_id);

            this.tramBHSelected = 'Trạm BH: ' + tBh.ten;
            let data = {  params: {
              trung_tam_bao_hanh_id: tTbh.id, tram_bao_hanh_id: tBh.id
            }};
            this.khoService.getKhoTrungTamBaoHanh(data).subscribe((khoData: any) => {
              if (khoData) {
                this.khoService.setKhoSelected(khoData); console.log(khoData);
              }
            });
          }else if (this.userInfo.trung_tam_bao_hanh_id) {
            this.openListTTBH = true;
            const tTbh = this.trungTamBaoHanh.find(x => x.id == this.userInfo.trung_tam_bao_hanh_id);
            this.tramBHSelected = 'Trung tâm BH: ' + tTbh.ten;
            let data = {  params: {  trung_tam_bao_hanh_id: tTbh.id  }   };
            this.khoService.getKhoTrungTamBaoHanh(data).subscribe((khoData: any) => {
              if (khoData) {
                this.khoService.setKhoSelected(khoData); console.log(khoData);
              }
            });
          }else {
            this.openListTTBH = true;
            this.onSelectTTBH(this.trungTamBaoHanh[0], 1);
          }
        });
      }
    });

  }
  getSearchSerial(event) {
    event.preventDefault();
    if (this.serialSearch) {
      this.router.navigateByUrl('/dashboard/danh-sach-phieu-bao-hanh?serial=' + this.serialSearch);
    }else {
      this.router.navigateByUrl('/dashboard/danh-sach-phieu-bao-hanh');
    }
  }
  onSelectTTBH(item, type) {
    if (type == 1) {
      this.trungTamBaoHanhService.setTTSelect(item.id);
      this.tramBHSelected = 'Trung tâm BH: '+item.ten;
      let data = {  params: {  trung_tam_bao_hanh_id: item.id  }   };
      this.khoService.getKhoTrungTamBaoHanh(data).subscribe((res:any)=>{
        if(res){
          this.khoService.setKhoSelected(res);
          // console.log(res);
        }
      });
    }else {
      this.trungTamBaoHanhService.setTTSelect(item.trung_tam_bao_hanh_id);
      this.tramBHSelected = 'Trạm BH: '+item.ten;
      let data = {  params: {
         trung_tam_bao_hanh_id: item.trung_tam_bao_hanh_id, tram_bao_hanh_id: item.id
      }};
      this.khoService.getKhoTrungTamBaoHanh(data).subscribe((res:any)=>{
        if(res){
          this.khoService.setKhoSelected(res); console.log(res);
        }
      });
    }
  }

  logOut() {
    localStorage.removeItem('sstoken');
    this.router.navigate(['auth', 'login']);
  }
}

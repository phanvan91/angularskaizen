import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/auth.service';
import {Router} from '@angular/router';
import {ToastData, ToastOptions, ToastyService} from 'ng2-toasty';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {


  loginForm;
  alive = true;

  constructor(private authService: AuthService, private router: Router,
    private toastService: ToastyService) { }

  ngOnInit() {
    if(localStorage.getItem('sstoken')){
      this.authService.getToChuc().subscribe((res: any) => {
        this.toastService.success({title: 'Đã đăng nhập',msg: ''});
        setTimeout(() => {
          this.router.navigate(['']);
        }, 100);
      });
    }

    this.loginForm = new FormGroup({
      email: new FormControl(null, {
        validators: [ Validators.email, Validators.required]
      }),
      password: new FormControl(null, {
        validators: [ Validators.minLength(6), Validators.required ]
      })
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const data = this.loginForm.value;
    this.authService.login(data).takeWhile(() => this.alive)
      .subscribe((res: any) => {
      this.authService.saveInfo(res);
      this.authService.setCredentialsSource(res);
      this.toastService.success({title: 'Đăng nhập thành công',msg: ''});
      this.router.navigate(['']);
    }, err => {
      if(err.status == 401){
        this.toastService.error({title: 'Tài khoản hoặc mật khẩu chưa chính xác',msg: 'Vui lòng kiểm tra lại'});
      }else {
        this.toastService.error({title: 'Lỗi đăng nhập',msg: err.error});
      }
    });
  }

  ngOnDestroy(): void {
  }
}

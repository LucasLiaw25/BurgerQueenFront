import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loggin',
  imports: [
    RouterLink,
    FormsModule,
    CommonModule
  ],
  templateUrl: './loggin.html',
  styleUrl: './loggin.css',
})
export class Loggin {
  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  user: LoginRequest = {
    email: '',
    password: ''
  };
  errorMessage = "";

  onLogin():void {
    this.authService.login(this.user).subscribe({
      next:(response)=>{
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.zone.run(() => {
        this.errorMessage = error.error?.message || "Erro no login";
        this.cdr.detectChanges(); 
      });
    }
    });
  }

  showPassword = false;

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}

getPasswordType(): string {
  return this.showPassword ? 'text' : 'password';
}
}

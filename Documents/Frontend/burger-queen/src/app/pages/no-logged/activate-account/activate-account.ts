import { ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { catchError, finalize, throwError, timeout } from 'rxjs';
import { ActivateRequest } from '../../../models/user.model';

@Component({
  selector: 'app-activate-account',
  imports: [FormsModule, CommonModule],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.css',
})
export class ActivateAccount {
  activationCode: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  successMessage: string = '';

  request: ActivateRequest = {
    code: ""
  }

  @ViewChild('codeInput', { static: true }) codeInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ){}

  onInput(event: any) {
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    this.activationCode = value.substring(0, 5);
    event.target.value = this.activationCode;
  }

  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
      'Tab', 'Home', 'End'
    ];
    
    const isAllowedKey = allowedKeys.includes(event.key);
    const isAlphanumeric = /^[a-zA-Z0-9]$/.test(event.key);
    
    if (!isAllowedKey && !isAlphanumeric) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (pasteData) {
      this.activationCode = pasteData.substring(0, 5);
      setTimeout(() => {
        const input = event.target as HTMLInputElement;
        input.focus();
        input.setSelectionRange(this.activationCode.length, this.activationCode.length);
      }, 10);
    }
  }

  activate() {
    const code = this.activationCode.trim();
    
    if (code.length !== 5) {
      this.errorMessage = "O código deve ter exatamente 5 dígitos";
      this.shakeInput();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.request.code = code;

    this.authService.activateUser(this.request)
    .pipe(
      finalize(() => {
        this.zone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      })
    )
    .subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.successMessage = "Conta ativada com sucesso! Redirecionando...";
          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.errorMessage = "Código inválido ou expirado.";
          this.shakeInput();
          this.cdr.detectChanges();
        });
      }
    });
  }

  clearCode() {
    this.activationCode = '';
    setTimeout(() => {
      if (this.codeInput && this.codeInput.nativeElement) {
        this.codeInput.nativeElement.focus();
      }
    }, 100);
  }

  shakeInput() {
    const input = document.querySelector('.single-digit-input');
    if (input) {
      input.classList.add('shake');
      setTimeout(() => {
        input.classList.remove('shake');
      }, 500);
    }
  }

}
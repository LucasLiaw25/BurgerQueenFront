import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

interface UserRequest {
  name: string;
  phone: string;
  email: string;
  cpf: string;
  password: string;
}

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp implements OnInit {
  signupForm!: FormGroup;
  errorMessage = "";
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Validador customizado para senha forte
  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasMinLength = value.length >= 8;

    const errors: ValidationErrors = {};
    
    if (!hasUpperCase) {
      errors['uppercase'] = 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!hasLowerCase) {
      errors['lowercase'] = 'A senha deve conter pelo menos uma letra minúscula';
    }
    if (!hasNumeric) {
      errors['numeric'] = 'A senha deve conter pelo menos um número';
    }
    if (!hasMinLength) {
      errors['minlength'] = 'A senha deve ter pelo menos 8 caracteres';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validador para confirmar senha
  private confirmPasswordValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  // Métodos getter para facilitar o acesso no template
  get f() {
    return this.signupForm.controls;
  }

  get passwordErrors() {
    return this.f['password'].errors || {};
  }

  get nameErrors() {
    return this.f['name'].errors || {};
  }

  get emailErrors() {
    return this.f['email'].errors || {};
  }

  get phoneErrors() {
    return this.f['phone'].errors || {};
  }

  get cpfErrors() {
    return this.f['cpf'].errors || {};
  }

  get termsErrors() {
    return this.f['terms'].errors || {};
  }

  get confirmPasswordErrors() {
    return this.f['confirmPassword'].errors || {};
  }

  // Máscara para CPF
  private formatCPF(cpf: string): string {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length > 11) {
      cpf = cpf.substring(0, 11);
    }
    
    if (cpf.length <= 3) {
      return cpf;
    } else if (cpf.length <= 6) {
      return `${cpf.substring(0, 3)}.${cpf.substring(3)}`;
    } else if (cpf.length <= 9) {
      return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6)}`;
    } else {
      return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
    }
  }

  // Máscara para telefone
  private formatPhone(phone: string): string {
    phone = phone.replace(/\D/g, '');
    
    if (phone.length > 11) {
      phone = phone.substring(0, 11);
    }
    
    if (phone.length <= 2) {
      return `(${phone}`;
    } else if (phone.length <= 6) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2)}`;
    } else if (phone.length <= 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    } else {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
  }

  initForm(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.confirmPasswordValidator.bind(this) });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  getPasswordType(field: 'password' | 'confirmPassword'): string {
    if (field === 'password') {
      return this.showPassword ? 'text' : 'password';
    } else {
      return this.showConfirmPassword ? 'text' : 'password';
    }
  }

  onCPFInput(event: any): void {
    const input = event.target;
    const formatted = this.formatCPF(input.value);
    this.signupForm.patchValue({ cpf: formatted });
    
    setTimeout(() => {
      input.selectionStart = input.selectionEnd = formatted.length;
    });
  }

  onPhoneInput(event: any): void {
    const input = event.target;
    const formatted = this.formatPhone(input.value);
    this.signupForm.patchValue({ phone: formatted });
    
    setTimeout(() => {
      input.selectionStart = input.selectionEnd = formatted.length;
    });
  }

  // Método para verificar a força da senha
  getPasswordStrength(): { strength: number; message: string } {
    const password = this.f['password'].value;
    if (!password) return { strength: 0, message: '' };

    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;

    let message = '';
    if (strength === 4) message = 'Senha forte';
    else if (strength >= 2) message = 'Senha média';
    else message = 'Senha fraca';

    return { strength, message };
  }

  // Verifica se um requisito específico da senha está atendido
  isPasswordRequirementMet(requirement: string): boolean {
    const password = this.f['password'].value;
    if (!password) return false;

    switch(requirement) {
      case 'length':
        return password.length >= 8;
      case 'uppercase':
        return /[A-Z]/.test(password);
      case 'lowercase':
        return /[a-z]/.test(password);
      case 'number':
        return /[0-9]/.test(password);
      default:
        return false;
    }
  }

  onRegister(): void {
    if (this.signupForm.invalid || this.loading) {
      Object.keys(this.f).forEach(key => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    
    const userData = { ...this.signupForm.value };
    delete userData.confirmPassword;
    delete userData.terms;

    userData.cpf = userData.cpf.replace(/\D/g, '');
    userData.phone = userData.phone.replace(/\D/g, '');

    this.authService.createUser(userData).subscribe({
      next: (response) => {
        this.errorMessage = '';
        this.successMessage = "Cadastro realizado! Verifique seu e-mail, estamos te redirecionando...";
        this.signupForm.reset();
        setTimeout(() => {
          this.router.navigate(['/activate']);
        }, 3000);
      },
      error: (err) => {
        console.error('Erro no cadastro:', err);
        if (err.status === 409) {
          this.errorMessage = "Este e-mail já está cadastrado";
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = "Erro ao cadastrar usuário. Tente novamente.";
        }
      }
    });
  }
}
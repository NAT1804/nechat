import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static passwordsMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if ((password !== null && passwordConfirm !== null) && password === passwordConfirm) {
      return null;
    } else {
      return {
        passwordNotMaching: true
      }
    }
  }
}

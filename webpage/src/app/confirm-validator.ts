import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
    
export function ConfirmValidator(matchingControlName: string): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
        const matchingControl = control.parent?.get(matchingControlName);
        if (matchingControl && matchingControl.errors && !matchingControl.errors.confirmValidator) {
            return Promise.resolve(null);
        } else if (matchingControl && control.value !== matchingControl.value) {
            return Promise.resolve({ confirmValidator: true });
        } else {
            return Promise.resolve(null);
        }
    }
}
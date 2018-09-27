import {Component, OnInit} from '@angular/core';
import {Customer} from './customer';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';


function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return {'range': true};
    }
    return null;
  };
}


/*function ratingRange(c: AbstractControl): { [key: string]: boolean } | null  {
    if (c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
      return { 'range': true };
    }
    return null;
  }*/


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer: Customer = new Customer();

  constructor(private fb: FormBuilder) {
  }


  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(10)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
        confirmEmail: ['', Validators.required],
      }),
      phone: '',
      notification: 'email',
      sendCatalog: true,
      rating: ['', ratingRange(1, 5)]
    });
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: 'Heena',
      lastName: 'Manglani',
      sendCatalog: false,
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  sendNotification(notifyVia: string): void {
    const phoneField = this.customerForm.get('phone');
    const EmailField = this.customerForm.get('email');
    if (notifyVia === 'text') {
      phoneField.setValidators(Validators.required);
      // EmailField.clearValidators();
    } else {
      phoneField.clearValidators();
    }

    phoneField.updateValueAndValidity();
  }
}


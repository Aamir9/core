import {
  Component,
  Input,
  Injector,
  Renderer2,
  ElementRef,
  OnInit
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { AbpValidationError } from './abp-validation.api';

@Component({
  selector: 'abp-validation-summary',
  templateUrl: './abp-validation.summary.component.html'
})
export class AbpValidationSummaryComponent extends AppComponentBase implements OnInit {

  defaultValidationErrors: Partial<AbpValidationError>[] = [
    { name: 'required', localizationKey: 'ThisFieldIsRequired' },
    {
      name: 'minlength',
      localizationKey: 'PleaseEnterAtLeastNCharacter',
      propertyKey: 'requiredLength',
    },
    {
      name: 'maxlength',
      localizationKey: 'PleaseEnterNoMoreThanNCharacter',
      propertyKey: 'requiredLength',
    },
    {
      name: 'email',
      localizationKey: 'InvalidEmailAddress',
    },
    {
      name: 'pattern',
      localizationKey: 'InvalidPattern',
      propertyKey: 'requiredPattern',
    },
    {
      name: 'validateEqual',
      localizationKey: 'PairsDoNotMatch',
    },
  ];
  validationErrors = <AbpValidationError[]>this.defaultValidationErrors;

  @Input() control: AbstractControl;
  @Input() controlEl: ElementRef;

  constructor(injector: Injector, public _renderer: Renderer2) {
    super(injector);
  }

  @Input() set customValidationErrors(val: AbpValidationError[]) {
    if (val && val.length > 0) {
      const defaults = this.defaultValidationErrors.filter(
        (defaultValidationError) =>
          !val.find(
            (customValidationError) =>
              customValidationError.name === defaultValidationError.name
          )
      );
      this.validationErrors = <AbpValidationError[]>[...defaults, ...val];
    }
  }

  private getNativeEl(): any {
    const el: any = this.controlEl as any;
    if (!el) {
      return null;
    }
    // Case 1: ElementRef -> use nativeElement
    if (el.nativeElement) {
      return el.nativeElement;
    }
    // Case 2: real DOM element (template ref on a plain element)
    if (typeof el.nodeType === 'number' && el.classList) {
      return el;
    }
    // Case 3: template ref on an Angular component (e.g. ng-select) -> not a DOM element
    return null;
  }

  ngOnInit() {
    if (this.controlEl && this.control) {
      this.control.valueChanges.subscribe(() => {
        if (
          this.control.valid &&
          (this.control.dirty || this.control.touched)
        ) {
          const nativeEl = this.getNativeEl();
          if (nativeEl) {
            this._renderer.removeClass(nativeEl, 'is-invalid');
          }
        }
      });
    }
  }

  getValidationErrorMessage(error: AbpValidationError): string {
    const nativeEl = this.getNativeEl();
    if (nativeEl) {
      this._renderer.addClass(nativeEl, 'is-invalid');
    }

    const propertyValue = this.control.errors[error.name][error.propertyKey];
    return !!propertyValue
      ? this.l(error.localizationKey, propertyValue)
      : this.l(error.localizationKey);
  }
}

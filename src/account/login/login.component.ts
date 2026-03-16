import { Component, Injector } from '@angular/core';
import { AbpSessionService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AccountServiceProxy, IsTenantAvailableInput, IsTenantAvailableOutput } from '@shared/service-proxies/service-proxies';
import { AppTenantAvailabilityState } from '@shared/AppEnums';
import { AppSessionService } from '@shared/session/app-session.service';


@Component({
  templateUrl: './login.component.html',
  animations: [accountModuleAnimation()],
   styleUrls: ['./login.component.css'],
})
export class LoginComponent extends AppComponentBase {
  submitting = false;
  tenancyName = '';
  showPassword = false;
  
  constructor(
    injector: Injector,
    public authService: AppAuthService,
    private _sessionService: AbpSessionService,
    private _accountService: AccountServiceProxy,
    public _appSessionService: AppSessionService,
  
  ) {
    super(injector);
  }

  // get multiTenancySideIsTeanant(): boolean {
  //   return this._sessionService.tenantId > 0;
  // }

  // get isSelfRegistrationAllowed(): boolean {
  //   if (!this._sessionService.tenantId) {
  //     return false;
  //   }

  //   return true;
  // }

  // login(): void {
  //   this.submitting = true;
  //   this.authService.authenticate(() => (this.submitting = false));
  //   debugger
  // }

//  login(): void {
//     this.submitting = true;
//     this.authService.authenticate(() => (this.submitting = false));
//   }
//   setTenantDefault() {
//     //  let tenancyName = 'Mens_room';
//       let tenancyName = 'Alert-it';
//       const input = new IsTenantAvailableInput();
//       input.tenancyName = tenancyName;
//       this.submitting = true;
//       this._accountService.isTenantAvailable(input).subscribe(
//         async (result: IsTenantAvailableOutput) => {
//           switch (result.state) {
//             case AppTenantAvailabilityState.Available:
//               console.log('In result state', result);
//               abp.multiTenancy.setTenantIdCookie(result.tenantId);
//               location.reload();
//               return;
//             case AppTenantAvailabilityState.InActive:
//               this.message.warn(this.l('TenantIsNotActive', tenancyName));
//               break;
//             case AppTenantAvailabilityState.NotFound:
//               this.message.warn(
//                 this.l('ThereIsNoTenantDefinedWithName{0}', tenancyName)
//               );
//               break;
//           }
//         }, error => {
//           console.log(error)
//         },
//         () => {
//           this.submitting = false;
//         }
//       );
//     }
 get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return true;
  }

  login(): void {
    this.submitting = true;
    this.authService.authenticate(() => (this.submitting = false));
  }
  setTenantDefault() {
    const input = new IsTenantAvailableInput();
    input.tenancyName = this.tenancyName; // Use the tenancy name selected from the UI
    this.submitting = true;
    console.log('Checking tenant with Tenancy Name:', this.tenancyName);
    this._accountService.isTenantAvailable(input).subscribe(
      async (result: IsTenantAvailableOutput) => {
        console.log('Tenant ID:', result.tenantId, 'Tenancy Name:', this.tenancyName);
        switch (result.state) {
          case AppTenantAvailabilityState.Available:
            console.log('Tenant is available:', result);
            abp.multiTenancy.setTenantIdCookie(result.tenantId);
            location.reload();
            return;
          case AppTenantAvailabilityState.InActive:
            this.message.warn(this.l('TenantIsNotActive', this.tenancyName));
            break;
          case AppTenantAvailabilityState.NotFound:
            this.message.warn(
              this.l('ThereIsNoTenantDefinedWithName{0}', this.tenancyName)
            );
            break;
        }
      },
      error => {
        console.log(error);
      },
      () => {
        this.submitting = false;
      }
    );
  }

togglePassword() {
  this.showPassword = !this.showPassword;
}


 
}

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
  tenancyName = 'core';
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

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return true;
  }

  // login(): void {
  //   this.submitting = true;
  //   this.authService.authenticate(() => (this.submitting = false));
  //   debugger
  // }

 login(): void {
        this.submitting = true;

        const input = new IsTenantAvailableInput();
        input.tenancyName = this.tenancyName;

        this._accountService.isTenantAvailable(input).subscribe(
            (result: IsTenantAvailableOutput) => {
                if (result.state === AppTenantAvailabilityState.Available) {
                    abp.multiTenancy.setTenantIdCookie(result.tenantId);
                    this.authService.authenticate(() => (this.submitting = false));
                } else {
                    this.submitting = false;
                    this.message.warn(
                        result.state === AppTenantAvailabilityState.InActive
                            ? `Tenant "${this.tenancyName}" is not active`
                            : `No tenant found with name "${this.tenancyName}"`
                    );
                }
            },
            () => {
                this.submitting = false;
            }
        );
    }



togglePassword() {
  this.showPassword = !this.showPassword;
}


  setTenantDefault() {
      let tenancyName = 'core';
      const input = new IsTenantAvailableInput();
      input.tenancyName = tenancyName;
      this.submitting = true;
      this._accountService.isTenantAvailable(input).subscribe(
        async (result: IsTenantAvailableOutput) => {
          switch (result.state) {
            case AppTenantAvailabilityState.Available:
              abp.multiTenancy.setTenantIdCookie(result.tenantId);
              location.reload();
              return;
            case AppTenantAvailabilityState.InActive:
              this.message.warn(this.l('TenantIsNotActive', tenancyName));
              break;
            case AppTenantAvailabilityState.NotFound:
              this.message.warn(
                this.l('ThereIsNoTenantDefinedWithName{0}', tenancyName)
              );
              break;
          }
        }, error => {
          console.log(error)
        },
        () => {
          this.submitting = false;
        }
      );
    }
}
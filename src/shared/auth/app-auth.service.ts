import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TokenService, LogService, UtilsService } from 'abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import {
    AuthenticateModel,
    AuthenticateResultModel,
    TokenAuthServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Injectable()
export class AppAuthService {
    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    rememberMe: boolean;

    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private _utilsService: UtilsService,
        private _tokenService: TokenService,
        private _logService: LogService,
        private _appSessionService: AppSessionService
    ) {
        this.clear();
    }

    logout(reload?: boolean): void {
        abp.auth.clearToken();
        abp.utils.deleteCookie(AppConsts.authorization.encryptedAuthTokenName);
        
        if (reload !== false) {
            location.href = AppConsts.appBaseUrl;
        }
    }

    authenticate(finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });

        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .pipe(
                finalize(() => {
                    finallyCallback();
                })
            )
            .subscribe((result: AuthenticateResultModel) => {
                this.processAuthenticateResult(result);
            });
    }

    private processAuthenticateResult(
        authenticateResult: AuthenticateResultModel
    ) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.accessToken) {
            // Successfully logged in
            this.login(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                this.rememberMe
            );
        } else {
            // Unexpected result!

            this._logService.warn('Unexpected authenticateResult!');
            this._router.navigate(['account/login']);
        }
    }

   private login(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean) {
        const tokenExpireDate = rememberMe ? new Date(new Date().getTime() + 1000 * expireInSeconds) : undefined;
        debugger;
        this._tokenService.setToken(accessToken, tokenExpireDate);
        this._utilsService.setCookieValue(AppConsts.authorization.encryptedAuthTokenName, encryptedAccessToken, tokenExpireDate, abp.appPath);

        // Load session
        this._appSessionService.init().then(() => {
            const user = this._appSessionService.user;
             
            if (!user) {
                console.error('Session failed to load');
                this._router.navigate(['/account/login']);
                return;
            }
        

            if (this._appSessionService.isCustomerUser()) {
                // Customer → redirect to details page
                this._router.navigate([`/app/policies/`], { queryParams: { userId: user.id } });
            } else {
                // Admin or other users → redirect to dashboard
            //     let initialUrl = UrlHelper.initialUrl;
            //    if (initialUrl.includes('/login') || !initialUrl) {
            //         // initialUrl = AppConsts.appBaseUrl;
            //   setTimeout(() => {
            //     this._router.navigate(['/app/customers']);
            // }, 0);
            //     }
            //     this._router.navigateByUrl(initialUrl);

                 setTimeout(() => {
                this._router.navigate(['/app/customers']);
            }, 0);
            }
        });
    }
    

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }
}

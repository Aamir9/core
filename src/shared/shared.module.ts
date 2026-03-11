import { FormsModule } from '@angular/forms';
import { CustomFieldsComponent } from './components/custom-fields/custom-fields.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { DateConverterDirective } from './directives/date-converter.directive';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { SafePipe } from '@shared/pipes/safe.pipe';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

import { AbpPaginationControlsComponent } from './components/pagination/abp-pagination-controls.component';
import { AbpValidationSummaryComponent } from './components/validation/abp-validation.summary.component';
import { AbpModalHeaderComponent } from './components/modal/abp-modal-header.component';
import { AbpModalFooterComponent } from './components/modal/abp-modal-footer.component';
import { LayoutStoreService } from './layout/layout-store.service';

import { BusyDirective } from './directives/busy.directive';
import { EqualValidator } from './directives/equal-validator.directive';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChatComponent } from './components/chat/chat.component';
import { ChatService } from './service-custom/chat.service';
import { EventService } from './service-custom/event.service';
import { NgxFileDropModule } from 'ngx-file-drop';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import{  PaginationComponent} from './customPagination/pagination.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgxPaginationModule,
        NgxFileDropModule,
        FormsModule
    ],
    declarations: [
        PaginationComponent,
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        SafePipe,
        HumanizePipe,
        BusyDirective,
        EqualValidator,
        DateConverterDirective,
        UploadPhotoComponent,
        CustomFieldsComponent,
        ChatComponent,
        UploadFileComponent
    ],
    exports: [
        PaginationComponent,
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        SafePipe,
        HumanizePipe,
        BusyDirective,
        EqualValidator,
        DateConverterDirective,
        UploadPhotoComponent,
        CustomFieldsComponent,
        ChatComponent,
        NgxFileDropModule,
        UploadFileComponent
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AppSessionService,
                AppUrlService,
                AppAuthService,
                AppRouteGuard,
                LayoutStoreService,
                BsModalRef,
                ChatService,
                EventService,
                
            ]
        };
    }
}

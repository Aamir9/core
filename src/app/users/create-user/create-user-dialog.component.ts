import { UserTypeServiceProxy, UserTypeDto } from './../../../shared/service-proxies/service-proxies';
import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  UserServiceProxy,
  CreateUserDto,
  RoleDto
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { UserTypes } from '@shared/AppConsts';
import { Base64Image } from '@shared/modals/base64image';

@Component({
  templateUrl: './create-user-dialog.component.html'
})
export class CreateUserDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  user = new CreateUserDto();
  roles: RoleDto[] = [];
  userTypes :UserTypeDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  isPhotoUploaded = true;
  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.user.isActive = true;

    this._userService.getRoles().subscribe((result) => {
      this.roles = result.items;
      this.setInitialRolesStatus();
    });

    this.setUserTypes();
  }
  setUserTypes() {
    this._userTypeService.getAll().subscribe((result) => {
      this.userTypes = result.items;
      this.setEmployeeUserType();
    }
    );
  }

  private setEmployeeUserType() {
    var employeeType = this.userTypes.find(u => u.name == UserTypes.Employee);
    if (employeeType)
      this.user.userTypeId = employeeType.id;
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return this.defaultRoleCheckedStatus;
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  save(): void {
    this.saving = true;

    this.user.roleNames = this.getCheckedRoles();

    this._userService.create(this.user).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }
  onFileUploadHandler(image: Base64Image) {
    this.user.base64Picture = image.ImageBase64String;
  }
}

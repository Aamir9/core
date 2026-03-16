import {
  Component,
  OnInit,
  Injector,
  ChangeDetectionStrategy
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { filter as _filter } from 'lodash-es';


@Component({
  selector: 'account-languages',
  templateUrl: './account-languages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountLanguagesComponent extends AppComponentBase
  implements OnInit {
  languages: abp.localization.ILanguageInfo[];
  currentLanguage: abp.localization.ILanguageInfo;
  hover = false;


  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
      const defaultLang = 'da';

  if (this.localization.currentLanguage.name !== defaultLang) {
    this.changeLanguage(defaultLang);
    return;
  }

  this.languages = _filter(
    this.localization.languages,
    (l) => !l.isDisabled
  );

  this.currentLanguage = this.localization.currentLanguage;
    console.log('Current browser language:', navigator.language);
    
    this.languages = _filter(
      this.localization.languages,
      (l) => !l.isDisabled
    );
    this.currentLanguage = this.localization.currentLanguage;
  }

   changeLanguage(languageName: string): void {
    abp.utils.setCookieValue(
      'Abp.Localization.CultureName',
     languageName,
      new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
      abp.appPath
     );

   location.reload();
  }
  


}

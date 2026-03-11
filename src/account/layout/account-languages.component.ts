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
    this.languages = _filter(
      this.localization.languages,
      (l) => !l.isDisabled
    );
    this.currentLanguage = this.localization.currentLanguage;
  }

  // changeLanguage(languageName: string): void {
  //   abp.utils.setCookieValue(
  //     'Abp.Localization.CultureName',
  //     languageName,
  //     new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
  //     abp.appPath
  //   );

  //   location.reload();
  // }
  changeLanguageToEnglish(): void {
  const englishLanguage: abp.localization.ILanguageInfo = {
    name: 'en',
    displayName: 'English',
    icon: 'famfamfam-flag-gb', // optional
    isDefault: true,
    isDisabled: false,
    isRightToLeft: false
  };

  console.log('Current Language before change:', abp.localization.currentLanguage);

  if (abp.localization.currentLanguage.name !== englishLanguage.name) {
    abp.localization.currentLanguage = englishLanguage;
    localStorage.setItem('Abp.Localization.CultureName', englishLanguage.name);
 
    location.reload();
  } else {
    console.log('Language is already English');
    // alert('Language is already English'); // optional user feedback
    abp.message.info(this.l('Language is already English'));
  }
}

}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  headerTitle: string = '';

  constructor(
    private _layoutService: LayoutStoreService,
    private _authService: AppAuthService,
    public  _appSessionService: AppSessionService  // ✅ add this
  ) {}

  ngOnInit(): void {
    this._layoutService.$headerTitle.subscribe(title => {
      this.headerTitle = title;
    });
  }

  logout(): void {
    this._authService.logout();
  }
}

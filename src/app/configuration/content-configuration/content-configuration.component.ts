import { Component, OnInit } from "@angular/core";
import {
  IPageConfigDto,
  PageConfigServiceProxy,
  UpdatePageConfigDto,
} from "@shared/service-proxies/service-proxies";
import { environment } from "environments/environment";
import { defaultConfig } from "./default-config";

@Component({
  selector: "app-content-configuration",
  templateUrl: "./content-configuration.component.html",
  styleUrls: ["./content-configuration.component.css"],
})
export class ContentConfigurationComponent implements OnInit {
  currentIndex: number = 0;
  sections: string[] = [];
  pageConfig: IPageConfigDto = {} as IPageConfigDto;
  config = defaultConfig;
  iframeBaseUrl = `${environment.tenantAppUrl}/main?section=`;
  iframeUrl = "";

  constructor(private _pageConfigService: PageConfigServiceProxy) {}

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig() {
    this._pageConfigService.get().subscribe((res) => {
      if (res && res.length) {
        this.pageConfig = res.find((item) => item.name == "Home");
        this.config = JSON.parse(this.pageConfig.config);
      }
      this.sections = Object.keys(this.config);
      this.onSectionClick(0);
    });
  }

  public onSectionClick(index: number) {
    this.currentIndex = index;
    this.iframeUrl = this.iframeBaseUrl + Object.keys(this.config)[index];
    this.sendDataToIframe();
  }

  public get activeSectionFields(): string[] {
    const activeSection = this.config[this.sections[this.currentIndex]];
    return Object.keys(activeSection);
  }

  onLoad() {
    setTimeout(() => {
      this.sendDataToIframe();
    }, 500);
  }

  sendDataToIframe(): void {
    let iframe = document.getElementById("iframe") as HTMLIFrameElement;
    iframe.contentWindow.postMessage(this.config, "*");
  }

  onSaveChanges() {
    const payload = new UpdatePageConfigDto({
      id: this.pageConfig.id,
      config: JSON.stringify(this.config),
    });
    this._pageConfigService.update(payload).subscribe((res) => {
      console.log(res);
    });
  }
}

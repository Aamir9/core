import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EyeToolDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-eye-result',
  templateUrl: './eye-result.component.html',
  styleUrls: ['./eye-result.component.css'],
  animations: [appModuleAnimation()]

})
export class EyeResultComponent implements OnInit {

  
  eyeToolModel = new EyeToolDto();
  constructor() { }

  ngOnInit(): void {
  }

}

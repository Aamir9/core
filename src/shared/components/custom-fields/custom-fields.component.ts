import { EntityFieldMappingDto } from './../../service-proxies/service-proxies';
import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { CustomFieldType } from '@shared/AppConsts';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm}]
})
export class CustomFieldsComponent implements OnInit {
  @Input() customFields:EntityFieldMappingDto[]=[];
  @Input() disabled:boolean=false;
  constructor() { 

  }

  ngOnInit() {
  }

  getCustomFieldType(type:number){
    if(type==CustomFieldType.Numeric){
      return "number";
    }
    else if(type==CustomFieldType.String){
      return "text";
    }
  }
}

import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  CreateFaultFileDto,
  FaultServiceProxy
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop";

@Component({
  selector: "app-upload-files",
  templateUrl: "./upload-files.component.html",
  styleUrls: ["./upload-files.component.css"],
})
export class UploadFilesComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<boolean>();
  saving = false;
  faultId: number;
  files: CreateFaultFileDto[] = [];

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _faultService: FaultServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {}

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.files.push({
              name: file.name,
              size: file.size,
              type: file.type,
              base64: reader.result.toString(),
            } as CreateFaultFileDto);
          };
          reader.onerror = (error) => {
            console.log("Error: ", error);
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

  removeFile(i): void {
    this.files.splice(i, 1);
  }

  async createFault() {
    if (this.files.length) {
      this.saving = true;
      try {
        await this._faultService.addFiles(this.faultId ,this.files).toPromise();
        this.notify.success(this.l("Saved Successfully"));
      } catch (error) {
        this.notify.error(this.l("Error in adding files"));
        console.log(error);
      } finally {
        this.saving = false;
        this.bsModalRef.hide();
        this.onSave.emit(true);
      }
    }
  }
}

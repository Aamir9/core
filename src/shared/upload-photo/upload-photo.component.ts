import { Base64Image } from '@shared/modals/base64image';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { LocalizationService, NotifyService } from 'abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';
@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.css']
})
export class UploadPhotoComponent implements OnInit {
  @Input() imageUrl = '';
  @Output() onFileUpload: EventEmitter<Base64Image> = new EventEmitter();
    @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('filePicker') filePicker!: ElementRef;
  showOptions = false;
  //imagePreview: string | ArrayBuffer | null = null;
  image = new Base64Image();
  imagePreview: string | ArrayBuffer = AppConsts.defaultImageUrl;
  capturedImage: string | undefined;
  isCapturing: boolean = false;
  stream: MediaStream | null = null
  constructor(
    private notifyService: NotifyService,
    private localizationService: LocalizationService
  )  {
    this.setImageToDefault();
  }

  ngOnInit() {
    console.log(this.imageUrl);
    if (this.imageUrl && this.imageUrl.length > 0) {
      this.imagePreview = this.imageUrl;
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.imageValidation(file);
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  private handleReaderLoaded(e) {
    const reader = e.target;
    this.image.ImageBase64String = reader.result;
    this.imagePreview = reader.result;
    this.onFileUpload.emit(this.image);
  }

  private imageValidation(file: File) {
    if (file.size > AppConsts.maxImageSize) {
      this.notifyService.error(this.localizationService.localize('FileSizeError', AppConsts.localization.defaultLocalizationSourceName));
      this.setImageToDefault();
      return false;
    }
    if (!_.includes(AppConsts.allowedImageTypes, file.type)) {
      this.notifyService.error(this.localizationService.localize('FileTypeError', AppConsts.localization.defaultLocalizationSourceName));
      this.setImageToDefault();
      return false;
    }
  }

  private setImageToDefault() {
    this.imagePreview = '';
    this.imagePreview = AppConsts.defaultImageUrl;
  }

  ngAfterViewInit() {
    // this.startCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();
      })
      .catch(error => {
        console.error('Error accessing the camera', error);
      });
  }

  // captureImage() {
  //   if (this.isCapturing) {
  //     const video = this.videoElement.nativeElement;
  //     const canvas = document.createElement('canvas');
  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;
  //     const context = canvas.getContext('2d');

  //     if (context) {
  //       context.drawImage(video, 0, 0, canvas.width, canvas.height);
  //       this.imagePreview = canvas.toDataURL('image/png');
  //       this.stopCamera();
  //     }
  //   } else {
  //     this.isCapturing = true;
  //     this.startCamera();
  //   }
  // }

  captureImage() {
    if (this.isCapturing) {
      // Capture the image and stop the camera
      const video = this.videoElement.nativeElement;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.imagePreview = canvas.toDataURL('image/png');
        this.onFileUpload.emit({ ImageBase64String: this.imagePreview });
        this.stopCamera();
      }
    } else {
      // Start the camera when the button is clicked
      this.isCapturing = true;
      this.startCamera();
    }
  }



  stopCamera() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach(track => track.stop());
      this.stream = null;
      this.isCapturing = false;
    }
  }




}

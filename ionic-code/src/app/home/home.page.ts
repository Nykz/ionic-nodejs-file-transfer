import { Capacitor } from '@capacitor/core';
import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  image: any;

  constructor(private http: HttpClient) {}

  async takePicture() {
    try {
      if(Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        // allowEditing: false,
        source: CameraSource.Prompt,
        width: 600,
        resultType: CameraResultType.DataUrl
      });
      console.log('image: ', image);
      this.image = image.dataUrl;

      const blob = this.dataURLtoBlob(image.dataUrl);
      const imageFile = new File([blob], 'profile.png', { type: 'image/png' });
      console.log(imageFile);
      
      let postData = new FormData();
      postData.append('photo', imageFile, 'profile.png');
      const data$ = this.http.post<any>('http://localhost:3000/photo', postData);
      const response = await lastValueFrom(data$);
      console.log(response);
    } catch(e) {
      console.log(e);
    }
  }

  dataURLtoBlob(dataurl: any) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

}

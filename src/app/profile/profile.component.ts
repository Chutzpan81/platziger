import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture : any;

  constructor(private userService: UserService,private authenticationService:AuthenticationService, private firebaseStorage:AngularFireStorage) {
    this.authenticationService.getStatus().subscribe(
      (status)=>{
        console.log(status.uid);
        this.userService.getUserById(status.uid).valueChanges().subscribe(
        (data:User)=>{
          console.log(this.user)
          this.user = data;
          console.log(this.user)
        },
        (error)=>{console.log(error)})
      },(error)=>{
        console.log(error);
      })
   }

  ngOnInit() {
  }

  saveSettings(){
    if(this.croppedImage){

      const currentPictureId = Date.now();
      
      const pictures = this.firebaseStorage.ref('pictures/'+currentPictureId+'.jpg')
      .putString(this.croppedImage, 'data_url');

      pictures.then((result)=>{

        this.picture = this.firebaseStorage.ref('pictures/'+currentPictureId+'.jpg').getDownloadURL();
        this.picture.subscribe((p)=>{
          this.userService.setAvatar(p,this.user.uid).then(()=>{
            alert("Avatar subido correctamente");
          }).catch((error)=>{
            alert("hubo un herror al tratar de subir la imagen");
            console.log(error);
          })
        })
      })
      .catch((error)=>{
        console.log(error);
      });

    }else{
      this.userService.editUser(this.user).then(()=>{
        alert("cambios guardados")
      },(error)=>{
        alert("error en los cambios")
        console.log(error)
      });
    }
    

  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  loadImageFailed() {
      // show message
  }


}

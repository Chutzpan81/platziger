import { Component, OnInit } from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import { UserService } from 'src/app/services/user.service';
import { RequestsService } from 'src/app/services/requests.service';
import { User } from 'src/app/interfaces/user';

export interface PromptModel {
    scope :any;
    currentRequest :any;
}


@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent extends DialogComponent<PromptModel, any> implements PromptModel{
  scope:any;
  shouldAdd : string = 'yes';
  currentRequest :any;
  mensaje:any;
  user:any ={
    nick :'',
    subnick:'',
    email:'',
    uid :'',
    avatar :''
  };

  constructor(public dialogService: DialogService, private userService: UserService, 
    private requestService:RequestsService) { 
    super(dialogService)

    setTimeout(()=>{
        this.userService.getUserById(this.currentRequest.sender).valueChanges().subscribe(
        (data)=>{
          this.user.avatar =data['avatar'];
          this.user.nick = data['nick'];
          this.user.subnick = data['subnick'];
          this.user.email = data['email'];
          this.mensaje = this.currentRequest.mensaje; 
          console.log(this.currentRequest)
          console.log(data);

        },
        (error)=>{console.log(error)})

    },0)
  }


  accept(){
    if(this.shouldAdd =='yes'){
      this.requestService.setRequestStatus(this.currentRequest,'accepted')
      .then((data)=>{
        
        console.log(data);
        
        this.userService.addFriend(this.scope.user.uid,this.currentRequest.sender)
        .then(()=>{
          alert("Solicitud aceptada con exito");
        })

      })
      .catch((error)=>{console.log(error);})

    }else if(this.shouldAdd =='no'){
      this.requestService.setRequestStatus(this.currentRequest,'rejected')
      .then((data)=>{console.log(data);})
      .catch((error)=>{console.log(error);})
    }else if(this.shouldAdd =='later'){
      this.requestService.setRequestStatus(this.currentRequest,'decide_later')
      .then((data)=>{console.log(data);})
      .catch((error)=>{console.log(error);})
    }
  }
}

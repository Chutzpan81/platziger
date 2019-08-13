import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  friends :User[];
  query:string=null;
  closeResult: string;
  friendemail: any;
  user: User;
  mensaje: string;
  
  constructor(private userService:UserService, private authenticationService: AuthenticationService,
    private router:Router, private modalService : NgbModal,
    private requestService :RequestsService) {
    this.userService.getUsers().valueChanges().subscribe(
    (data : User[])=>{
      this.friends = data;
    },
    (error)=>{
      console.log(error);
    });
    this.authenticationService.getStatus().subscribe((status)=>{
      this.userService.getUserById(status.uid).valueChanges().subscribe((data:User)=>{
        this.user = data;
        console.log(data);
        if(this.user.friends){
          this.user.friends = Object.values(this.user.friends);
          console.log(this.user);
        }
      });
    });

  }
  ngOnInit() {
  }
  logout(){
    this.authenticationService.logOut().then((data)=>{
      alert("Sicion cerrada");
      this.router.navigate(['login']);
    }).catch((error)=>{console.log(error)});
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  sendRequest(){
    const request ={
      timestamp : Date.now(),
      receiver_email: this.friendemail,
      sender: this.user.uid,
      status:'pending',
      mensaje: this.mensaje
    }
    this.requestService.createRequest(request).then(()=>{
      alert("solicitud envidada");
    }).catch((error)=>{
      alert('Hubo un error');
      console.log(error);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
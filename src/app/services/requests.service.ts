import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private angularFireDatabase : AngularFireDatabase) {
    
  }
  createRequest(request){
    const cleanEmail = request.receiver_email.trim().replace('.',',');
    return this.angularFireDatabase.object('/requests/'+cleanEmail+'/'+request.sender).set(request);
  }
  setRequestStatus(request,status){
    const cleanEmail = request.receiver_email.trim().replace('.',',');
    return this.angularFireDatabase.object('/requests/'+cleanEmail+'/'+request.sender+ '/status').set(status);
  }
  getRequestForEmail(email){
    const cleanEmail = email.trim().replace('.',',');
    console.log('*/requests/'+cleanEmail+"*")
    return this.angularFireDatabase.list('/requests/'+cleanEmail);
  }

}

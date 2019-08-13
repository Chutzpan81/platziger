import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  constructor(private angularFiredatabase :AngularFireDatabase) { }
  createConversation(conversation){
    return this.angularFiredatabase.object('conversations/' + conversation.uid + '/' +conversation.timestamp).set(conversation)
  }
  getConversation(uid){
    return this.angularFiredatabase.list('conversations/'+uid);
  }
  editConversation(conversation){
    return this.angularFiredatabase.object('conversations/' + conversation.uid + '/' +conversation.timestamp).set(conversation)
  }
}

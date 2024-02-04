import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleApiService, UserInfo } from './google-api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GmailOauth';
  userInfo!: UserInfo;

  mailSnippets: any[]=[];

  constructor(private googleApiService: GoogleApiService){
    googleApiService.userProfileSubject.subscribe(userProfile=>{
      this.userInfo = userProfile;
    })
  }

  /**
   * 
   * @returns boolean - if the user is logged in through google
   */
  isLoggedIn(): boolean{
    return this.googleApiService.isLoggedIn();
  }


  // getEmails(){
  //   if(this.isLoggedIn()){
  //     localStorage.setItem('token', this.googleApiService.getAccessToken());
  //   }
  //   this.googleApiService.getGmailIds(this.userInfo?.info?.sub).subscribe(gmails=>{
  //     this.mailSnippets = gmails;
  //   })
  // }

  async getEmails() {
    if (!this.userInfo) {
      return;
    }

    if(this.isLoggedIn()){
      localStorage.setItem('token', this.googleApiService.getAccessToken());
    }

    const userId = this.userInfo?.info.sub as string
    const messages = await lastValueFrom(this.googleApiService.getGmailIds(userId));
    messages.messages.forEach( (element: any) => {
      const mail = lastValueFrom(this.googleApiService.getGmail(userId, element.id))
      mail.then( mail => {
        this.mailSnippets.push(mail.snippet);
      })
    });
    localStorage.removeItem('token');
  }

  /**
   * Logs user out from google
   */
  logOut(){
    this.googleApiService.logOut()
  }
}

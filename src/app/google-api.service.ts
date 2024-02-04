import { HttpClient } from '@angular/common/http';
import { Injectable, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService implements OnInit {
  userProfileSubject = new Subject<UserInfo>();

  gmailUrl = 'https://gmail.googleapis.com';

  loggedIn = new BehaviorSubject<boolean>(false)

  constructor(private oauthService : OAuthService, private httpClient: HttpClient) {
    oauthService.configure(oAuthConfig);
    oauthService.logoutUrl = 'https://www.google.com/accounts/Logout';
    oauthService.loadDiscoveryDocument().then(res=>{
      oauthService.tryLoginImplicitFlow().then(res2=>{
        if(oauthService.hasValidAccessToken()){

          oauthService.loadUserProfile().then((userProfile:any)=>{
            this.userProfileSubject.next(userProfile);
          })
        }else {
          oauthService.initLoginFlow();
        }
      })
    })
  }

  ngOnInit(): void {
  }


  /**
   * 
   * @returns boolean - if the user is already logged in
   */
  isLoggedIn(): boolean{
    return this.oauthService.hasValidAccessToken()
  }

  getAccessToken(){
    return this.oauthService.getAccessToken();
  }


  /**
   * log user out
   */
  logOut(){
    this.oauthService.logOut();
  }


  getGmailIds(userId: string): Observable<any>{
    return this.httpClient.get(`${this.gmailUrl}/gmail/v1/users/${userId}/messages`);
  }

  getGmail(userId: string, mailId: string): Observable<any>{
    return this.httpClient.get(`${this.gmailUrl}/gmail/v1/users/${userId}/messages/${mailId}`)
  }

}

export const oAuthConfig: AuthConfig = {
  issuer: "https://accounts.google.com",
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '654685904729-ba8ruanjkjbtvm3mkqia89kpgmabj6uh.apps.googleusercontent.com',
  scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly'
}

export interface UserInfo{
  info: {
    sub: string,
    email: string,
    name: string,
    picture: string
  }
}

//https://www.googleapis.com/auth/gmail.readonly/
//https://www.googleapis.com/auth/gmail.readonly
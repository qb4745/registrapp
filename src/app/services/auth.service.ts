import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser: BehaviorSubject<User | boolean> = new BehaviorSubject(null);

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.onAuthStateChange((event, sess) => {
/*       console.log('SUPABAS AUTH CHANGED: ', event);
      console.log('SUPABAS AUTH CHANGED sess: ', sess); */

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
     /*    console.log('SET USER'); */

        this.currentUser.next(sess.user);
      } else {
/*         console.log('SET USER TO FALSE'); */
        this.currentUser.next(false);
      }
    });

    this.loadUser();
  }

  async loadUser() {
    if (this.currentUser.value) {
     /*  console.log('ALREADY GOT USER'); */
      return;
    } else {
      /* console.log('NO USER, GETTING USER'); */
    }

    const user = await this.supabase.auth.getUser();
/*     console.log('🚀 ~ file: auth.service.ts ~ line 33 ~ AuthService ~ loadUser ~ session', user); */

    if (user.data.user) {
     /*  console.log('aaaaaaaaaa'); */
      this.currentUser.next(user.data.user);
    } else {
      /* console.log('bbbbbbbbbb'); */
      this.currentUser.next(false);
    }

  }

  signUp(credentials: { email; password }) {
    return this.supabase.auth.signUp(credentials);
  }

  signIn(credentials: { email; password }) {
    return this.supabase.auth.signInWithPassword(credentials);
  }

  signInWithEmail(email: string) {
    const redirectTo = isPlatform('capacitor') ? 'registrapp://login' : `${window.location.origin}/student/tabs/tab1`;
    console.log('set redirect: ', redirectTo);

    return this.supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
  }

  sendPwReset(email) {
    return this.supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/password-recovery` });
  }

  updatePassword(password) {
    const newPassword = password.password;
    return this.supabase.auth.updateUser({ password: newPassword });
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  getCurrentUser(): Observable<User | boolean> {
    return this.currentUser.asObservable();
  }

  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id;
    } else {
      return null;
    }
  }

  async setSession(access_token, refresh_token) {
    return this.supabase.auth.setSession({ access_token, refresh_token });
  }
}

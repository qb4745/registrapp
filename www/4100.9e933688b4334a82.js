"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[4100],{4100:(w,c,t)=>{t.r(c),t.d(c,{PasswordRecoveryPage:()=>f});var u=t(5861),p=t(6814),s=t(95),o=t(6196),e=t(6689),g=t(2333);function m(n,d){1&n&&(e.TgZ(0,"ion-note",7),e._uU(1,"Ingresa tu contrase\xf1a"),e.qZA())}function h(n,d){1&n&&(e.TgZ(0,"ion-note",7),e._uU(1,"Largo minimo de 6 caracteres"),e.qZA())}let f=(()=>{var n;class d{constructor(a,r,l,i,P){this.fb=a,this.authService=r,this.loadingController=l,this.alertController=i,this.navCtrl=P,this.credentials=this.fb.nonNullable.group({password:["",[s.kI.required,s.kI.minLength(6)]]}),this.currentUrl=window.location.href,this.urlParams=new URLSearchParams(new URL(this.currentUrl).search),this.token=this.urlParams.get("token")}get password(){return this.credentials.controls.password}updatePassword(){var a=this;return(0,u.Z)(function*(){console.log("token: ",a.token);const r=yield a.loadingController.create();yield r.present(),a.authService.updatePassword(a.credentials.getRawValue()).then(function(){var l=(0,u.Z)(function*(i){yield r.dismiss(),console.log("data: ",i),i.error?a.showAlert("Cambio de fallido",i.error.message):(a.showAlert("Cambio exitoso","La contrase\xf1a ha sido actualizada, podras ingresarla la proxima vez que se te solicite"),a.navCtrl.navigateBack(""))});return function(i){return l.apply(this,arguments)}}())})()}showAlert(a,r){var l=this;return(0,u.Z)(function*(){yield(yield l.alertController.create({header:a,message:r,buttons:["OK"]})).present()})()}}return(n=d).\u0275fac=function(a){return new(a||n)(e.Y36(s.qu),e.Y36(g.e),e.Y36(o.HT),e.Y36(o.Br),e.Y36(o.SH))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-password-recovery"]],standalone:!0,features:[e.jDz],decls:16,vars:4,consts:[["color","primary"],["scrollY","false"],[3,"formGroup","ngSubmit"],["position","stacked"],["type","password","placeholder","Ingresa tu nueva contrase\xf1a","formControlName","password"],["slot","error",4,"ngIf"],["type","submit","expand","block","strong","true",3,"disabled"],["slot","error"]],template:function(a,r){1&a&&(e.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-title"),e._uU(3,"RegistrAPP"),e.qZA()()(),e.TgZ(4,"ion-content",1)(5,"ion-card")(6,"ion-card-content")(7,"form",2),e.NdJ("ngSubmit",function(){return r.updatePassword()}),e.TgZ(8,"ion-item")(9,"ion-label",3),e._uU(10,"Cambiar contrase\xf1a"),e.qZA(),e._UZ(11,"ion-input",4),e.YNc(12,m,2,0,"ion-note",5),e.YNc(13,h,2,0,"ion-note",5),e.qZA(),e.TgZ(14,"ion-button",6),e._uU(15,"Cambiar Contrase\xf1a"),e.qZA()()()()()),2&a&&(e.xp6(7),e.Q6J("formGroup",r.credentials),e.xp6(5),e.Q6J("ngIf",(r.password.dirty||r.password.touched)&&(null==r.password.errors?null:r.password.errors.required)),e.xp6(1),e.Q6J("ngIf",(r.password.dirty||r.password.touched)&&(null==r.password.errors?null:r.password.errors.minlength)),e.xp6(1),e.Q6J("disabled",!r.credentials.valid))},dependencies:[o.Pc,o.YG,o.PM,o.FN,o.W2,o.Gu,o.pK,o.Ie,o.Q$,o.uN,o.wd,o.sr,o.j9,p.ez,p.O5,s.u5,s._Y,s.JJ,s.JL,s.UX,s.sg,s.u],styles:["ion-content[_ngcontent-%COMP%]{--padding-top: 20%;--padding-start: 5%;--padding-end: 5%;--background: linear-gradient(rgba(0, 0, 0, .6), rgba(0, 0, 0, .7)), url(https://images.unsplash.com/photo-1508964942454-1a56651d54ac?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80) no-repeat}"]}),d})()}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{a9jy:function(t,n,e){"use strict";e.d(n,"a",(function(){return r}));var s=e("tk/3"),i=e("fXoL");let r=(()=>{class t{constructor(t){this.http=t,this.URL_API="/API_FleetService/api/Transaction",this.HttpOptions={headers:new s.c({"Content-Type":"application/json"})}}processTransaction(t){return this.http.post(this.URL_API+"/ProcessTransaction",t,this.HttpOptions)}async getTodayTransactions(){return this.http.get(this.URL_API+"/GetTodayTransactions").toPromise()}getTransactionsToApprove(t){return this.http.get(`${this.URL_API}/GetTransactionsToApproveByClient?client_id=${t}`)}getTransactionsByDealerOrClient(t=null,n=null,e=null,s=null,i=null,r=null,a=null){return this.http.get(`${this.URL_API}/GetTransactionsByDealerOrClient?dealer_id=${t}&client_id=${n}&init_date=${e}&end_date=${s}&code=${i}&license_plate=${r}&state_trx=${a}`)}getTransactionsByDealerOrClientwtp(){return this.http.get(this.URL_API+"/GetTransactionsByDealerOrClient")}async getTransactionsByClient(t){return this.http.get(`${this.URL_API}/GetTransactionsByClient?client_id=${t}`).toPromise()}async getTransactionById(t){return this.http.get(`${this.URL_API}/GetTransactionById?trx_id=${t}`).toPromise()}async getTransactionStates(){return this.http.get(this.URL_API+"/getTransactionStates").toPromise()}}return t.\u0275fac=function(n){return new(n||t)(i.fc(s.a))},t.\u0275prov=i.Rb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()}}]);
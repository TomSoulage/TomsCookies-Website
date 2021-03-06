import { Injectable } from '@angular/core';
import { Observable } from '@firebase/util/dist/src/subscribe';
import { deleteDoc, doc, getFirestore, setDoc, collection, updateDoc, addDoc } from 'firebase/firestore';
import { docData } from 'rxfire/firestore';
import { ICookie } from '../models/icookie';
import { IPanier } from '../models/ipanier';
import { AuthService } from './auth.service';
import { CookiesListService } from './cookies-list.service';

@Injectable({
  providedIn: 'root'
})
export class PanierService  {

  constructor(private authService : AuthService, private cookieService: CookiesListService)  { }

  
  db = getFirestore();
  collection = collection(this.db, "paniers");

  idUtilisateur = this.authService.getUserId();
  

  getPanierByID(id:string){
    const docRef = doc(this.db,`paniers/${id}`);
    return docData(docRef, { idField: 'id' }) as unknown as Observable<IPanier>;
  }

  deleteCookiesPanier(panier: IPanier, index:number){

    //On supprime les éléments de la liste liés au cookie choisi
    panier.listeIdCookies.splice(index,1);
    panier.listeNbCookies.splice(index,1);
    panier.prixTotal -= panier.listePrixTotalParCookie[index];
    panier.listePrixTotalParCookie.splice(index,1);

    //Mise à jour dans la base de données
    const docRef = doc(this.db,`paniers/${panier.id}`);
    return updateDoc(docRef,{listeIdCookies: panier.listeIdCookies, listeNbCookies: panier.listeNbCookies, listePrixTotalParCookie: panier.listePrixTotalParCookie, prixTotal: panier.prixTotal})

  }


  ajouterCookiePanier(panier: IPanier, cookie: ICookie){

    //Cas où le cookie n'est pas encore dans le panier
    if(!this.cookieEstDansLePanier(panier,cookie)){
      panier.listeIdCookies.push(cookie.id);
      panier.listeNbCookies.push(1);
      panier.listePrixTotalParCookie.push(cookie.prix);
      panier.prixTotal += cookie.prix;

    }else{
      const index = panier.listeIdCookies.indexOf(cookie.id);
      panier.listeNbCookies[index] = 1 + this.getNbDeCeCookieDansLePanier(panier,cookie);
      panier.listePrixTotalParCookie[index] = cookie.prix * panier.listeNbCookies[index];
      panier.prixTotal += cookie.prix;
    }
  
     //Mise à jour dans la base de données
     const docRef = doc(this.db,`paniers/${panier.id}`);
     return updateDoc(docRef,{listeIdCookies: panier.listeIdCookies, listeNbCookies: panier.listeNbCookies, listePrixTotalParCookie: panier.listePrixTotalParCookie, prixTotal: panier.prixTotal})    


  }

  cookieEstDansLePanier(panier: IPanier, cookie: ICookie){

   let res = panier.listeIdCookies.filter(res => res == cookie.id) 
    
    if(res.length>0){
      return true;
    }else {
      return false; 
    }
  }

  getNbDeCeCookieDansLePanier(panier: IPanier, cookie: ICookie){
    const index = panier.listeIdCookies.indexOf(cookie.id);
    const nbDeCeCookieActuel = panier.listeNbCookies[index];
    return nbDeCeCookieActuel;
  } 

  getNbTotalCookiePanier(panier:IPanier){
    let sum = 0;
    for (let i = 0; i < panier.listeNbCookies.length; i++) {
      sum +=panier.listeNbCookies[i];
    }
    return sum;  
  }

 
}

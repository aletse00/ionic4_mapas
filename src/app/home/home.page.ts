import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

declare var google;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private geolocation: Geolocation, private loadingController:LoadingController) {}


  ngOnInit(){
     this.loadMap();
 
   }
 
   //Para que el await funcione debe ser async
   async loadMap(){
     const loading= await this.loadingController.create();
     loading.present();
     //Resulve la promesa en una sola línea ya no usa .then
     const rta= await this.geolocation.getCurrentPosition();
     //Se crea un objeto con latitud y logitud
     const myLatLng = {
       lat: rta.coords.latitude,
       lng: rta.coords.longitude
     };
     console.log(myLatLng);
     const mapEle: HTMLElement =document.getElementById('map');
     const map = new google.maps.Map(mapEle,{
        center: myLatLng,
        zoom: 12

     });
     google.maps.event
     .addListenerOnce(map, 'idle',()=>{
        console.log('added');
        loading.dismiss();
        const marker = new google.maps.Marker({
          position: {
            lat: myLatLng.lat,
            lng: myLatLng.lng
          },
          map: map,
          title: 'Uber Valles...'
          
        });
     });
   }
 
}

import { Component, OnInit } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

declare var google;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map: any;
  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  myLatLng: any;
  waypoints: any;
  constructor(private geolocation: Geolocation, private loadingController: LoadingController) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
    this.waypoints =
      {
        location: { lat: 22.1367683, lng: -100.9944038 },

      }
      ;



  }


  ngOnInit() {
    //this.loadMap();
    this.getPosition();
  }

  //Para que el await funcione debe ser async
  /*async loadMap() {

    const loading = await this.loadingController.create();
    loading.present();
    //Resulve la promesa en una sola línea ya no usa .then
    const rta = await this.geolocation.getCurrentPosition();
    //Se crea un objeto con latitud y logitud
    const myLatLng = {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
    console.log(myLatLng);
    const mapEle: HTMLElement = document.getElementById('map');
     this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12

    });
    google.maps.event
      .addListenerOnce(this.map, 'idle', () => {
        console.log('added');
        mapEle.classList.add('show-map');
        loading.dismiss();
      

        this.calculateRoute();
      });
  }*/

  getPosition(): any {
    this.geolocation.getCurrentPosition()
      .then(response => {
        this.loadMap(response);
      })
      .catch(error => {
        console.log(error);
      })
  }

  loadMap(position: Geoposition) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude, longitude);
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');
    let panelEle: HTMLElement = document.getElementById('panel');

    // create LatLng object
    this.myLatLng = { lat: latitude, lng: longitude };

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.myLatLng,
      zoom: 12
    });

    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(panelEle);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      
      this.calculateRoute();
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.myLatLng.lat=data.coords.latitude
      this.myLatLng.lng=data.coords.longitude
     console.log(data.coords.latitude+" "+data.coords.longitude) 
     
    });

  }

  private calculateRoute() {
    this.bounds.extend(this.myLatLng);
    //var point = new google.maps.LatLng(this.waypoints.location.lat,this.waypoints.location.lng);
    //this.bounds.extend(point);
    this.map.fitBounds(this.bounds);
    this.directionsService.route({
      origin: new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
      destination: new google.maps.LatLng(this.waypoints.location.lat, this.waypoints.location.lng),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }
}

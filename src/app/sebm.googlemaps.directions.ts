import { Directive, OnChanges, EventEmitter, Input, Output, DoCheck } from '@angular/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core/services/google-maps-api-wrapper';
declare var google: any;

@Directive({
  selector: 'sebm-google-map-directions'  
})

export class DirectionsMapDirective {
  @Input() origin;
  @Input() destination;
  @Output() 
  distance: EventEmitter<string>;
  public distanceValue: string;
  public response: any;

  constructor (private gmapsApi: GoogleMapsAPIWrapper) {
    this.distance = new EventEmitter();
  }
  ngOnChanges(){
    this.generateMap();
  }
  
  public generateMap(): void{
    this.gmapsApi.getNativeMap().then(map => {
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      this.distanceValue = "42 mi";
      directionsDisplay.setMap(map);
      if(this.origin && this.destination){
        directionsService.route({
          origin: {lat: this.origin.latitude, lng: this.origin.longitude},
          destination: {lat: this.destination.latitude, lng: this.destination.longitude},
          waypoints: [],
          optimizeWaypoints: true,
          travelMode: 'DRIVING',
        }, (response, status) => {
          if (status === "OK") {
            this.response=response;
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
    });
  }
}
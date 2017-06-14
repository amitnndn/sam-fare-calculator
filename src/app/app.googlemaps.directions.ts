import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core/services/google-maps-api-wrapper';
import { Component,  Input, Output, EventEmitter} from '@angular/core';
declare var google: any;



@Component({
  selector: 'app-google-map-directions',
  template: '<span>Distance: {{distance}}</span>'
})

export class DirectionsMapDirective {
  @Input() origin;
  @Input() destination;
  @Output() distance: EventEmitter<string>;

  constructor (private gmapsApi: GoogleMapsAPIWrapper) {
    this.distance = new EventEmitter<string>();
  }
  ngOnChanges(){
    this.generateMap();
  }
  public generateMap(): void{
    this.gmapsApi.getNativeMap().then(map => {
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(map);
      if(this.origin && this.destination){
        directionsService.route({
          origin: {lat: this.origin.latitude, lng: this.origin.longitude},
          destination: {lat: this.destination.latitude, lng: this.destination.longitude},
          waypoints: [],
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === "OK") {
            directionsDisplay.setDirections(response);
            var distance = response.routes[0].legs[0].distance.text;
            this.distance.emit(distance);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
    });
  }
}
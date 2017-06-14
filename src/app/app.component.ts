import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader, LatLng } from 'angular2-google-maps/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core/services/google-maps-api-wrapper';
import { DirectionsMapDirective } from './sebm.googlemaps.directions';
import { Observable } from 'rxjs/Rx';
import {} from '@types/googlemaps';
import { DistanceService } from './app.getDistance';
declare var google: any;

@Component({
	selector: 'my-app',
	styles: [`
	.sebm-google-map-container {
		height: 300px;
	}
	`],
	templateUrl: './app.component.html',
	providers: [GoogleMapsAPIWrapper, DirectionsMapDirective, DistanceService]
})

export class AppComponent implements OnInit {
	public latitude: number;
	public longitude: number;

	lat: number = 37.0902;
	lng: number = -95.7129;
	zom: number = 3;

	public destinationLatitude: number;
	public destinationLongitude: number;
	
	public zoom: number;
	public title: string = "Sam's Fare Calculator";

	public origin: any;
	public dest: any; 

	public sourceLocation: string;
	public destinationLocation: string;

	@ViewChild("source")
	public locationSourceElementRef: ElementRef;

	@ViewChild("destination")
	public locationDestinationElementRef: ElementRef;

	public cars: any = [
		{
			label: 'None',
			id: 0
		},
		{
			label: 'SUV',
			id: 1
		},
		{
			label: 'Luxury',
			id: 2
		}
	];

	public selectedCar: any; 

	public selectCar(car: any): void{
		this.selectedCar = car;
	}

	constructor(
		private mapsAPILoader: MapsAPILoader,
		private ngZone: NgZone,
		) {}

	public thisdistance: string;
	public duration: string;

	ngOnInit() {
		//set google maps defaults
		this.zoom = 4;
		this.latitude = 39.8282;
		this.longitude = -98.5795;

		//set current position
		this.setCurrentPosition();

		//load Places Autocomplete
		this.mapsAPILoader.load().then(() => {
			let sourceLocation = new google.maps.places.Autocomplete(this.locationSourceElementRef.nativeElement, {
				types: ["address"]
			});

			let destinationLocation = new google.maps.places.Autocomplete(this.locationDestinationElementRef.nativeElement, {
				types: ["address"]
			});


			sourceLocation.addListener("place_changed", () => {
				this.ngZone.run(() => {
					//get the place result
					let place: google.maps.places.PlaceResult = sourceLocation.getPlace();

					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}

					//set latitude, longitude and zoom
					this.latitude = place.geometry.location.lat();
					this.longitude = place.geometry.location.lng();
					this.zoom = 12;
					this.origin = {latitude: this.latitude, longitude: this.longitude};
				});
			});

			destinationLocation.addListener("place_changed", () => {
				this.ngZone.run(() => {
					//get the place result
					let place: google.maps.places.PlaceResult = destinationLocation.getPlace();

					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}

					//set latitude, longitude and zoom
					this.destinationLatitude = place.geometry.location.lat();
					this.destinationLongitude = place.geometry.location.lng();
					this.zoom = 12;
					this.dest = { latitude: this.destinationLatitude, longitude: this.destinationLongitude};
					this.getDistance();
				});
			});
		});
	}

	private getDistance(){ 
		var origin = new google.maps.LatLng(this.latitude, this.longitude);
		var destination = new google.maps.LatLng(this.destinationLatitude, this.destinationLongitude);
		var service = new google.maps.DistanceMatrixService();
		var units = google.maps.UnitSystem.IMPERIAL;

		service.getDistanceMatrix(
		{
			origins: [origin],
			destinations: [destination],
			travelMode: 'DRIVING',
			unitSystem: units
		  }, (response,status) => {
		  	this.thisdistance = response.rows["0"].elements["0"].distance.text;
		  	this.duration = response.rows["0"].elements["0"].duration.text;
		  });
	}

	private setCurrentPosition() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.latitude = position.coords.latitude;
				this.longitude = position.coords.longitude;
				this.zoom = 12;
			});
		}
	}
}
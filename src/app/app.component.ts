import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader, LatLng } from 'angular2-google-maps/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core/services/google-maps-api-wrapper';
import { DirectionsMapDirective } from './sebm.googlemaps.directions';
import { Observable } from 'rxjs/Rx';
import {} from '@types/googlemaps';
import {Fare, Car} from './app.fare';
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

	public selectedCar: string ;
	public cars: string[];


	// public selectedCar: Car;
	// public cars: Car[];
	constructor(
		private mapsAPILoader: MapsAPILoader,
		private ngZone: NgZone,
		) {}

	public distance: string;
	public duration: string;
	public distanceNumber: number;
	public durationNumber: number;

	public suv: Fare = new Fare(12.50, 3.50, 0.35, 0, 12.00);
	public blackCarFare: Fare = new Fare(6.00, 3.25, 0.35, 0, 18.00);
	public dummyCar: Car = new Car("Select a Car",0,this.suv);
	public suvCar: Car = new Car("SUV",1, this.suv);
	public blackCar: Car = new Car("Black Car",2, this.blackCarFare);
	public carsArray: Car[] = [];
	public dropDownSelectCar: Car = this.dummyCar;

	ngOnInit() {
		//set google maps defaults
		this.carsArray = [this.dropDownSelectCar, this.suvCar, this.blackCar];
		this.cars = ["Select an option","SUV","Luxury"];

		this.selectedCar = "Select an option";

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
		let origin = new google.maps.LatLng(this.latitude, this.longitude);
		let destination = new google.maps.LatLng(this.destinationLatitude, this.destinationLongitude);
		let service = new google.maps.DistanceMatrixService();
		let units = google.maps.UnitSystem.IMPERIAL;

		service.getDistanceMatrix(
		{
			origins: [origin],
			destinations: [destination],
			travelMode: 'DRIVING',
			unitSystem: units
		}, (response,status) => {
			this.distance = response.rows["0"].elements["0"].distance.text;
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

	public convertStringToNumber(stringVal: string, type: number): number{
		let returnVal: number;
		if(stringVal){
			if(type == 1){
				returnVal = +stringVal.replace(/ mi/i,'');
			}
			else if(type == 2){
				returnVal = +stringVal.replace(/ mins/gi,'');
			}
			return returnVal;
		}
	}

	public isNoCarSelected(): boolean {
		if(this.selectedCar === "Select an option"){
			return true;
		}
		return false;
	}

	public infoPanel: boolean = true; 

	public showInfoPanel(): void {
		this.infoPanel = !this.infoPanel;
	}

	public fareCalculator(car: Car): number{
		this.distanceNumber = this.convertStringToNumber(this.distance, 1);
		this.durationNumber = this.convertStringToNumber(this.duration, 2);
		if(car.id != 0){
			let fullFare: number = car.fare.baseFare + (car.fare.perMile * this.distanceNumber) + (car.fare.perMinute * this.durationNumber);
			return(fullFare < car.fare.minimumFare ? car.fare.minimumFare:fullFare);
		}
	}

	public calculateFare(car: string): number{
		var fullFare: number = 0;
		this.distanceNumber = this.convertStringToNumber(this.distance, 1);
		this.durationNumber = this.convertStringToNumber(this.duration, 2);
		switch(car){
			case "SUV":
			fullFare = 12.50 + (3.5 * this.distanceNumber) + (0.35 * this.durationNumber);
			if(fullFare < 18){
				fullFare = 18;
			}
			break;
			case "Luxury":
			fullFare = 6.00 + (3.25 * this.distanceNumber) + (0.35 * this.durationNumber);
			if(fullFare < 12){
				fullFare = 12;
			}
			break;
		}
		return fullFare;
	}
}
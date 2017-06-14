import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions, Jsonp } from '@angular/http';

import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DistanceService {
     // Resolve HTTP using the constructor
     constructor (
 		private http: Http,
 		private _jsonp: Jsonp
     ) {}
     // private instance variable to hold base url
     private baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?json_callback=JSONP_CALLBACK&units=imperial&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=AIzaSyBYF2xU3IR3vmzmUBFUzD6ss_FMNls4DL4';

     getDistance(): Observable<any> {
     	return this._jsonp.get(this.baseUrl)
     		.map((res: Response) => {
     			return res.json();
     		})
     		.catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
     }

     private getHeaders(){
		let headers = new Headers();
		headers.append('Accept','application/json');
		return headers;
	}


}
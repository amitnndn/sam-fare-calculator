export class Fare {
	public baseFare: number;
	public perMile: number;
	public perMinute: number;
	public extraFare: number;
	public minimumFare: number;

	constructor(base: number, mile: number, minute: number, extra: number, minimum: number){
		this.baseFare = base;
		this.perMile = mile;
		this.perMinute = minute;
		this.extraFare = extra;
		this.minimumFare = minimum;
	}
}

export class Car{ 
	public name: string;
	public id: number;
	public fare: Fare; 


	constructor(name?: string, id?: number, fare?: Fare){
		this.fare = fare;
		this.name = name;
		this.id = id;
	}
}
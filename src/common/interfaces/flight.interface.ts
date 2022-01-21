import { IPassanger } from "./passanger.interface";
import { IWeather } from "./weather.interface";

export interface IFlight extends Document {
    _id?: string;
    pilot: string;
    airplane: string;
    destinationCity: string;
    flightDate: Date;
    passanger: IPassanger;
    weather: IWeather[];
}
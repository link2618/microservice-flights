import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as moment from 'moment';

import { IFlight } from 'src/common/interfaces/flight.interface';
import { FLIGHT } from 'src/common/models/models';
import { FlightDTO } from './dto/flight.dto';
import { ILocation } from 'src/common/interfaces/location.interface';
import { IWeather } from 'src/common/interfaces/weather.interface';

@Injectable()
export class FlightService {

    constructor(@InjectModel(FLIGHT.name) private readonly model:Model<IFlight>) {}

    async getLocation(destinationCity: string): Promise<ILocation> {
        const { data } = await axios.get(`https://www.metaweather.com/api/location/search/?query=${destinationCity}`);

        return data[0];
    }

    async getWeather(woeid: number, flightDate: Date):Promise<IWeather[]> {
        const dateFormatter = moment.utc(flightDate).format();

        const year = dateFormatter.substring(0, 4);
        const month = dateFormatter.substring(5, 7);
        const day = dateFormatter.substring(8, 10);

        const { data } = await axios.get(`https://www.metaweather.com/api/location/${woeid}/${year}/${month}/${day}`);

        return data;
    }

    assign({ _id, pilot, airplane, destinationCity, flightDate, passanger}: IFlight, weather: IWeather[]): IFlight {
        return Object.assign({ _id, pilot, airplane, destinationCity, flightDate, passanger, weather})
    }

    async create(flightDTO:FlightDTO): Promise<IFlight> {
        const newFlight = new this.model(flightDTO);

        return await newFlight.save();
    }

    async findAll(): Promise<IFlight[]> {
        return await this.model.find().populate('passanger');
    }

    async findOne(id: String): Promise<IFlight> {
        const flight = await this.model.findById(id).populate('passanger');
        const location: ILocation = await this.getLocation(flight.destinationCity);
        const weather: IWeather[] = await this.getWeather(location.woeid, flight.flightDate);
        
        return this.assign(flight, weather);
    }

    async update(id: String, flightDTO:FlightDTO): Promise<IFlight> {
        return await this.model.findByIdAndUpdate(id, flightDTO, { new: true });
    }

    async delete(id: String) {
        await this.model.findByIdAndDelete(id)

        return {
            status: HttpStatus.OK,
            msg: 'Successfully deleted flight'
        }
    }

    async addPassenger(flightId: string, passengerId: string): Promise<IFlight> {
        return await this.model.findByIdAndUpdate(flightId, {
            $addToSet: {passanger: passengerId}//Para volver a crear el id si ya existe
        },
        {
            new: true
        } 
        ).populate('passanger')
    }
}

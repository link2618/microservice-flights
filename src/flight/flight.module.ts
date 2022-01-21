import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FLIGHT, PASSANGER } from 'src/common/models/models';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { FlightSchema } from './schema/flight.schema';
import { PassangerSchema } from './schema/passanger.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: FLIGHT.name,
        useFactory: () => FlightSchema.plugin(require('mongoose-autopopulate'))
      },
      {
        name: PASSANGER.name,
        useFactory: () => PassangerSchema
      }
    ]),
  ],
  controllers: [FlightController],
  providers: [FlightService]
})
export class FlightModule {}

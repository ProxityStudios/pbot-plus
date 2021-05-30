import { Document } from 'mongoose';

export interface IGuildModel extends Document {
  _id: string;
  main: {
    prefix: string;
  };
}

import { Document } from 'mongoose';

export interface IntGuildModel extends Document {
  _id: string;
  main: {
    prefix: string;
  };
}

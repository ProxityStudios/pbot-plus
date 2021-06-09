import { model, Schema } from 'mongoose';

import { IntGuildModel } from './guild.interface';
import { ConfigService } from '../../../../services';

const GuildSchema: Schema = new Schema({
  _id: { type: String, required: true, unuqie: true },
  main: {
    prefix: {
      type: String,
      default: ConfigService.client.defaultPrefix
    }
  }
});

export const GuildModel = model<IntGuildModel>('Guild', GuildSchema);

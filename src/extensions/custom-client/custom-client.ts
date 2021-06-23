import {
  ActivityType,
  Client,
  ClientOptions,
  Presence
} from 'discord.js-light';

export class CustomClient extends Client {
  /**
   * Custom client
   * @param options
   */
  constructor(options?: ClientOptions) {
    super(options);
  }

  /**
   * @param type
   * @param name
   * @param url
   */
  public async setPresence(
    type: ActivityType,
    name: string,
    url?: string
  ): Promise<Presence> {
    return this.user.setPresence({
      activity: {
        type,
        name,
        url
      }
    });
  }
}

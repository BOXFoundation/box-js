import { Http } from '../util/rpc'

/**
 * @class [Core]
 * @extends Http
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
export class Feature extends Http {
  constructor(_fetch: any, endpoint: string) {
    super(_fetch, endpoint)
  }
}
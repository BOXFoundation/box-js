import { Fetch } from '../util/fetch'

/**
 * @class [Feature]
 * @extends Fetch
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
export default class Feature extends Fetch {
  constructor(_fetch: any, endpoint: string, fetch_type) {
    super(_fetch, endpoint, fetch_type)
  }
}

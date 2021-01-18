import { JWT } from 'google-auth-library'

/**
 * Concretions are capable of generating auth tokens for use with requests for HotLoop services
 */
interface TokenProvider {
  /**
   * Gets a valid auth token for use with Hotloop services
   * @param audience The endpoint being called
   */
  getBearerToken: (audience: string) => Promise<string>
}

/**
 * Decodes a base64 encoded string. The result is encoded as utf-8.
 * @param s The base64 encoded string
 */
const decode = (s: string): string => Buffer.from(s, 'base64').toString('utf-8')

/**
 * Generates tokens for use with GCP services
 */
class GcpTokenProvider implements TokenProvider {
  private client: JWT

  constructor (serviceAccountKeyString: string) {
    const json = !serviceAccountKeyString.trim().startsWith('{') ? decode(serviceAccountKeyString) : serviceAccountKeyString
    const serviceAccountKey = JSON.parse(json)

    const options = {
      forceRefreshOnFailure: true,
      key: serviceAccountKey.private_key,
      email: serviceAccountKey.client_email
    }

    this.client = new JWT(options)
  }

  /**
   * @inheritDoc
   */
  getBearerToken(audience: string): Promise<string> {
    return this.client.fetchIdToken(audience)
  }
}

export { TokenProvider, GcpTokenProvider }

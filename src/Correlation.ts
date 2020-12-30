import { AxiosResponse } from 'axios'
import { Header } from './Enums'

/**
 * A string used to correlate request logs within HotLoop
 */
type CorrelationId = string

/**
 * Extract a CorrelationId from a response. If the header is not present, null is returned.
 */
const correlationIdFromResponse = (response: AxiosResponse): CorrelationId => response.headers[Header.CORRELATION] || null

export { CorrelationId, correlationIdFromResponse }

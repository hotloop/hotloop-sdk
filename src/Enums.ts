/**
 * Endpoints available on the HotLoop API
 */
enum Endpoint {
  SYNC_DEPLOYMENT = '/SyncDeployment',
  SYNC_COVERAGE = '/HandlePR'
}

/**
 * Headers used in the HotLoop API
 */
enum Header {
  CORRELATION = 'x-correlation-id'
}

export { Endpoint, Header }
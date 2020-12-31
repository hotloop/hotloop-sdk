/**
 * SdkOptions define the general network configuration used by the HotLoop SDK
 */
interface SdkOptions {
  /**
   * The user-agent to send to hotloop
   */
  userAgent?: string
  /**
   * The network request timeout
   */
  timeout?: number
  /**
   * How many retries to attempt on network errors or failures for idempotent calls
   */
  retries?: number
  /**
   * Acts as a linear scalar to retry delay. The retry is delayed by this scalar, multiplied by the retry attempt number
   */
  retryDelay?: number
}

/**
 * The options required for syncing a deployment with HotLoop
 */
interface SyncDeploymentOptions {
  /**
   * The full repository URL
   */
  repository: string
  /**
   * The branch name
   */
  branch: string
  /**
   * The details of the deployment
   */
  deployment: {
    /**
     * The service that has been deployed
     */
    service: string
    /**
     * The environment which has been updated
     */
    environment: string
    /**
     * Indicates whether or not the deployment was successful
     */
    success: boolean
    /**
     * The time at which the deployment process started, expressed as a unix timestamp
     */
    startedAt: number
    /**
     * The time at which the deployment process completed, expressed as a unix timestamp
     */
    endedAt: number
  }
}

/**
 * The options required for syncing test coverage with HotLoop
 */
interface SyncCoverageOptions {
  /**
   * The full repository URL
   */
  repository: string
  /**
   * The branch name
   */
  branch: string
  /**
   * The issue number
   */
  issueNumber: number
  /**
   * The lcov report
   */
  lcov: string
}

export { SdkOptions, SyncDeploymentOptions, SyncCoverageOptions }
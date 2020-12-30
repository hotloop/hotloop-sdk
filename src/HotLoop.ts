const axiosRetry = require('axios-retry')
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { IAxiosRetryConfig } from 'axios-retry'
import { CorrelationId, correlationIdFromResponse } from './Correlation'
import { Endpoint } from './Enums'
import { SdkOptions, SyncCoverageOptions, SyncDeploymentOptions } from './Options'

/**
 * The HotLoop SDK allows for easy communication with HotLoop
 */
interface HotLoopSdk {
  /**
   * Sync a deployment with HotLoop
   */
  syncDeployment (options: SyncDeploymentOptions): Promise<CorrelationId>

  /**
   * Sync test coverage with HotLoop
   */
  syncCoverage (options: SyncCoverageOptions): Promise<CorrelationId>
}

/**
 * Creates hydrated HotLoopSdk instances
 */
class HotLoopSdkFactory {
  /**
   * Get a hydrated HotLoopSdk instance
   * @param token The HotLoop API token
   * @param opts The SDK options
   */
  static getInstance (token: string, opts: SdkOptions): HotLoopSdk {
    const url = 'https://europe-west3-hotloop-289416.cloudfunctions.net/'
    return new HotLoop(url, token, opts)
  }
}

/**
 * The HotLoop SDK implementation
 */
class HotLoop implements HotLoopSdk {
  /**
   * The web client used for making requests
   */
  private readonly axios: AxiosInstance

  /**
   * @constructor
   * @param url The base URL for the HotLoop API
   * @param token The user's bearer token
   * @param opts The options required to configure the SDK
   */
  constructor (url: string, token: string, opts: SdkOptions) {
    const config: AxiosRequestConfig = {
      baseURL: url,
      timeout: opts.timeout || 5000,
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`,
        'User-Agent': opts.userAgent || 'hotloop-sdk'
      }
    }

    this.axios = Axios.create(config)

    const retryConfig: IAxiosRetryConfig = {
      retries: opts.retries || 3,
      retryDelay: retryCount => retryCount * (opts.retryDelay || 1000)
    }

    axiosRetry(this.axios, retryConfig)
  }

  /**
   * @inheritDoc
   */
  public syncDeployment (options: SyncDeploymentOptions): Promise<CorrelationId> {
    return this.axios.post(Endpoint.SYNC_DEPLOYMENT, options)
      .then(correlationIdFromResponse)
  }

  /**
   * @inheritDoc
   */
  public syncCoverage (options: SyncCoverageOptions): Promise<CorrelationId> {
    return this.axios.post(Endpoint.SYNC_COVERAGE, options)
      .then(correlationIdFromResponse)
  }
}

export { HotLoop, HotLoopSdk, HotLoopSdkFactory }
import { GcpTokenProvider, TokenProvider } from './TokenProvider'

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
   * @param key The HotLoop API key
   * @param opts The SDK options
   */
  static getInstance (key: string, opts: SdkOptions): HotLoopSdk {
    const url = 'https://europe-west3-hotloop-289416.cloudfunctions.net/'
    const tokenProvider: TokenProvider = new GcpTokenProvider(key)
    return new HotLoop(url, tokenProvider, opts)
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
   * @param tokenProvider A mechanism for fetching tokens for the request
   * @param opts The options required to configure the SDK
   */
  constructor (url: string, private tokenProvider: TokenProvider, opts: SdkOptions) {
    const config: AxiosRequestConfig = {
      baseURL: url,
      timeout: opts.timeout || 5000,
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'User-Agent': opts.userAgent || 'hotloop-sdk'
      }
    }

    this.axios = Axios.create(config)

    this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
      if (!config.baseURL) throw new Error('No baseUrl in request config')
      if (!config.url) throw new Error('No URL in request config')

      // config.url is not the full URL. Temporary solution, see https://github.com/axios/axios/pull/2555
      const absoluteUrl = config.baseURL.replace(/\/+$/, '') + Axios.getUri(config)

      return this.tokenProvider.getBearerToken(absoluteUrl)
        .then(token => {
          config.headers['Authorization'] = `Bearer ${token}`
          return config
        })
    })

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

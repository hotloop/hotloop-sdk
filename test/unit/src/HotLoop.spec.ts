import * as nock from 'nock'
import { HotLoop } from '../../../src/HotLoop'
import { Endpoint } from '../../../src/Enums'
import { SdkOptions, SyncCoverageOptions, SyncDeploymentOptions } from '../../../src/Options'

describe('HotLoop', () => {
  const url = 'http://localhost'
  const token = 'test-token'
  const repository = 'https://github.com/hotloop/hotloop-sdk'
  const branch = 'main'
  const issueNumber = 1
  const lcov = 'test-lcov'
  const service = 'test-service'
  const environment = 'production'
  const success = true
  const startedAt = new Date().getTime()
  const endedAt = new Date().getTime()
  const userAgent = 'hotloop-tests'

  const options: SdkOptions = {
    userAgent: userAgent,
    timeout: 1000,
    retries: 1,
    retryDelay: 100
  }

  const expectedHeaders = {
    'Accept': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${token}`,
    'User-Agent': userAgent
  }

  let hotloop: HotLoop

  beforeEach(() => {
    hotloop = new HotLoop(url, token, options)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('#syncDeployment', () => {
    const opts: SyncDeploymentOptions = {
      repository,
      branch,
      deployment: {
        service,
        environment,
        success,
        startedAt,
        endedAt
      }
    }

    it('retries when there is a network failure', () => {
      nock(url)
        .post(Endpoint.SYNC_DEPLOYMENT)
        .replyWithError({ code: 'ETIMEDOUT' })
        .post(Endpoint.SYNC_DEPLOYMENT)
        .reply(200)

      return hotloop.syncDeployment(opts)
    })

    it('sends the expected request', () => {
      nock(url, { reqheaders: expectedHeaders })
        .post(Endpoint.SYNC_DEPLOYMENT, opts as any)
        .reply(200)

      return hotloop.syncDeployment(opts)
    })
  })

  describe('#syncCoverage', () => {
    const opts: SyncCoverageOptions = {
      repository,
      branch,
      issueNumber,
      lcov
    }

    it('sends the expected request', () => {
      nock(url, { reqheaders: expectedHeaders })
        .post(Endpoint.SYNC_COVERAGE, opts as any)
        .reply(200)

      return hotloop.syncCoverage(opts)
    })
  })
})
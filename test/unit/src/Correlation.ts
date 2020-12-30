import * as chai from 'chai'
import { correlationIdFromResponse } from '../../../src/Correlation'
import { AxiosResponse } from 'axios'
import { Header } from '../../../src/Enums'

describe('correlationIdFromResponse', () => {
  const correlationId = 'some-correlation-id'

  it('returns a correlationId from a response which contains it', () => {
    const response = {
      headers: {
        [Header.CORRELATION]: correlationId
      }
    } as AxiosResponse

    return correlationIdFromResponse(response).should.equal(correlationId)
  })

  it('returns null when there is no correlationId in the response', () => {
    const response = {
      headers: {}
    } as AxiosResponse

    const should = chai.should()
    should.equal(correlationIdFromResponse(response), null)
  })
})
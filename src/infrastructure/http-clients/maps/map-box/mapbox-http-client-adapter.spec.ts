import { faker } from '@faker-js/faker'
import { httpMapClientsConstants } from '@infrastructure/http-clients/settings'
import { mockForwardGeoCodingResponse } from '@infrastructure/http-clients/test/mock-geocoding'
import { MapBoxHttpClientAdapter } from './mapbox-http-client-adapter'

const unmockedFetch = global.fetch

describe('MapBoxHttpClientAdapter', () => {
  beforeAll(() => {
    global.fetch = (): any =>
      Promise.resolve({
        json: async () => await Promise.resolve(mockForwardGeoCodingResponse())
      })
  })

  afterAll(() => {
    global.fetch = unmockedFetch
  })

  test('Should call fetch method with correct values', async () => {
    const sut = new MapBoxHttpClientAdapter()

    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const mapboxConfig = httpMapClientsConstants.mapbox

    const address = faker.address.city()

    const input = `${mapboxConfig.GEOCODING_BASE_URL}${mapboxConfig.GEOCODING_ENDPOINT_PLACES}${address}.json?access_token=${mapboxConfig.ACCESS_TOKEN}`

    const fetchSpy = jest.spyOn(global, 'fetch')

    await sut.retrieveCoordinates(address)
    expect(fetchSpy).toHaveBeenCalledWith(input, options)
  })
})
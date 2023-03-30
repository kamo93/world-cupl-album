// DEPRECATED
export class CustomFetchError extends Error {
  statusCode: number
  constructor ({ statusCode, message }: { statusCode: number, message: string }) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

// the api will respond with a message property if error exist
// success
// {
//    data:
// }
// error:
// {
//    message: ...,
//    statusCode:
// }
const customFetch = {
  async get<T>({ url }: { url: string }): Promise<T> {
    const res = await fetch(url, { method: 'GET' })
    const jsonResponse = await res.json()
    if (res.ok) {
      return jsonResponse as T
    }
    throw new CustomFetchError({ statusCode: res.status, message: jsonResponse.message ?? 'Http error get' })
  },
  async post<DataResponse> ({ url, body }: { url: string, body: BodyInit }) {
    console.log({ body })
    const res = await fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    const jsonResponse = await res.json()
    if (res.ok) {
      return jsonResponse as DataResponse
    }
    throw new CustomFetchError({ statusCode: res.status, message: jsonResponse.message ?? 'Http error post' })
  },
  async put<DataResponse> ({ url, body }: { url: string, body: BodyInit }) {
    console.log({ body })
    const res = await fetch(
      url,
      {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    console.log('res', res)
    const jsonResponse = await res.json()
    console.log('res', jsonResponse)
    if (res.ok) {
      return jsonResponse as DataResponse
    }
    throw new CustomFetchError({ statusCode: res.status, message: jsonResponse.message ?? 'Http error post' })
  }
}

export default customFetch

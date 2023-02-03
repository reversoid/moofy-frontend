import ky, { Options } from 'ky';

export interface ApiError {
  code: number;
  message: string;
}

/** This class provides apiUrl of moofy backend */
export default class ApiService {
  protected apiUrl = 'http://localhost:3333';

  protected async post<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: Options,
  ) {
    return this.fetchRetry<Response>(
      this.apiUrl + relativeUrl,
      'post',
      options,
    );
  }

  protected async get<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: Options,
  ) {
    return this.fetchRetry<Response>(this.apiUrl + relativeUrl, 'get', options);
  }

  protected async patch<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: Options,
  ) {
    return this.fetchRetry<Response>(
      this.apiUrl + relativeUrl,
      'patch',
      options,
    );
  }

  protected async delete<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: Options,
  ) {
    return this.fetchRetry<Response>(
      this.apiUrl + relativeUrl,
      'delete',
      options,
    );
  }

  private async fetchRetry<Response = unknown>(
    url: string,
    method: 'get' | 'post' | 'patch' | 'delete',
    options?: Options,
  ): Promise<Response> {
    try {
      return await ky(url, {
        ...options,
        method,
        retry: {
          limit: 4,
          methods: ['post', 'get', 'patch', 'delete'],
          statusCodes: [408, 413, 429, 500, 502, 503, 504],
          backoffLimit: 200,
        },
      }).json<Response>();
    } catch (error: any) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        throw new Error('Http Error', { cause: errorJson });
      }
      throw new Error('Unknown Http Error');
    }
  }
}

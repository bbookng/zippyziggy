import { useCallback, useEffect, useRef, useState } from 'react';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';
import { api, authApi } from '@pages/content/utils/apis/axios-instance';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface FetchParams {
  url: string;
  method?: HttpMethod;
  auth?: boolean;
  params?: Record<string, string | number>;
  body?: Record<string, string | number>;
  autoFetch?: boolean;
}
interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  request: (config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
}

/**
 * `useFetch`는 주어진 URL에 대해 HTTP 요청을 수행하고 결과를 관리하는 커스텀 훅입니다.
 * 인증이 필요한 경우 authApi를 사용하며, 그렇지 않으면 api를 사용합니다.
 * 'get' 메서드일 때는 자동으로 데이터를 가져오고, 다른 메서드들은 request() 함수를 수동으로 호출해야 합니다.
 *
 * @template T 요청 결과의 데이터 타입
 * @param {Object} FetchParams 요청을 위한 매개변수 객체
 * @param {string} FetchParams.url 요청할 URL
 * @param {HttpMethod} [FetchParams.method='get'] HTTP 메서드 (기본값: 'get')
 * @param {boolean} [FetchParams.auth=false] 인증이 필요한 요청인지 여부 (기본값: false)
 * @param {Object} [FetchParams.params] URL 파라미터 (선택 사항)
 * @param {Object} [FetchParams.body] 요청 본문 (선택 사항)
 * @returns {FetchResult<T>} 요청 결과를 관리하는 객체
 * @returns {T | null} data 요청 결과 데이터
 * @returns {boolean} loading 요청 진행 여부
 * @returns {AxiosError | null} error 요청 에러 객체
 * @returns {Function
 *
 * 사용 예시:
 *
 * ```
 * import useFetch from './useFetch';
 *
 * function MyComponent() {
 *   const { data, loading, error, request } = useFetch({ url: '/api/some-data' });
 *
 *   if (loading) {
 *     return <div>데이터 로딩 중...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>에러 발생: {error.message}</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>데이터:</h1>
 *     </div>
 *   );
 * }
 * ```
 */

const useFetch = <T>({
  url,
  method = 'get',
  auth = false,
  params,
  body,
  autoFetch = true,
}: // cacheKey,
FetchParams): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const cancelToken = useRef<CancelTokenSource | undefined>();

  // 인증이 필요한 경우 authApi를 사용, 그렇지 않으면 api 사용
  const instance: AxiosInstance = auth ? authApi : api;

  const request = useCallback(
    async (config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      setLoading(true);
      cancelToken.current = axios.CancelToken.source();

      try {
        const response: AxiosResponse<T> = await instance.request({
          url: `${instance.defaults.baseURL}${url}`,
          method,
          cancelToken: cancelToken.current?.token,
          params: config?.params || params,
          data: config?.data || body,
          ...config,
        });
        setData(response.data);

        return response;
      } catch (err) {
        if (axios.isCancel(err)) {
          console.error('요청 취소:', err.message);
        } else {
          setError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },

    [instance, url, method, body, params]
  );

  // 컴포넌트가 언마운트될 때 취소 토큰을 이용해 요청을 취소
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (method === 'get') {
        try {
          await request();
        } catch (err) {
          if (axios.isCancel(err)) {
            if (isMounted) {
              // console.error('요청 취소:', err.message);
            }
          } else {
            setError(err);
          }
        }
      }
    };
    if (autoFetch) {
      fetchData();
    }

    return () => {
      isMounted = false;
      if (cancelToken.current) {
        cancelToken.current.cancel();
      }
    };
  }, [autoFetch, method, request]);

  return { data, loading, error, request };
};

export default useFetch;

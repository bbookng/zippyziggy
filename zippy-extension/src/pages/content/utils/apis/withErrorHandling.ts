import logOnDev from '@pages/content/utils/@shared/logging';
import { AxiosError } from 'axios';

/**
 * 주어진 에러가 AxiosError 타입인지 확인합니다.
 * @param error - 확인할 에러 객체
 * @returns 에러 객체가 AxiosError 타입이면 true를 반환하고, 그렇지 않으면 false를 반환합니다.
 */
const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError !== undefined;
};

/**
 * API 호출에서 발생한 에러를 처리합니다.
 * @param error - 발생한 에러 객체
 * @returns 처리된 에러 메시지를 반환합니다.
 */
const handleApiError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const message = `API request failed: ${error.message}`;
    logOnDev.error(message);
    if (error.response) {
      logOnDev.error(`HTTP error status: ${error.response.status}`);
    }
    return message;
  }
  const message = `Unknown error occurred: ${JSON.stringify(error)}`;
  logOnDev.error(message);
  return message;
};

/**
 * 함수 타입에서 인수 타입을 추출합니다.
 *
 * @template F - 인수 타입을 추출할 함수 타입.
 */
type ArgumentTypes<F extends (...args: any[]) => any> = F extends (...args: infer A) => any
  ? A
  : never;

/**
 * 특정 반환 타입 및 인수 타입을 가진 비동기 함수를 나타냅니다.
 *
 * @template T - 비동기 함수의 반환 타입.
 * @template Args - 튜플로 나타낸 비동기 함수의 인수 타입.
 */
type AsyncFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

/**
 * 에러 처리 로직이 포함된 비동기 함수를 감싸는 고차 함수입니다.
 * 감싸진 함수의 인수와 반환 타입을 유지합니다.
 *
 * @template F - 감쌀 비동기 함수의 타입.
 * @param {F} fn - 감쌀 비동기 함수.
 * @param {(error: any) => any} [errorCallback] - 에러가 발생했을 때 실행할 선택적 콜백.
 * @returns {F} - 에러 처리가 추가된 주어진 비동기 함수의 감싸진 버전.
 */
const withErrorHandling = <F extends AsyncFunction<any, any>>(
  fn: F,
  errorCallback?: (error: any) => any
): F => {
  /**
   * 에러 처리가 포함된 감싸진 비동기 함수입니다.
   *
   * @param {...ArgumentTypes<F>} args - 감싸진 비동기 함수의 인수.
   * @returns {Promise<ReturnType<F>>} - 감싸진 비동기 함수의 반환 값으로 이루어진 프로미스.
   */
  const wrappedFn = async (...args: ArgumentTypes<F>): Promise<ReturnType<F>> => {
    try {
      const result = await fn(...(args as any));
      return result;
    } catch (error) {
      handleApiError(error);

      if (errorCallback) {
        return errorCallback(error);
      }

      throw error;
    }
  };
  return wrappedFn as F;
};

export default withErrorHandling;

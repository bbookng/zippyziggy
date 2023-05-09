import logOnDev from '@pages/content/utils/@shared/logging';
import { AxiosError } from 'axios';

type AsyncFunction = (...args: any[]) => Promise<any>;

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
 * 주어진 비동기 함수를 실행하고 발생한 에러를 처리합니다.
 * @param fn - 실행할 비동기 함수
 * @returns 에러 처리가 적용된 비동기 함수를 반환합니다.
 */
const withErrorHandling = (fn: AsyncFunction) => {
  return async (...args: any[]): Promise<any> => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
};

export default withErrorHandling;

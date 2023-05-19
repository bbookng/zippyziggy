import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../core/store';

/** useDispatch는 thunkAction에 대해서 타입에러를 발생시키므로 커스터 마이징해서 사용합니다. */
export const useAppDispatch: () => AppDispatch = useDispatch;
/** useSelector를 사용할 경우, 매번 state의 타입을 지정해줘야 하기 때문에 커스터 마이징해서 사용합니다. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

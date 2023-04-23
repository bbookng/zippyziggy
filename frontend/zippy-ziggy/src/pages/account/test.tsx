import { decrement, increment } from '@/core/auth/counterSlice';
import { selectAuthState, setAuthState } from '@/core/auth/authSlice';
import { NextPage } from 'next';
import { wrapper } from '@/core/store';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';

const Home = () => {
  const { value: count } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuthState);
  console.log(count);

  return (
    <div>
      <div>home</div>
      <div>REDUX</div>
      <div>{authState ? 'Logged in' : 'Not Logged In'}</div>
      <button
        type="button"
        onClick={() => {
          authState ? dispatch(setAuthState(false)) : dispatch(setAuthState(true));
        }}
      >
        {authState ? 'Logout' : 'LogIn'}
      </button>

      <button type="button" onClick={() => dispatch(increment())}>
        increment
      </button>
      <span>{count}</span>
      <button type="button" onClick={() => dispatch(decrement())}>
        decrement
      </button>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ params }) => {
  // 초기 상태를 설정할 수 있고, 커스텀 로직을 추가할 수 있다.
  // 서버 단에서 Redux 액션을 수행할 수 있다.
  store.dispatch(increment());
  store.dispatch(setAuthState(false));
  console.log('State on server', store.getState());
  return {
    props: {},
  };
});

export default Home;

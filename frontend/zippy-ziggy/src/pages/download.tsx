import Button from '@/components/Button/Button';
import Title from '@/components/Typography/Title';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';

export default function Index() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const dispatch = useAppDispatch();

  return (
    <div>
      <Title>다운로드</Title>
    </div>
  );
}

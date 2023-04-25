import Button from '@/components/Button/Button';
import Title from '@/components/Typography/Title';
import { setIsLogin } from '@/core/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { httpAuth } from '@/lib/http';
import Link from 'next/link';
import router from 'next/router';

export default function Index() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const dispatch = useAppDispatch();

  return (
    <div>
      <Title>마이페이지</Title>
    </div>
  );
}

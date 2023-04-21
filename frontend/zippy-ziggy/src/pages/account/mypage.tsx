import Button from '@/components/Button/Button';
import Title from '@/components/Typography/Title';
import { httpAuth } from '@/lib/http';
import Link from 'next/link';
import router from 'next/router';

export default function Index() {
  // 로그아웃
  const handleLogout = async () => {
    httpAuth.post(`/members/logout`).then(() => {
      localStorage.clear();
      router.push('/');
    });
  };

  return (
    <div>
      <Title>마이페이지</Title>
      <Link href="/account/modify">
        <Button width="326px">정보변경</Button>
      </Link>

      <Button width="326px" onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
}

import { useState } from 'react';
import { useRouter } from 'next/router';
import Title from '@/components/Typography/Title';
import Paragraph from '@/components/Typography/Paragraph';
import Button from '@/components/Button/Button';
import http from '@/lib/http';

export default function SignUp() {
  const [nickname, setNickname] = useState('');
  const [statusNickname, setStatusNickname] = useState('');

  const router = useRouter();
  const { name } = router.query;
  const userName = Array.isArray(name) ? name[0] : name;

  const handleNickname = () => {
    http
      .get(`/members/nickname/${nickname}`)
      .then((res) => {
        const { data } = res;
        setStatusNickname('success');
        console.log(data);
      })
      .catch((e) => {
        setStatusNickname('error');
        console.log(e);
      });
  };

  return (
    <div>
      <Title>{userName}님 반가워요!</Title>
      <Paragraph>닉네임을 설정하고 회원가입을 완료하세요!</Paragraph>

      <form>
        <input
          type="text"
          id="nickname"
          placeholder="닉네임을 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        {statusNickname === 'error' && (
          <Paragraph color="dangerColor">검증에 실패했어요!</Paragraph>
        )}
        {statusNickname === 'success' && (
          <Paragraph color="successColor">검증에 성공했어요!</Paragraph>
        )}

        <Button onClick={handleNickname}>중복 확인</Button>
        {statusNickname === 'success' && <Button onClick={handleNickname}>회원가입</Button>}
      </form>
    </div>
  );
}

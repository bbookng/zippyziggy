import { useState } from 'react';
import { useRouter } from 'next/router';
import Title from '@/components/Typography/Title';
import Paragraph from '@/components/Typography/Paragraph';
import Button from '@/components/Button/Button';
// import firebase from 'firebase/app';
// import 'firebase/auth';

export default function SignUp() {
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      /*
      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      await user.updateProfile({ displayName: nickname });
      */
      router.push('/');
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <div>
      <Title sizeType="3xl">에잉</Title>
      <Paragraph sizeType="lg">아이고 안녕하세요</Paragraph>
      <Button buttonType="fill" isRound width="200px" onClick={handleSignUp}>
        힝
      </Button>
      <Button buttonType="outline">힝</Button>
      {/* <Paragraph size="large" color="infoColor">
        앗살라마이쿰 사와디캅
      </Paragraph> */}

      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <button type="submit">가입완료</button>
      </form>
    </div>
  );
}

import { useEffect, useState } from 'react';
import Button from '@/components/Button/Button';
import { httpAuth } from '@/lib/http';
import Paragraph from '@/components/Typography/Paragraph';
import router from 'next/router';

// 정보 변경 페이지
const Index = () => {
  // 유저정보
  interface User {
    nickname: string;
    profileImg: string;
    userUuid: string;
  }
  const [saveUser, setSaveUser] = useState<User | null>(null);

  // 유저 변경 정보
  const [file, setFile] = useState<File | null>(null);
  const [nickname, setNickname] = useState(''); // 닉네임
  const [statusNickname, setStatusNickname] = useState(''); // 닉네임 유효성

  // 페이지를 불러올 때 유저정보를 받아온다.
  const GetUserProfile = () => {
    httpAuth.get(`/members/profile`).then((res) => {
      setSaveUser(res?.data);
      setNickname(res?.data?.nickname);
    });
  };

  useEffect(() => {
    GetUserProfile();
  }, []);

  const handleModify = () => {
    const formData = new FormData();

    formData.append('nickname', nickname);
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('file', new File([new Blob()], 'empty_image.png', { type: 'image/png' }));
    }
    httpAuth
      .put(`/members/profile`, formData)
      .then(() => {
        setStatusNickname('success');
        GetUserProfile();
      })
      .catch(() => {
        setStatusNickname('error');
      });
  };

  // 파일변경
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <h1>정보변경</h1>

      <div>
        <p>nickname: {saveUser?.nickname}</p>
        <p>profileImg: {saveUser?.profileImg}</p>
        <p>userUuid: {saveUser?.userUuid}</p>
      </div>

      <form>
        <Paragraph>프로필이미지</Paragraph>
        <input type="file" onChange={onChange} />

        <Paragraph>닉네임변경</Paragraph>
        <input
          type="text"
          id="nickname"
          placeholder="닉네임을 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        {statusNickname === 'error' && (
          <Paragraph color="dangerColor">정보 변경에 실패했어요!</Paragraph>
        )}
        {statusNickname === 'success' && (
          <Paragraph color="successColor">정보 변경에 성공했어요!</Paragraph>
        )}

        <Button onClick={handleModify}>정보 변경</Button>

        <br />
      </form>
    </div>
  );
};

export default Index;

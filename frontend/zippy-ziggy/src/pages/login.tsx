import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  return (
    <div>
      <h1>로그인페이지</h1>
      <Link href={{ pathname: '/signup' }}>
        <Image
          src="/images/noProfile.png"
          alt="프사"
          width={30}
          height={30}
          className="profileImage item"
        />
      </Link>
      <h1>카카오 로그인 테스트</h1>
      <a href="https://kauth.kakao.com/oauth/authorize?client_id=caeb5575d99036003c187adfadea9863&redirect_uri=http://localhost:8000/members/auth/kakao/callback&response_type=code">
        <img src="/image/kakao.png" />
      </a>
      <h1>구글 로그인</h1>
      <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=972594831157-fdfm8rq46vrb3tl81ds49o5978hs2ld0.apps.googleusercontent.com&redirect_uri=http://localhost:8000/members/login/oauth2/code/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile">
        <img src="/image/google.png" />
      </a>
    </div>
  );
}

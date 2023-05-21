import { links } from '@/utils/links';
import Image from 'next/image';
import Link from 'next/link';
import { AiFillGithub, AiFillInstagram, AiFillYoutube } from 'react-icons/ai';
import { RxNotionLogo } from 'react-icons/rx';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.navColor};
  padding: 70px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.blackColor20};
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .container {
    max-width: 1170px;
    margin: auto;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
  }
  ul {
    list-style: none;
  }
  .footer-col {
    width: 25%;
    padding: 0 15px;
  }
  .footer-col h4 {
    font-size: 18px;
    color: ${({ theme }) => theme.colors.blackColor90};
    text-transform: capitalize;
    margin-bottom: 35px;
    font-weight: 500;
    position: relative;
  }
  .footer-col h4::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    background-color: ${({ theme }) => theme.colors.primaryColor};
    height: 2px;
    box-sizing: border-box;
    width: 50px;
  }
  .footer-col ul li:not(:last-child) {
    margin-bottom: 10px;
  }
  .footer-col ul li a {
    font-size: 16px;
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.blackColor70};
    text-decoration: none;
    font-weight: 300;
    display: block;
    transition: all 0.3s ease;
  }
  .footer-col ul li a:hover {
    color: ${({ theme }) => theme.colors.blackColor100};
    padding-left: 8px;
  }
  .footer-col .social-links {
    display: flex;
  }
  .footer-col .social-links a {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    background-color: ${({ theme }) => theme.colors.blackColor03};
    margin: 0 10px 10px 0;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    transition: all 0.5s ease;
  }
  .footer-col .social-links a:hover {
    color: #24262b;
    background-color: ${({ theme }) => theme.colors.linkColor};
  }
  .social-icon {
    height: 20px;
    width: 20px;
    color: ${({ theme }) => theme.colors.blackColor60};
  }
  .proposal {
    color: ${({ theme }) => theme.colors.primaryColor};
  }

  /*responsive*/
  @media (max-width: 767px) {
    .footer-col {
      width: 50%;
      margin-bottom: 30px;
    }
  }
  @media (max-width: 300px) {
    .footer-col {
      width: 100%;
    }
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <div className="container">
        <div className="row">
          <div className="footer-col">
            <h4>Zippy Ziggy</h4>
            <ul>
              <li>
                <Link href="/">사이트 소개</Link>
              </li>
              <li>
                <Link href="/prompts">프롬프트 공유</Link>
              </li>
              <li>
                <Link href="/talks">대화 공유</Link>
              </li>
              <li>
                <Link href="https://zippyziggy.canny.io">
                  <span className="proposal">기능제안</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>팀 든든</h4>
            <ul>
              <li>
                <Link href="https://github.com/bbookng">김보경</Link>
              </li>
              <li>
                <Link href="https://github.com/ChangJuneKim">김창준</Link>
              </li>
              <li>
                <Link href="https://github.com/heisje">김희제</Link>
              </li>
              <li>
                <Link href="https://github.com/dltkdcks456">이상찬</Link>
              </li>
              <li>
                <Link href="https://github.com/EZ-000">이은지</Link>
              </li>
              <li>
                <Link href="https://github.com/Choihyoungkyu">최형규</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>고객센터</h4>
            <ul>
              <li>
                <Link href={links.noticeLink}>공지사항</Link>
              </li>
              <li>
                <Link href="https://forms.gle/Lk4aTW94MNmam2my7">문의사항</Link>
              </li>
              <li>
                <Link href="/legal#termsOfUse">이용약관</Link>
              </li>
              <li>
                <Link href="/legal#privacyPolicy">개인정보 처리방침</Link>
              </li>
              <li>ⓒ ZippyZiggy Corp.</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>follow us</h4>
            <div className="social-links">
              <Link href={links.youtube}>
                <AiFillYoutube className="social-icon" />
              </Link>
              <Link href={links.noticeLink}>
                <RxNotionLogo className="social-icon" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StyledFooter>
  );
};

export default Footer;

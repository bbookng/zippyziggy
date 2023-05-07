import styled from 'styled-components';
import { media } from '@/styles/media';

const ContainerTitle = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2rem;
  padding: 1rem 10rem;
  justify-content: center;
  align-items: flex-end;

  ${media.large`
    padding: 1rem 2rem;
  `}

  ${media.small`
    margin-top: 1rem;
    padding: 1rem 1rem;
  `}
`;

type TitleProps = {
  isNext: boolean;
};

const TitleWrapper = styled.div<TitleProps>`
  display: flex;
  align-items: flex-end;
  width: 45%;
  /* max-width: 600px; */
  margin-right: 2rem;

  ${media.small`
    width: 100%;
    max-width: ${(props) => props.isNext && '500px'};
    margin: 0;
    justify-content: space-between;
  `}

  .title {
    font-size: 1.75rem;
    font-weight: var(--fonts-heading);
  }

  .help {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--colors-link);
    margin-left: 0.5rem;
    font-weight: 500;
    font-size: 1rem;

    .icon {
      margin-right: 0.2rem;
    }
  }
`;

const TitleInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 45%;
  /* max-width: 600px; */

  ${media.small`
  display: none;
  `}

  .fork {
    font-weight: var(--fonts-heading);
    font-size: 15px;
    margin-right: 0.5rem;
  }
  .forkName {
    font-weight: 300;
    font-size: 13px;
    margin-right: 0.5rem;
  }
  .userName {
    font-size: 10px;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.blackColor30};
  }
`;

const Body = styled.div`
  width: 100%;
  height: 100%;

  .pageSlider-entering {
    opacity: 0;
    /* transform: scale(1.1); */
    transform: translate3d(100%, 0, 0);
    background: pink;
    animation-name: slidein 4s 1s;
  }

  .pageSlider-entered {
    opacity: 1;
    /* transform: scale(1);
    transition: opacity 300ms, transform 300ms; */
    transform: translate3d(0, 0, 0);
    transition: all 500ms;
    background: black;
    animation-name: slidein 4s 1s;
  }

  .pageSlider-exiting {
    opacity: 1;
    /* transform: scale(1); */
    transform: translate3d(0, 0, 0);
    background: blue;
  }

  .pageSlider-exited {
    opacity: 0;
    /* transform: scale(0.9);
    transition: opacity 300ms, transform 300ms;
    transform: translate3d(-100%, 0,0); */
    transition: all 700ms;
    background: purple;
  }
`;

export { ContainerTitle, TitleWrapper, TitleInfoWrapper, Body };

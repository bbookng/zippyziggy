import { media } from '@/styles/media';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;

  .time {
    font-size: var(--fonts-body-sm);
    color: ${({ theme }) => theme.colors.blackColor30};

    ${media.small`
      font-size: var(--fonts-body-xm);
    `}
  }
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: flex-end; */

  .title {
    font-size: var(--fonts-desktop-heading-3xl);
    font-weight: var(--fonts-heading);

    ${media.small`
      font-size: var(--fonts-desktop-heading-2xl);
    `}
  }

  .category {
    /* margin-left: 0.5rem; */
    font-size: var(--fonts-body-sm);

    ${media.small`
      display: flex;
      justify-content: space-between;
    `}
  }
`;

const ActionBox = styled.div`
  display: none;

  .heartBox {
    display: flex;
    width: fit-content;
    margin-right: 0.75rem;
    .heart {
      color: ${({ theme }) => theme.colors.heartColor};
      cursor: pointer;
      transition: all 0.2s ease-out;
      &:hover {
        transform: translate(0, -0.4ex);
        box-shadow: ${({ theme: { shadows } }) => shadows.boxShadowLarge};
      }
      &:active {
        transform: scale(0.95);
      }
    }
    .likeCnt {
      margin-left: 0.25rem;
    }
  }

  .bookmark {
    color: ${({ theme }) => theme.colors.bookmarkColor};
    margin-right: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease-out;
    &:hover {
      transform: translate(0, -0.4ex);
      box-shadow: ${({ theme: { shadows } }) => shadows.boxShadowLarge};
    }
    &:active {
      transform: scale(0.95);
    }
  }

  .dot {
    cursor: pointer;
  }

  ${media.small`
    display: flex;
  `}
`;

const UserBox = styled.div`
  display: flex;
  padding: 1rem 0;

  .image {
    width: 3rem;
    border-radius: 50%;
  }

  .user {
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .info {
      font-size: var(--fonts-body-sm);
      color: ${({ theme }) => theme.colors.blackColor30};
      margin-bottom: 0.25rem;
    }

    .name {
      font-weight: var(--fonts-heading);
    }
  }

  .icon {
    align-self: center;
    margin: 0 1rem;
  }
`;

const PopUp = styled.div`
  position: relative;

  .popUp {
    position: absolute;
    width: 80px;
    top: 0;
    right: 1rem;
    padding: 0.2rem 0;

    border-radius: var(--borders-radius-base);
    background-color: ${({ theme }) => theme.colors.grayColor};
    box-shadow: ${({ theme }) => theme.shadows.boxShadowSmall};
    font-size: 0.9rem;
    div:nth-child(1) {
      border-bottom: 1px solid var(--light-color);
    }

    div {
      display: flex;
      justify-content: center;
      padding-left: 5px;
      padding: 0.5rem;
      color: ${({ theme }) => theme.colors.blackColor80};
      transition: all 0.15s var(--timing-func);

      .icon {
        margin-right: 0.25rem;
      }

      &:hover {
        cursor: pointer;
        color: ${({ theme }) => theme.colors.primaryColor};
      }
    }
  }
`;

export { Container, TitleBox, UserBox, ActionBox, PopUp };

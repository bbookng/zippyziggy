import styled from 'styled-components';

const Conatiner = styled.div`
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.whiteColor80};
  box-shadow: ${({ theme }) => theme.shadows.boxShadowLarge};
  max-width: 500px;

  .image {
    background-color: ${({ theme }) => theme.colors.grayColor};
    /* cursor: pointer; */
    width: 100%;

    /* height: 10rem; */
    object-fit: cover;
    border-radius: 4px 4px 0 0;
    aspect-ratio: calc(2);
  }

  .caption {
    font-size: var(--fonts-body-xm);
    color: ${({ theme }) => theme.colors.blackColor50};
  }
`;

const Body = styled.div`
  cursor: pointer;
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  aspect-ratio: calc(3);
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-weight: var(--fonts-heading);
    font-size: var(--fonts-desktop-heading-xl);
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

const Content = styled.div`
  margin-top: 1rem;
  font-size: var(--fonts-body-sm);
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  min-height: 3rem;
`;

const Infos = styled.div`
  display: flex;
  margin-top: auto;

  .divider {
    margin-inline: 0.5rem;
  }
`;

const Footer = styled.div`
  width: 100%;
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  border-top: 1px solid ${({ theme }) => theme.colors.blackColor10};

  .user {
    display: flex;
    align-items: center;
    overflow: hidden;

    .profileImg {
      height: 100%;
      border-radius: 50%;
    }
    .nickname {
      margin-left: 8px;
      font-size: ${({ theme }) => theme.fonts.body_sm};
      white-space: pre-wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }

  .extraBox {
    right: 0;
    display: flex;
    align-items: center;

    .likeItem {
      height: 2.2rem;
      padding: 0.5rem 0.7rem 0.5rem 0.5rem;
      border-radius: 3rem;
      /* border: 1px solid ${({ theme }) => theme.colors.blackColor05}; */
      box-shadow: inset 1px 1px 1px ${({ theme }) => theme.colors.blackColor05};
    }

    .bookmarkItem {
      width: 2.2rem;
      height: 2.2rem;
      padding: 0.5rem;
      border-radius: 3rem;
      /* border: 1px solid ${({ theme }) => theme.colors.blackColor05}; */
      box-shadow: inset 1px 1px 1px ${({ theme }) => theme.colors.blackColor05};
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.5rem;

      .like {
        width: 1.7rem;
        height: 2rem;
        padding: 0.5rem 0.5rem 0.5rem 0.2rem;
        color: var(--colors-heart);
        cursor: pointer;
      }
      .bookmark {
        width: 1rem;
        height: 1rem;
        color: var(--colors-bookmark);
        cursor: pointer;
      }
      .play {
        width: 2.2rem;
        height: 2.2rem;
        padding: 0.5rem;
        color: ${({ theme }) => theme.colors.whiteColor100};
        border-radius: 3rem;
        background: ${({ theme }) =>
          `linear-gradient(322.63deg, ${theme.colors.primaryColor} 10.93%, ${theme.colors.primaryColor} 100%)`};
        /* linear-gradient(322.63deg, #5de16a 10.93%, #00e3ae 100%);*/
        cursor: pointer;
      }
    }
  }
`;

export { Conatiner, Body, Title, Content, Infos, Footer };

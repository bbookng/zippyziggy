import styled from 'styled-components';

const ColorBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.whiteColor100};
  /* background-color: var(--colors-primary-10); */
  min-width: 280px;

  max-width: 400px;
  padding: 1rem 1.25rem;
  width: 100%;
  height: 8rem;
  border-radius: var(--borders-radius-base);
  border: 1px solid ${({ theme }) => theme.colors.blackColor10};
  cursor: pointer;
  transition: all 0.2s ease-out;
  &:hover {
    transform: translate(0, -0.4ex);
    box-shadow: ${({ theme: { shadows } }) => shadows.boxShadowLarge};
  }
  &:active {
    transform: scale(0.95);
  }

  .title {
    word-wrap: break-word;
    font-weight: var(--fonts-heading);
  }

  .footBox {
    display: flex;

    .userBox {
      display: flex;
      align-items: center;
      overflow: hidden;

      .img {
        margin-right: 0.25rem;
      }
      .nickname {
        margin-left: 8px;
        max-width: 100px;
        font-size: ${({ theme }) => theme.fonts.body_sm};
        white-space: pre-wrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }

    .infoBox {
      margin-left: auto;
      display: flex;
      color: var(--colors-white-80);
      /* width: fit-content; */

      .heartBox {
        background-color: ${({ theme }) => theme.colors.heartColor};
        border-radius: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--fonts-body-xm);
        padding: 0.25rem 0.5rem;
        margin-right: 0.5rem;

        .icon {
          margin-right: 0.5rem;
        }
      }

      .commentBox {
        background-color: ${({ theme }) => theme.colors.primaryColor};
        border-radius: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--fonts-body-xm);
        padding: 0.25rem 0.5rem;

        .icon {
          margin-right: 0.5rem;
        }
      }
    }
  }
`;

export { ColorBox };

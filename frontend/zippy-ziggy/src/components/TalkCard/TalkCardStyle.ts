import styled from 'styled-components';

const ColorBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.whiteColor100};
  /* background-color: var(--colors-primary-10); */
  padding: 1rem 1.25rem;
  width: 100%;
  height: 8rem;
  border-radius: var(--borders-radius-base);
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
    font-weight: var(--fonts-heading);
  }

  .footBox {
    display: flex;

    .userBox {
      display: flex;
      align-items: center;
      .img {
        margin-right: 0.25rem;
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

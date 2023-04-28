import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  padding-block: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayColor};
`;

const UserBox = styled.div`
  display: flex;
  width: 100%;

  .image {
    margin-right: 1rem;
    border-radius: 50%;
  }

  .infoBox {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    .nameBox {
      display: flex;
      .name {
        font-weight: var(--fonts-heading);
      }
      .icon {
        cursor: pointer;
        margin-left: auto;
      }
    }
    .date {
      font-size: var(--fonts-body-sm);
      color: ${({ theme }) => theme.colors.blackColor30};
      margin-top: 0.25rem;
    }
  }
`;

const ContentBox = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const EditPopUp = styled.div`
  position: relative;

  .popUp {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
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

const TextareaBox = styled.div`
  width: 100%;
  display: flex;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.grayColor};
  border-radius: var(--borders-radius-base);

  .btnBox {
    display: flex;
    flex-direction: column;

    .btn {
      margin: auto;
      width: 3rem;
      height: 2rem;
      font-size: var(--fonts-body-sm);
      &:hover {
        color: ${({ theme }) => theme.colors.blackColor90};
      }
    }

    button:first-child {
      margin-bottom: 0.25rem;
    }
    button:last-child {
      color: ${({ theme }) => theme.colors.blackColor80};
      background-color: ${({ theme }) => theme.colors.grayColor};
    }
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bgColor};
  box-shadow: none;
  resize: none;
`;

export { Container, UserBox, ContentBox, EditPopUp, TextareaBox, Textarea };

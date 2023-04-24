import { media } from '@/styles/media';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;

  .btn {
    margin: 1rem auto;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.primaryColor80};
    }
  }
  .btnNone {
    margin: 1rem auto;
  }
`;

const Title = styled.div`
  margin-top: 5rem;
  font-size: var(--fonts-desktop-heading-xl);
  font-weight: var(--fonts-heading);
  /* margin-bottom: 0.5rem; */

  ${media.small`
      margin-top: 3rem;
    `}
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.grayColor};
  border-radius: var(--borders-radius-base);
  padding: 1rem;
  margin-top: 0.5rem;

  .btn {
    font-size: var(--fonts-body-sm);
    &:hover {
      color: white;
    }
  }
`;

const Textarea = styled.textarea`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bgColor};
  box-shadow: none;
  min-height: 1rem;
  resize: none;
`;

const CommentList = styled.ul`
  display: flex;
`;

export { Container, Title, InputBox, Textarea, CommentList };

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
  margin-bottom: 8px;

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
  padding: 8px;
  margin-top: 0.5rem;
  background-color: ${({ theme }) => theme.colors.bgColor};

  .btn {
    font-size: var(--fonts-body-sm);
    margin: 0 8px 0 0;
    &:hover {
      color: white;
    }
  }
`;

const Textarea = styled.textarea`
  display: flex;
  width: 100%;
  background: none;
  /* background-color: ${({ theme }) => theme.colors.bgColor}; */
  box-shadow: none;
  min-height: 1rem;
  resize: none;
`;

const CommentList = styled.ul`
  display: flex;
`;

export { Container, Title, InputBox, Textarea, CommentList };

import styled from 'styled-components';

interface PropsType {
  mt?: string;
  mb?: string;
  ml?: string;
  mr?: string;
}

const Container = styled.div<PropsType>`
  display: flex;
  align-items: center;
  padding: 0.25rem 1rem;
  width: 100%;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.colors.whiteColor80};
  margin-top: ${(props) => (props.mt ? props.mt : '')};
  margin-bottom: ${(props) => (props.mt ? props.mb : '')};
  margin-left: ${(props) => (props.mt ? props.ml : '')};
  margin-right: ${(props) => (props.mt ? props.mr : '')};

  .icon {
    margin-right: 0.5rem;
  }
`;

const Input = styled.input`
  box-shadow: none;
  font-size: var(--fonts-body-sm);
  width: 100%;
`;

export { Container, Input };

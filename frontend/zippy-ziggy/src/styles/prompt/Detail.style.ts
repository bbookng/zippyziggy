import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  padding: 4rem;
`;

const LeftContainer = styled.div`
  display: flex;
  width: 70%;
  border: 1px solid;
`;

const RightContainer = styled.div`
  display: flex;
  width: 30%;
  border: 1px solid;
`;

const TopBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export { Container, LeftContainer, RightContainer, TopBox };

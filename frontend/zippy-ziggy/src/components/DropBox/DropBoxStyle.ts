import styled from 'styled-components';

const Dropdown = styled.div`
  position: relative;
  display: flex;
  margin-top: 0.5rem;
`;

const DropBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.grayColor};
  border-radius: 8px;
  /* background-color: ${({ theme }) => theme.colors.bgColor}; */
  font-weight: 400;
  color: ${({ theme }) => theme.colors.blackColor80};
  padding: 12px;
  width: 10rem;
  height: 2.5rem;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  box-shadow: none;

  .icon {
    margin-left: auto;
  }
`;

const DropdownContent = styled.ul`
  position: absolute;
  top: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: 400;
  background-color: ${({ theme }) => theme.colors.whiteColor100};
  min-width: 10rem;
  /* max-height: 15rem; */
  border-radius: 8px;
  /* height: 160px; */
  overflow-y: auto;
  z-index: 1;
  box-shadow: ${({ theme }) => theme.shadows.boxShadowSmall};

  ::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: ${({ theme }) => theme.colors.primaryColor80};
  }

  li {
    display: flex;
    justify-content: center;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.blackColor50};
    font-size: 14px;
    padding: 12px 20px;

    :hover {
      color: ${({ theme }) => theme.colors.primaryColor80};
      cursor: pointer;
    }
  }

  .show {
    display: block;
  }
`;

export { Dropdown, DropBtn, DropdownContent };

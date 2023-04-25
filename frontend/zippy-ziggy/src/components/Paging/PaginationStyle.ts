import styled from 'styled-components';

const Container = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  ul.pagination li {
    display: inline-block;
    width: 30px;
    height: 30px;
    /* border: 1px solid #e2e2e2; */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
  }

  ul.pagination li:first-child {
    border-radius: 5px 0 0 5px;
  }

  ul.pagination li:last-child {
    border-radius: 0 5px 5px 0;
  }

  ul.pagination li a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.blackColor80};
    font-size: 1rem;
  }

  ul.pagination li.active a {
    color: ${({ theme }) => theme.colors.primaryColor};
  }

  ul.pagination li.active {
    background-color: ${({ theme }) => theme.colors.bgColor};
  }

  ul.pagination li a:hover,
  ul.pagination li a.active {
    color: ${({ theme }) => theme.colors.primaryColor};
  }

  .page-selection {
    width: 48px;
    height: 30px;
    color: ${({ theme }) => theme.colors.blackColor80};
  }
`;

export { Container };

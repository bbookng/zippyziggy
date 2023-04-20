import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Container, Input } from './Search.style';

interface PropsType {
  value: string | null;
  setValue: (e) => void;
}

export default function Search({ value, setValue }: PropsType) {
  return (
    <Container mt="0.5rem">
      <FaSearch className="icon" />
      <Input
        value={value}
        placeholder="검색어를 입력해주세요"
        onChange={(e) => setValue(e.target.value)}
      />
    </Container>
  );
}

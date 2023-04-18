import Link from 'next/link';
import React from 'react';

export default function Prompt() {
  return (
    <>
      <div>프롬프트 피드</div>
      <button type="button">
        <Link href="/prompt/create">프롬프트 작성</Link>
      </button>
    </>
  );
}

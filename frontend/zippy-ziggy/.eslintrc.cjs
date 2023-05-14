module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'next',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        trailingComma: 'es5',
        endOfLine: 'auto',
      },
    ],
    'react/react-in-jsx-scope': 0, // 0 이면 import React 안해도 됨
    'react/function-component-definition': 0,
    'arrow-body-style': 0, // 화살표 함수의 리턴 방식을 제한하지 않음
    '@typescript-eslint/no-shadow': 'warn', // 정의 후 사용하지 않은 변수는 경고만 하기
    'no-use-before-define': 1, // 정의 전에 사용 금지
    'jsx-a11y/label-has-associated-control': [
      // label로 htmlFor 태그를 감싸지않아도 됨
      2,
      {
        labelComponents: ['CustomInputLabel'],
        labelAttributes: ['label'],
        controlComponents: ['CustomInput'],
        depth: 3,
      },
    ],
    '@typescript-eslint/no-unused-expressions': 0,
    'no-nested-ternary': 0,
    'react/jsx-props-no-spreading': [0, { exceptions: ['input'] }], // props를 spread 연산자를 이용해서 내려주는 방식을 error가 아닌 warn으로 설정
    'import/no-extraneous-dependencies': 0, // 테스트 또는 개발환경을 구성하는 파일에서는 devDependency 사용을 허용
    'jsx-a11y/no-noninteractive-element-interactions': 0, // 나중에 필요하다고 생각하면 제거
    'import/prefer-default-export': 'warn',
    'react/prop-types': 'off', // Since we do not use prop-types
    'react/require-default-props': 'off', // Since we do not use prop-types
    'react/no-unused-prop-types': 'warn',
    'import/no-cycle': 'warn',
    'react-hooks/exhaustive-deps': 0,
    'jsx-a11y/interactive-supports-focus': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'react/no-array-index-key': 0,
    'no-plusplus': 0,
  },
};

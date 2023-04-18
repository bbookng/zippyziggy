import styled from 'styled-components';

export interface TitleProps {
  children?: string;
  margin?: string;
  padding?: string;
  fontWeight?: string;
  display?: 'block' | 'inline-block' | 'inline-flex' | 'inline';
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
}

const Title = styled.h1<TitleProps>`
  display: ${({ display }) => display || 'block'};
  text-align: ${({ textAlign }) => textAlign || 'center'};
  margin: ${({ margin }) => margin || 0};
  padding: ${({ padding }) => padding || 0};
  font-weight: ${({ fontWeight }) => fontWeight || '700'};
  letter-spacing: -0.02em;
`;

const TitleA = ({
  children,
  margin,
  padding,
  fontWeight,
  display,
  textAlign,
  ...rest
}: TitleProps) => {
  return (
    <Title
      margin={margin}
      padding={padding}
      fontWeight={fontWeight}
      display={display}
      textAlign={textAlign}
      {...rest}
    >
      {children}
    </Title>
  );
};

export default TitleA;

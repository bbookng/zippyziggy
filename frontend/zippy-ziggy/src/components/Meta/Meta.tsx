import Head from 'next/head';

type MetaProps = {
  url?: string;
  title?: string;
  image?: string;
  description?: string;
};

const Meta = ({ url, title, image, description }: MetaProps) => {
  return (
    <Head>
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title || '지피지기- Chat-GPT 프롬프트 공유'} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image || '/images/zippy_metaimage.png'} />
      <meta
        property="og:description"
        content={
          description ||
          '지피티를 알면 질문도 잘할 수 있다! GPT 프롬프트 및 대화 공유사이트 ZippyZiggy'
        }
      />
      <title>{title}</title>
    </Head>
  );
};

export default Meta;

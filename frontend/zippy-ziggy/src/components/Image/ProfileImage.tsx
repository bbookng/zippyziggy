import Image from 'next/image';
import { HTMLAttributes } from 'react';

/**
 * 타이틀을 사용한다.
 * @param {string} src
 * @param {string} alt
 * @param {int} size default = 64
 */
interface ProfileProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  size: number;
}

function ProfileImage({ src, alt = '이미지', size = 64, ...rest }: ProfileProps) {
  const handleImgError = (e) => {
    e.target.src = '/images/noProfile.png';
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        paddingBottom: size,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <Image
        priority
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          objectFit: 'cover',
          borderRadius: '100px',
        }}
        width={size}
        height={size}
        onError={handleImgError}
      />
    </div>
  );
}

export default ProfileImage;

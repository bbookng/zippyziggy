import Image from 'next/image';

function ProfileImage({ src, alt = '이미지', size = 64 }) {
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
      />
    </div>
  );
}

export default ProfileImage;

import imageCompression from 'browser-image-compression';

type ImgCompType = {
  image: File;
  maxSizeMB: number;
  maxWidthOrHeight: number;
};

const getImageDimensions = (file: Blob): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const imgComp = async ({ image, maxSizeMB = 1, maxWidthOrHeight = 800 }: ImgCompType) => {
  try {
    const imageFile = image;
    const { width, height } = await getImageDimensions(imageFile);
    // console.log(width, height);
    // console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    if ((width > height ? height : width) < maxWidthOrHeight) {
      return image;
    }
    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(imageFile, options);
    // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    return compressedFile;
  } catch (error) {
    return image;
  }
};

export default imgComp;

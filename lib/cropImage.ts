export default function getCroppedImg(imageSrc: string, crop: any) {
  return new Promise<{ file: File; url: string }>((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous"; // avoid CORS issues for external images

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("No 2D context");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("Canvas is empty");
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        resolve({ file, url });
      }, "image/jpeg");
    };

    image.onerror = (err) => reject(err);
  });
}

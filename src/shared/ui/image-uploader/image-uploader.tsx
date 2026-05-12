import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import styles from './image-uploader.module.css';
import { DraggableImage } from './draggable-image';
import { UploadIcon } from './image-uploader-photo';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  initialImages?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesChange,
  maxImages = 5,
  initialImages = [],
}) => {
  const [images, setImages] = useState<ImageFile[]>(
    initialImages.map((url, index) => ({
      id: `initial-${index}`,
      file: null as unknown as File,
      preview: url,
    }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFiles = (files: FileList) => {
    // можно перетаскивать больше 1 файла
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (file) => file.type.startsWith('image/') && images.length + fileArray.length <= maxImages
    );

    const newImages: ImageFile[] = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages.filter((img) => img.file).map((img) => img.file));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    if (imageToRemove?.preview && !imageToRemove.preview.startsWith('http')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages.filter((img) => img.file).map((img) => img.file));
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropZone}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.fileInput}
        />
        <div className={styles.dropZoneContent}>
          <p className={styles.dropText}>Перетащите или выберите изображения навыка</p>
          <div className={styles.uploadButton}>
            <UploadIcon />
            <span className={styles.browseLink}>Выбрать изображения</span>
          </div>{' '}
        </div>
      </div>

      {images.length > 0 && (
        <div className={styles.previewGrid}>
          {images.map((image, index) => (
            <DraggableImage
              key={image.id}
              image={image}
              index={index}
              onRemove={() => removeImage(image.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

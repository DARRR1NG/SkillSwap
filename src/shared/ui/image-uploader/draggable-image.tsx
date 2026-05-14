import React, { useRef } from 'react';
import type { DragEvent } from 'react';
import styles from './image-uploader.module.css';

interface DraggableImageProps {
  image: { id: string; preview: string; file: File | null };
  index: number;
  onRemove: () => void;
}

export const DraggableImage: React.FC<DraggableImageProps> = ({ image, index, onRemove }) => {
  const dragIndex = useRef<number>(index);
  const dragOverIndex = useRef<number>(index);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, idx: number) => {
    dragIndex.current = idx;
    e.dataTransfer.setData('text/plain', String(idx));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (idx: number) => {
    dragOverIndex.current = idx;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    dragIndex.current = -1;
    dragOverIndex.current = -1;
  };

  return (
    <div
      className={styles.imageItem}
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragEnter={() => handleDragEnter(index)}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <img src={image.preview} alt={`Preview ${index}`} className={styles.previewImage} />
      <button
        type="button"
        className={styles.removeButton}
        onClick={onRemove}
        aria-label="Удалить изображение"
      >
        ×
      </button>
    </div>
  );
};

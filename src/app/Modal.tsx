import React from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  noticia: {
    titulo: string;
    introducao: string;
    link: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, noticia }) => {
  if (!isOpen || !noticia) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>{noticia.titulo}</h2>
        <p className={styles.content}>{noticia.introducao}</p>
        <a href={noticia.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
          Leia a notícia completa
        </a>
      </div>
    </div>
  );
};

export default Modal;
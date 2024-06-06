import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';

interface IModalProps {
  title: string;
  isOpen: boolean;
  hasCloseBtn?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal = ({
  children,
  title,
  isOpen,
  hasCloseBtn,
  onClose
}: IModalProps) => {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
        modalElement.addEventListener('mousedown', onClickOutside);
      } else {
        modalElement.removeEventListener('mousedown', onClickOutside);
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  const onClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
    setModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
  };

  return (
    <dialog
      ref={modalRef}
      onKeyDown={handleKeyDown}
      className="jlab-gather-modal"
    >
      <div className="jlab-gather-modal-content">
        <div className="jlab-gather-modal-header">
          <div className="jlab-gather-modal-title">{title}</div>
          {hasCloseBtn && (
            <button
              className="jlab-gather-btn-danger jlab-gather-modal-close-btn"
              onClick={handleCloseModal}
            >
              <FontAwesomeIcon icon={faXmark} className="" />
            </button>
          )}
        </div>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;

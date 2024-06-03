import React, { useEffect, useRef, useState } from 'react';
import {
  adjectives,
  animals,
  uniqueNamesGenerator
} from 'unique-names-generator';
import { IModelRegistryData } from '../../registry';
import Modal from './Modal';

interface IAddNewUrlModalProps {
  isOpen: boolean;
  onSubmit: (data: IModelRegistryData) => void;
  onClose: () => void;
}

const AddNewUrlModal = ({
  onSubmit,
  isOpen,
  onClose
}: IAddNewUrlModalProps) => {
  const focusInputRef = useRef<HTMLInputElement | null>(null);

  const randomModelName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    style: 'capital',
    separator: ' '
  });

  const [formState, setFormState] = useState({
    name: randomModelName,
    url: ''
  });

  useEffect(() => {
    if (isOpen && focusInputRef.current) {
      setTimeout(() => {
        focusInputRef.current!.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setFormState(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    onSubmit(formState);
    setFormState({ name: randomModelName, url: '' });
  };

  return (
    <Modal
      title="Add a New Model"
      hasCloseBtn={true}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="jlab-gather-form" onSubmit={handleSubmit}>
        <div className="jlab-gather-form-input">
          <label htmlFor="userName">Model Name</label>
          <input
            required
            className="jlab-gather-input"
            name="name"
            type="text"
            placeholder="Model Name"
            value={formState.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="jlab-gather-form-input">
          <label htmlFor="room-code">Model Url</label>
          <input
            required
            className="jlab-gather-input"
            name="url"
            type="text"
            placeholder="Model Url"
            value={formState.url}
            onChange={handleInputChange}
          />
        </div>
        <button className="jlab-gather-btn-common jlab-gather-btn-primary">
          Add Model
        </button>
      </form>
    </Modal>
  );
};

export default AddNewUrlModal;

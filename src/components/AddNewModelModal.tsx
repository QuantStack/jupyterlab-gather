import React, { useEffect, useRef, useState } from 'react';
import {
  adjectives,
  animals,
  uniqueNamesGenerator
} from 'unique-names-generator';
import { IModelRegistryData } from '../registry';
import Modal from './Modal';

interface IAddNewModelModalProps {
  isOpen: boolean;
  onSubmit: (data: IModelRegistryData) => void;
  onClose: () => void;
}

const AddNewModelModal = ({
  onSubmit,
  isOpen,
  onClose
}: IAddNewModelModalProps) => {
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
    <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h2>Add a New Model</h2>
        <div className="form-input">
          <label htmlFor="userName">Model Name</label>
          <input
            required
            id="model-name"
            name="name"
            type="text"
            placeholder="Model Name"
            value={formState.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-input">
          <label htmlFor="room-code">Model Url</label>
          <input
            required
            id="model-url"
            name="url"
            type="text"
            placeholder="Model Url"
            value={formState.url}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn-primary">Add Model</button>
      </form>
    </Modal>
  );
};

export default AddNewModelModal;

import React, { useEffect, useRef, useState } from 'react';
import {
  adjectives,
  animals,
  uniqueNamesGenerator
} from 'unique-names-generator';
import { useFilePicker } from 'use-file-picker';
import { FileTypeValidator } from 'use-file-picker/validators';
import { IModelRegistryData } from '../../registry';
import Modal from './Modal';

interface IAddNewFileModalProps {
  isOpen: boolean;
  onSubmit: (data: IModelRegistryData) => void;
  onClose: () => void;
}

const AddNewFileModal = ({
  onSubmit,
  isOpen,
  onClose
}: IAddNewFileModalProps) => {
  const focusInputRef = useRef<HTMLInputElement | null>(null);

  const randomModelName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    style: 'capital',
    separator: ' '
  });

  const [formName, setFormName] = useState(randomModelName);

  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    accept: ['.glb'],
    readAs: 'ArrayBuffer',
    validators: [new FileTypeValidator(['glb'])],
    onFilesRejected: ({ errors }) => {
      console.log('files rejected', errors);
    },
    onFilesSuccessfullySelected: ({ plainFiles, filesContent }) => {
      console.log('onFilesSuccessfullySelected', plainFiles);
      onSubmit({ name: formName, gltf: filesContent[0].content });
    }
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
    const value = event.target.value;
    setFormName(value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Modal
      title="Add a New Model"
      hasCloseBtn={true}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="jlab-gather-form-input">
        <label htmlFor="userName">Model Name</label>
        <input
          required
          className="jlab-gather-input"
          name="name"
          type="text"
          placeholder="Model Name"
          value={formName}
          onChange={handleInputChange}
        />
      </div>

      {errors.length > 0 ? (
        <div>
          Something went wrong
          {errors.map(err => (
            <div>{err.name}</div>
          ))}
        </div>
      ) : (
        <div>
          <span>Selected File</span>
          {filesContent.map((file, index) => (
            <div>
              <div key={index}>{file.name}</div>
              <br />
            </div>
          ))}
        </div>
      )}
      <button
        className="jlab-gather-btn-common jlab-gather-btn-primary"
        onClick={() => openFilePicker()}
      >
        {loading ? 'Loading' : 'Select File'}
      </button>
    </Modal>
  );
};

export default AddNewFileModal;

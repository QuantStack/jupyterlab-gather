import React, { useEffect, useRef, useState } from 'react';
import {
  adjectives,
  animals,
  uniqueNamesGenerator
} from 'unique-names-generator';
import { useFilePicker } from 'use-file-picker';
//@ts-expect-error no types
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

  const { openFilePicker, filesContent, loading, errors, clear } =
    useFilePicker({
      accept: ['.glb'],
      readAs: 'ArrayBuffer',
      validators: [new FileTypeValidator(['glb'])],
      onFilesRejected: ({ errors }) => {
        console.log('files rejected', errors);
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

  const handleUpload = () => {
    onSubmit({ name: formName, gltf: filesContent[0].content });
    setFormName(randomModelName);
    clear();
  };

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

      <div style={{ fontStyle: 'italic' }}>
        Only .glb files are supported at the current time.
      </div>

      {errors.length > 0 ? (
        <div className="jlab-gather-file-content">
          <span className="jlab-gather-file-content-text">
            Something went wrong:
          </span>
          {errors.map(err => (
            <span className="jlab-gather-error-text"> {err.name}</span>
          ))}
        </div>
      ) : (
        <div className="jlab-gather-file-content">
          <span className="jlab-gather-file-content-text">Selected File: </span>
          {filesContent.map((file, index) => (
            <span key={index}> {file.name}</span>
          ))}
        </div>
      )}

      <div className="jlab-gather-modal-buttons">
        {loading ? (
          <div>loading</div>
        ) : (
          <>
            <button
              className="jlab-gather-btn-common jlab-gather-btn-primary"
              onClick={() => openFilePicker()}
            >
              Select File
            </button>
            <button
              className="jlab-gather-btn-common jlab-gather-btn-primary"
              onClick={handleUpload}
            >
              Upload
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddNewFileModal;

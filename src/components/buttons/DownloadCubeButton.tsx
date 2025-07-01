import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type IDownloadCubeProps = {};

const DownloadCubeButton = (props: IDownloadCubeProps) => {
  const handleDownload = () => {
    const url =
      'https://raw.githubusercontent.com/QuantStack/jupyterlab-gather/main/resources/ar-cubes/cube1.pdf';
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="jlab-gather-device-settings-row">
      <span className="jlab-gather-device-title">AR Cube:</span>
      <button
        className="jlab-gather-btn-common jlab-gather-btn-primary"
        onClick={handleDownload}
      >
        <FontAwesomeIcon icon={faDownload} className="jlab-gather-icon" />
        Download
      </button>
    </div>
  );
};

export default DownloadCubeButton;

//https://raw.githubusercontent.com/QuantStack/jupyterlab-gather/main/pattern-files

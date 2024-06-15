import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoaderProps {
  dims?: number; 
}

const Loader: React.FC<LoaderProps> = ({ dims = 100 }) => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: dims,
        height: dims,
        margin: 'auto',
        display: 'block',
      }}
    ></Spinner>
  );
};

export default Loader;

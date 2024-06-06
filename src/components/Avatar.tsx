import React from 'react';
import { Location } from './Peer';

type AvatarProps = {
  children: string;
  location: Location;
  className?: string;
};

const Avatar = ({ children, location, className }: AvatarProps) => {
  return (
    <div
      className={`jlab-gather-avatar ${className} jlab-gather-avatar-${location}`}
    >
      {children}
    </div>
  );
};

export default Avatar;

import React from 'react';

type AvatarProps = {
  children: string;
  location: string;
};

const Avatar = ({ children, location }: AvatarProps) => {
  return (
    <div className={`jlab-gather-avatar jlab-gather-avatar-${location}`}>
      {children}
    </div>
  );
};

export default Avatar;

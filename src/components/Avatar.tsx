import React from 'react';

type AvatarProps = {
  children: string;
  location: 'grid' | 'sidepane';
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

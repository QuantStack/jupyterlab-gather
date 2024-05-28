import React from 'react';

type AvatarProps = {
  children: string;
};

const Avatar = ({ children }: AvatarProps) => {
  return <div className="jlab-gather-spinner">{children}</div>;
};

export default Avatar;

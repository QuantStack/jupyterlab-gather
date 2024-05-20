import React from 'react';

type AvatarProps = {
  children: string;
};

const Avatar = ({ children }: AvatarProps) => {
  return <div className="avatar">{children}</div>;
};

export default Avatar;

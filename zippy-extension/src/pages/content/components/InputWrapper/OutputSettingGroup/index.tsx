import React, { ReactNode } from 'react';

interface OutputSettingGroupProps {
  children: ReactNode;
}
const OutputSettingGroup = ({ children }: OutputSettingGroupProps) => {
  return <div style={{ width: '100%', display: 'flex' }}>{children}</div>;
};

export default OutputSettingGroup;

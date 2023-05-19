import React, { ReactNode } from 'react';

interface OutputSettingGroupProps {
  children: ReactNode;
}
const OutputSettingGroup = ({ children }: OutputSettingGroupProps) => {
  return <div className="ZP_output-setting-group">{children}</div>;
};

export default OutputSettingGroup;

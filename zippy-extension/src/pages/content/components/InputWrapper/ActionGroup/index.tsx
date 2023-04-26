import React, { ReactNode } from 'react';

interface ActionGroupProps {
  children: ReactNode;
}

const ActionGroup = ({ children }: ActionGroupProps) => {
  return (
    <div style={{ display: 'inline-flex' }} role="group" id="actionGroup">
      {children}
    </div>
  );
};

export default ActionGroup;

import React, { ReactNode } from 'react';

interface ActionGroupProps {
  children: ReactNode;
}

const ActionGroup = ({ children }: ActionGroupProps) => {
  return (
    <div className="ZP_action-group" role="group" id="ZP_actionGroup">
      {children}
    </div>
  );
};

export default ActionGroup;

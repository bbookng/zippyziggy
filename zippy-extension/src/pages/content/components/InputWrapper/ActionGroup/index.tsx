import React, { ReactNode } from 'react';

interface ActionGroupProps {
  children: ReactNode;
}

const ActionGroup = ({ children }: ActionGroupProps) => {
  return (
    <div className="ZP_action-group ZP_invisible" role="group" id="ZP_actionGroup">
      {children}
    </div>
  );
};

export default ActionGroup;

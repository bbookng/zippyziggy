import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface DropdownContextProps {
  isExpand: boolean;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
}

interface DropdownProps {
  children: ReactNode;
}

export const DropdownContext = createContext<DropdownContextProps>({
  isExpand: false,
  setIsExpand: () => {},
});

const Dropdown = ({ children }: DropdownProps) => {
  const [isExpand, setIsExpand] = useState(false);
  const dropdownContextValue = useMemo(() => ({ isExpand, setIsExpand }), [isExpand, setIsExpand]);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsExpand(false);
    }
  };

  useEffect(() => {
    if (isExpand) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpand]);

  return (
    <DropdownContext.Provider value={dropdownContextValue}>
      <div ref={dropdownRef}>{children}</div>
    </DropdownContext.Provider>
  );
};

const Trigger = ({ children }: DropdownProps) => {
  const dropdown = useContext(DropdownContext);
  if (!dropdown) {
    throw new Error('');
  }
  const { setIsExpand } = dropdown;

  const handleTrigger = () => {
    setIsExpand((prev) => !prev);
  };

  return (
    <button className="ZP_dropdown-trigger" type="button" onClick={handleTrigger}>
      {children}
    </button>
  );
};

const OptionList = ({ children }: DropdownProps) => {
  const dropdown = useContext(DropdownContext);
  if (!dropdown) {
    throw new Error('');
  }
  const { isExpand, setIsExpand } = dropdown;
  const handleCloseMenuClick = () => {
    setIsExpand(false);
  };

  const handleCloseMenuKeydown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
      handleCloseMenuClick();
    }
  };

  return (
    <div className="ZP_dropdown-menu-wrapper">
      {isExpand && (
        <ul
          className="ZP_dropdown-menu"
          onClick={handleCloseMenuClick}
          onKeyDown={handleCloseMenuKeydown}
        >
          {children}
        </ul>
      )}
    </div>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.OptionList = OptionList;

export default Dropdown;

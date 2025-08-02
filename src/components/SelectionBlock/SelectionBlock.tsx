import React from 'react';
import s from './SelectionBlock.module.scss';

interface SelectionBarProps {
  selectedCount: number;
  onClear: () => void;
  onDownload: () => void;
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  onClear,
  onDownload,
}) => {
  return (
    <div className={s.selectionBar}>
      <span>
        Selected {selectedCount} {selectedCount === 1 ? 'element' : 'elements'}
      </span>
      <div>
        <button onClick={onClear}>Deselect all</button>
        <button onClick={onDownload}>Download</button>
      </div>
    </div>
  );
};

export default SelectionBar;

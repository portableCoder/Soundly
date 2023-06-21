import React, { useEffect, useState } from 'react';
interface TagSelectProps {
  tags: string[];
  onChange: (selected: string[]) => void;
}
const TagSelect = ({ tags, onChange }: TagSelectProps) => {
  const [selected, setSelected] = useState(new Array(tags.length).fill(false));
  useEffect(() => {
    onChange(tags.filter((el, i) => selected[i]));
  }, [selected]);
  useEffect(() => {
    setSelected(new Array(tags.length).fill(false));
  }, [tags]);
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-3">
        {selected.map((sel, i) => (
          <button
            onClick={() => {
              let newSelected = [...selected];
              newSelected[i] = !sel;
              setSelected(newSelected);
            }}
            className={`btn btn-outline rounded-sm truncate ... ${
              sel ? 'btn-active' : ''
            }`}
          >
            {' '}
            {tags[i]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSelect;

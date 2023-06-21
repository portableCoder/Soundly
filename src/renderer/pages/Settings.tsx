import React, { useEffect, useState } from 'react';
import useAppStore from 'renderer/hooks/useStore';
const themes = ['dark', 'light', 'auto'] as const;
const Settings = () => {
  const globalTheme = useAppStore((el) => el.theme);
  const [theme, setLocalTheme] = useState('');
  const [selected, setSelected] = useState(() => {
    const idx = themes.indexOf(globalTheme);
    const sel = [false, false, false];
    sel[idx] = true;
    return sel;
  });
  const setTheme = useAppStore((el) => el.setTheme);
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  useEffect(() => {
    if (didMount) {
      if (theme === 'dark') {
        setTheme('dark');
      } else if (theme === 'light') {
        setTheme('light');
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark');
        } else {
          // Light
          setTheme('light');
        }
      }
    }
  }, [theme]);
  return (
    <div className="flex flex-col gap-y-3">
      <div className="text-2xl">Settings</div>
      <div className="">
        <div className="text-xl my-2">Theme</div>
        <div className="flex gap-x-3">
          {themes.map((el, i) => (
            <div className="flex flex-col items-center justify-center">
              <input
                type="radio"
                onChange={() => {
                  const selected = [false, false, false];
                  selected[i] = true;
                  setSelected(selected);
                  setLocalTheme(el);
                }}
                name="radio-1"
                className="radio radio-secondary text-xs"
                checked={selected[i]}
              />
              <div>{el}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;

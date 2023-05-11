import path from 'path';

const getFileName = (filepath: string) => {
  return window.electron.file.getFileName(filepath);
};
export default getFileName;

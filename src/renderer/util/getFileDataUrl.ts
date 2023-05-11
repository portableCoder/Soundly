export default function(path:string){
  const buffer = window.electron.file.getFile(path)
  if(!buffer){
    throw new Error('File not found')
  }
  const blob = new Blob([buffer]);

  return URL.createObjectURL(blob)

}

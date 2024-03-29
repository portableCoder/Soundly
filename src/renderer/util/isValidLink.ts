import ReactPlayer from "react-player";

export default function isValidLink(url:string){
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length == 11 || ReactPlayer.canPlay(url)) && (url.includes('youtube' ) || url.includes('youtu.be'))


}

type YtData ={
    "title": string,
    "author_name": string,
    "author_url": string,
    "type": "video",
    "height": number,
    "width": number,
    "version": "1.0",
    "provider_name": "YouTube",
    "provider_url": "https://www.youtube.com/",
    "thumbnail_height": number,
    "thumbnail_width": number,
    "thumbnail_url":string,
    "html":string
}
export default async function getVideoDetails(VideoID:string):Promise<YtData>{
    const vlink = "https://www.youtube.com/watch?v="+VideoID
    const dat = {"format": "json", "url": vlink}
    const url = "https://www.youtube.com/oembed?" + new URLSearchParams(dat).toString()

    const response = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',

    },

  });
  return response.json(); // parses JSON response into native JavaScript objects

}

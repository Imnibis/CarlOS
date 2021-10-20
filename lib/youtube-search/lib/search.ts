import { ParserService } from './parser.service';
import got from 'got';

export async function searchVideo(searchQuery: string) {
  const YOUTUBE_URL = 'https://www.youtube.com';

  const results = [];
  let details = [];
  let fetched = false;
  const options = { type: "video", limit: 0 };

  const searchRes: any = await got.get(encodeURI(`${YOUTUBE_URL}/results?q=${encodeURI(searchQuery.trim())}&hl=en`));
  let html = await searchRes.body;
  // try to parse html
  try {
    const data = html.split("ytInitialData = ")[1].split(";</script>")[0];
    // @ts-ignore
    html = data.replace(/\\x([0-9A-F]{2})/ig, (...items) => {
      return String.fromCharCode(parseInt(items[1], 16));
    });
    html = html.replaceAll("\\\\\"", "");
    html = JSON.parse(html)
  } catch(e) {
    console.log("Failed at 1")
  }

  if(html?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents &&
    html?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.length > 0 &&
    html?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents[0]?.itemSectionRenderer?.contents &&
    html?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents[0]?.itemSectionRenderer?.contents?.length > 0){
    details = html.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    console.log(html);
    fetched = true;
  }
  // backup/ alternative parsing
  if (!fetched) {
    try {
      details = JSON.parse(html.split('{"itemSectionRenderer":{"contents":')[html.split('{"itemSectionRenderer":{"contents":').length - 1].split(',"continuations":[{')[0]);
      fetched = true;
    } catch (e) {
      console.log("Failed at 2")
    }
  }
  if (!fetched) {
    try {
      details = JSON.parse(html.split('{"itemSectionRenderer":')[html.split('{"itemSectionRenderer":').length - 1].split('},{"continuationItemRenderer":{')[0]).contents;
      fetched = true;
    } catch(e) {
      console.log("Failed at 3")
    }
  }

  if (!fetched) return [];

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < details.length; i++) {
    if (typeof options.limit === "number" && options.limit > 0 && results.length >= options.limit) break;
    const data = details[i];

    const parserService = new ParserService();
    const parsed = parserService.parseVideo(data);
    if (!parsed) continue;
    const res = parsed;

    results.push(res);
  }

  return results;
}
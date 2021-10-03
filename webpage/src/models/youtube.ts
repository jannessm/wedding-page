
const reg = /(^.*v=([a-zA-Z0-9_-]{11})(&.*)?$)|(^.*\/([a-zA-Z0-9_-]{11})(\?.*)?$)/;

export function getYoutubeID(link: string): string {
    return link.replace(reg, '$2$5');
}

export function isYoutubeLink(link: string) {
    return link.search(reg) >= 0;
}
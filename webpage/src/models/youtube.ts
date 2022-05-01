
const reg = /(^.* )?((\S*v=([a-zA-Z0-9_-]{11})(\S*)?)|(\S*\/([a-zA-Z0-9_-]{11})(\S*)?))(.*$)/;

export function getYoutubeID(link: string): string {
    return link.replace(reg, '$4$7');
}

export function isYoutubeLink(link: string) {
    return link.search(reg) >= 0;
}

export function removeYoutubeLink(link: string): string {
    return link.replace(reg, '$1$9').replace('  ', ' ');
}
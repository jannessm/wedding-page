import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GuestService } from 'src/app/services/guest/guest.service';
import { GuestTable } from 'src/models/guest-table';
import { getYoutubeID, isYoutubeLink } from 'src/models/youtube';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent {
  songs: {guest: string, song: SafeResourceUrl, songName: string, youtube: boolean}[] = [];

  constructor(private guestService: GuestService, private sanitizer: DomSanitizer) {

    this.guestService.guests.subscribe(guests => {
      this.handleData(guests);
    });

    if (this.guestService._lastDataObject) {
      this.handleData(this.guestService._lastDataObject);
    }
  }

  handleData(guests: GuestTable[]) {
    this.songs = guests.filter(guest => !!guest.song).map(guest => {
      let youtube = false;
      if (guest.song.includes('youtu')) {
        youtube = true;
      }
      return {
        guest: guest.name + ' ' + guest.lastname,
        song: this.getSaveYoutubeURL(guest.song),
        songName: guest.song,
        youtube
      };
    });
  }

  getSaveYoutubeURL(link: string) {
    if (!isYoutubeLink(link)) {
      return '';
    }
    const youtubeId = getYoutubeID(link);
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + 
    youtubeId);
  }

}

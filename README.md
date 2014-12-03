# allmuz
Search, stream and download MP3s from Allmuz.

## Installation

    $ npm install allmuz

## Example
```javascript
var fs = require('fs'),
    allmuz = require('./');

allmuz('ty segall it #1', function (err, tracks) {
    var track;

    if (err || !tracks || !tracks.length) {
        return console.error('nothing found');
    }

    track = tracks[0];
    track.song.pipe(fs.createWriteStream('out.mp3'));

    console.log(
        'found "' + track.title + '" by "' + track.artist + '", ' +
        track.duration + ' seconds long'
    );
    console.log('listen @ ' + track.direct);
    console.log('downloading to "out.mp3"...');
});
```

## API
### allmuz(terms, [options], done)
Search MP3 tracks based on search terms.

`terms` is expected to be search terms for MP3 tracks. For example, an artist
and track name.

`options` is an optional object which is passed to each *needle* instance's
`options` argument. You can specify custom timeouts or agents this way.

`done` returns a list of tracks. Each track may contain a `title`, `artist`,
`duration`, `direct` and `song` field. `direct` is the URL to the MP3 file and
`song` is a lazystream that will directly output the MP3 stream when read.

## License
MIT

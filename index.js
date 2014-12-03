var stream = require('stream'),

    cheerio = require('cheerio'),
    lazystream = require('lazystream'),
    needle = require('needle');

function parseDuration(time) {
    var seconds;

    time = time.split(':');

    if (time.length !== 2) {
        return 0;
    }

    seconds = (+time[0] || 0) * 60;
    seconds += +time[1] || 0;

    return seconds;
}

function search(terms, options, done) {
    if (!done) {
        done = options;
        options = {};
    }

    needle.request('get', 'http://allmuz.org/aj.php', {
        melody: terms
    }, options, function (err, res, body) {
        var $, tracks;

        if (err) {
            return done(err);
        }

        try {
            $ = cheerio.load(body);
        } catch (e) {
            return done(e);
        }

        tracks = [];

        $('div[style="width:80%;"]').each(function () {
            var artist, title, duration, url;

            artist = $('#autor', this).text();
            title = $('#title', this).text();
            duration = $('#time', this).text();

            url = $('a', $(this).prev()).attr('href');

            artist = artist.length ? artist : undefined;
            title = title.length ? title : undefined;
            url = url.length ? url : undefined;

            if (!artist && !title && !url) {
                return;
            }

            tracks.push({
                artist: artist,
                title: title,
                duration: parseDuration(duration),
                direct: url,
                song: new lazystream.Readable(function () {
                    var out;

                    if (!url) {
                        out = new stream.PassThrough();

                        process.nextTick(function () {
                            out.emit('error', new Error('No URL found.'));
                        });

                        return out;
                    }

                    return needle.get(url, options);
                })
            });
        });

        done(null, tracks);
    });
}

module.exports = search;

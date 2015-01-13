var isMp3 = require('is-mp3'),
    tap = require('tap').test,

    allmuz = require('./');

tap('finding tracks', function (test) {
    test.plan(4);

    allmuz('ty segall', function (err, tracks) {
        var track = tracks[0];

        test.notOk(err, 'no errors');

        test.ok(tracks && tracks.length, 'tracks were found');
        test.ok(track.direct, 'direct link found');

        track.song.once('data', function (data) {
            test.ok(isMp3(data), 'the song is an mp3');
        });
    });
});

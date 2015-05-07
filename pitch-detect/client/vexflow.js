Template.vexflow.rendered = function() {
    var svg = $('.wrapper')[0];
    var renderer = new Vex.Flow.Renderer(svg, Vex.Flow.Renderer.Backends.SVG);
    var ctx = renderer.getContext();
    var treble = new Vex.Flow.Stave(10, 0, 80).addClef('treble').setContext(ctx);
    var bass = new Vex.Flow.Stave(10, 65, 80).addClef('bass').setContext(ctx);

    treble.draw();
    bass.draw();

    $('.wrapper').find('*').attr('data-base', true);
    $('.wrapper').find('*').css('opacity', 1);

    function getOpacity() {
        var detune = Math.abs(Session.get('detune'));
        //var correlation = Session.get('correlation');
        return Math.pow(1 - (detune/50), 1);
        //return Math.pow(correlation, 4);
    }

    function getNote(midi, note) {
        var staveNote = new Vex.Flow.StaveNote({
            clef: midi >= 60 ? 'treble' : 'bass',
            keys: [note],
            duration: "w"
        });
        if (note.indexOf('#') != -1) {
            staveNote.addAccidental(0, new Vex.Flow.Accidental("#"));
        } else if (note.indexOf('b') != -1) {
            staveNote.addAccidental(0, new Vex.Flow.Accidental("b"));
        }
        return staveNote;
    }

    this.autorun(function() {
        if (!Session.get('midi')) {
            return;
        }

        $('.wrapper').find('*:not([data-base=true])').each(function() {
            var e = $(this);
            e.css('opacity', 0);
            setTimeout(function () {
                e.remove();
            }, 0);
        });

        var voice = new Vex.Flow.Voice({
            num_beats: 4,
            beat_value: 4,
            resolution: Vex.Flow.RESOLUTION
        });

        voice.addTickables([getNote(Session.get('midi'), Session.get('note'))]);

        var formatter = new Vex.Flow.Formatter().
        joinVoices([voice]).format([voice], 100);
        if (Session.get('midi') >= 60) {
            voice.draw(ctx, treble);
        }
        else {
            voice.draw(ctx, bass);
        }
        $('.wrapper').find('*:not([data-base=true])').each(function() {
            var e = $(this);
            setTimeout(function() {
                e.css('opacity', getOpacity());
            }, 0);
        });
    });

    this.autorun(function() {
        Session.get('detune');
        Session.get('correlation');
        $('.wrapper').find('*:not([data-base=true])').css('opacity', getOpacity());
    });
}
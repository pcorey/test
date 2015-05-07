Template.body.helpers({
    note: function() {
        var note = Session.get('note');
        return note ? note : '';
    },
    width: function() {
        if (!Session.get('stats')) {
            return 0;
        }
        return (Session.get('stats').frequency || 0) / 20;
    },
    detune: function() {
        return Session.get('detune');
    },
    correlation: function() {
        return Session.get('correlation');
    },
    test: function() {
        // var ret = navigator ? (navigator.toString()) : '';
        // ret += (navigator.getUserMedia) ? (navigator.getUserMedia.toString()) : '';
        // try {
        //     ret += getUserMedia.toString();
        // } catch(e) {
        //     ret += 'null';
        // }
        // return ret;
        return AudioContext.toString();
    }
})

Meteor.startup(function() {
    Session.setDefault('stats', {});
    Session.setDefault('note', null);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var detector = new PitchDetector({
        // Audio Context (Required)
        context: new AudioContext(),

        // Input AudioNode (Required)
        //input: audioContext.createBufferSource(), // default: Microphone input

        // Output AudioNode (Optional)
        //output: AudioNode, // default: no output

        // interpolate frequency (Optional)
        //
        // Auto-correlation is calculated for different (discrete) signal periods
        // The true frequency is often in-beween two periods.
        //
        // We can interpolate (very hacky) by looking at neighbours of the best 
        // auto-correlation period and shifting the frequency a bit towards the
        // highest neighbour.
        interpolateFrequency: true, // default: true

        // Callback on pitch detection (Optional)
        onDetect: function(stats, pitchDetector) { 
            Session.set('stats', stats);
            Session.set('note', pitchDetector.getNoteString());
            Session.set('midi', pitchDetector.getNoteNumber());
            Session.set('detune', pitchDetector.getDetune());
            Session.set('correlation', pitchDetector.getCorrelation());
            Session.set('correlationIncrease', pitchDetector.getCorrelationIncrease());
        },

        // Debug Callback for visualisation (Optional)
        onDebug: function(stats, pitchDetector) { },

        // Minimal signal strength (RMS, Optional)
        minRms: 0.05,

        // Detect pitch only with minimal correlation of: (Optional)
        minCorrelation: 0.95,

        // Detect pitch only if correlation increases with at least: (Optional)
        //minCorreationIncrease: 0.5,

        // Note: you cannot use minCorrelation and minCorreationIncrease
        // at the same time!

        // Signal Normalization (Optional)
        normalize: "rms", // or "peak". default: undefined

        // Only detect pitch once: (Optional)
        stopAfterDetection: false,

        // Buffer length (Optional)
        length: 2048, // default 1024

        // Limit range (Optional):
        // minNote: 21, // by MIDI note number
        // maxNote: 108, 

        // minFrequency: 1,    // by Frequency in Hz
        // maxFrequency: 5000,

        // minPeriod: 2,  // by period (i.e. actual distance of calculation in audio buffer)
        // maxPeriod: 512, // --> convert to frequency: frequency = sampleRate / period

        // Start right away
        start: true // default: false
    });

    //detector.start();
});
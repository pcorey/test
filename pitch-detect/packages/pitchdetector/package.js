Package.describe({
    name: 'pitchdetector'
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');
    api.addFiles('lib/pitchdetector.js', 'web');
    api.export('PitchDetector');
});

Cordova.depends({
    'org.chromium.audiocapture': '1.0.4'
});
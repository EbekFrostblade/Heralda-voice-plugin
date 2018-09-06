const fs = require('fs');
const tts = require('../lib/voice-rss-tts/index.js');

const VoiceQueue = require('./voiceQueue.js');
const ttsDirectory = "./tts";

class Voice {
    constructor(apiKey) {
        this.voiceQueue = new VoiceQueue();
        this.apiKey = apiKey;
    }

    announce(voiceChannel, message) {
        const fileName = message.replace(/[.,\\\/#!$%\^&\*;:{}=\-_`~()?]/g,"").split(" ").join("_").toLowerCase() + ".mp3";

        readyAnnouncementFile(message, fileName, this.apiKey, (err, filePath) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log('queueing message: ' + message);
            this.voiceQueue.queueAudioForChannel(filePath, voiceChannel);
        });
    }
}

module.exports = Voice;

function writeNewSoundFile(filePath, content, callback) {
    fs.mkdir(ttsDirectory, (err) => fs.writeFile(filePath, content, (err) => callback(err)));
}

function callVoiceRssApi(message, filePath, apiKey, callback) {
    console.log("Making API call");
    tts.speech({
        key: apiKey,
        hl: 'en-gb',
        src: message,
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false,
        b64: false,
        callback: (err, content) => {
            if (err) {
                callback(err);
            }
            writeNewSoundFile(filePath, content, (err) => {
                callback(err);
            });
        }
    });
};

function readyAnnouncementFile(message, fileName, apiKey, callback) {
    const filePath = ttsDirectory + "/" + fileName;

    fs.stat(filePath, (err) => {
        if (err && err.code == 'ENOENT') {
            callVoiceRssApi(message, filePath, apiKey, (err) => callback(err, filePath));
            return;
        }

        callback(err, filePath);
    });
}

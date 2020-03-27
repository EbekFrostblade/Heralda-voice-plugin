const fs = require('fs');

if (useGoogleTTS){
	const tts = require('../lib/google-tts/index.js');
else
	const tts = require('../lib/voice-rss-tts/index.js');

const VoiceQueue = require('./voiceQueue.js');
const ttsDirectory = "./tts";

class Voice {
    constructor(config) {
        this.voiceQueue = new VoiceQueue();
        this.config = config;
    }

    announce(voiceChannel, message) {
        const fileName = message.replace(/[.,\\\/#!$%\^&\*;:{}=\-_`~()?]/g,"").split(" ").join("_").toLowerCase() + ".mp3";

        readyAnnouncementFile(message, fileName, this.config, (err, filePath) => {
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

function writeNewSoundFile(filePath, content, params, callback) {
	if (params.useGoogleTTS)
		fs.mkdir(ttsDirectory, (err) => fs.writeFile(filePath, content.audioContent, 'binary', (err) => callback(err)));
	else
		fs.mkdir(ttsDirectory, (err) => fs.writeFile(filePath, content, (err) => callback(err)));
}

function callVoiceRssApi(message, filePath, config, callback) {
    console.log("Making API call");
    let params = config;
    params.message = message;
    params.callback = (err, content) => {
        if (err) {
            callback(err);
        }
        writeNewSoundFile(filePath, content, params, (err) => {
            callback(err);
        });
    }
    tts.speech(params);
};

function readyAnnouncementFile(message, fileName, config, callback) {
    const filePath = ttsDirectory + "/" + fileName;

    fs.stat(filePath, (err) => {
        if (err && err.code == 'ENOENT') {
            callVoiceRssApi(message, filePath, config, (err) => callback(err, filePath));
            return;
        }

        callback(err, filePath);
    });
}

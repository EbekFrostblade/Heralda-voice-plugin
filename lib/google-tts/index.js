'use strict';

module.exports = {
    speech: speech
};

function speech(settings) {
    _validate(settings);
    _request(settings);
}

function _validate(settings) {
    if (settings && settings.callback) {
        if (!settings.GapiKeypath) settings.callback('The API key is undefined', null);
        if (!settings.message) settings.callback('The text is undefined', null);
        if (!settings.glanguage) settings.callback('The language is undefined', null);
		
    }
    else
        throw new Error('The settings are undefined');
}

function _request(settings) {
    var req = _buildRequest(settings);
    var request = require("request");

    request({
        url: 'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + settings.GAPIkey,
        headers: { 'Content-Type: application/json; charset=utf-8' },
        method: "POST",
        data: req,
        encoding: null
    }, function (error, response, body) {
		console.log(error);
        if (!error && response.statusCode == 200) {
			console.log(response);
            if (settings.callback) {
                if (error)
                    settings.callback(error, null);
                else if (body.indexOf('ERROR') == 0)
                    settings.callback(body, null);
                else
                    settings.callback(null, body);
            }
        }
    });
}

function _buildRequest(settings) {
    return {
		input: {
			text: settings.message,
		},
		voice: {
			languageCode: settings.GLanguage,
			name: settings.GVoiceName,
			ssmlGender: settings.GssmlGender
			},
		audioConfig: {
			audioEncoding: "MP3",
			speakingRate: settings.GSpeakingRate,
			pitch: settings.GVoicePitch
		}
    };
}

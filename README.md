# Heralda, the helpful Discord Herald Bot

[Heralda](https://github.com/EbekFrostblade/Heralda-chat-bot) is a chat bot that announces the arrival of new users to voice channels in Discord. She uses voicerss.org to retrieve text-to-speech voice clips, which she then plays in the voice channel.

## This Component

This is Heralda's main voice plugin. It can serve as an example to create your plugins to tie into her API.

## Configuration

You can configure the voice plugin by changings your `_config.json` file in your Heralda root directory:

```json
{
  "token": [DISCORD TOKEN],
  "plugins": {
    "heralda-voice-plugin": {
      "commands": {
        ...
      },
      "messages": {
        ...
      },
      "voice": {
        "apiKey": [VOICE-RSS KEY - required],
        ...
      }
    }
  }
}

```

The only required keys is the `voice.apiKey`. Everything else inherits from the default values.

### Commands

#### summon

This summons Heralda to your current connected voice channel. You must send her a message in a public room in the same server you and her are connected to, and you must @mention her.

The default commands are `get in here` and `you've been summoned`.

#### dismiss

This asks Heralda to leave the voice channel she is in. As with summoning her, you must send this message in a public channel for the server she is connected to, and you must @mention her.

The default commands are `get out of here` and `dismissed`.

### Messages

#### summoned

The text Heralda speaks when she enters a voice channel.

#### memberConnected

The templated string for the text Heralda speaks when a user connects to her voice channel. You can use the template `{name}`, and she will insert that user's nickname into the text (or username if they have no nickname).

#### memberDisconnected

The templates string for when the user leaves Heralda's voice channel. Like with memberConnected, you can pass `{name}` to have her insert the user's nickname/username into the line.

### errors

These are not spoken, but instead typed into the chat channel where the command was issued in response to requests.

#### memberNotInAVoiceChannel

What Heralda replies with when the user is not in a voice channel.

#### alreadyInMemberschannel

What Heralda replies when she is already in the summoning user's voice channel.

### Voice

These values all map to request variables for the voice-rss API. For more information, you can check out their [documentation](http://www.voicerss.org/api/documentation.aspx).

#### apiKey - required

This is your voice-rss key. Keep this secret!

#### language

The voice you wish to use, based on language. For language values, check the documentation link above.

#### speakingSpeed

The speed (rate) at which you want Heralda to speak her lines. The values range from -10 (slowest) to 10 (fastest).

#### codec

The speech audio codec. Check the documentation for accepted values.

#### format

Format for the audio transmitted. Once again, check out their documentation.

#### ssml

The SSML textual content format. Can be true or false.

#### base64

If you would like the output to be a Base64 string, which according to their documentation is used for browser playback. Not supported by this plugin, but I still expose the option to change this value if you wish.

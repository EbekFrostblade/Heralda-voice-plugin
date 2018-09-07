const Discord = require('discord.js');
const HeraldaPlugin = require('heralda-plugin-base');

const Voice = require("./classes/voice.js");
const defaultConfig = require('./config.json');

class VoicePlugin extends HeraldaPlugin {
  init(client, config) {
    this.voice = new Voice(config.voiceApiKey);
    this.config = HeraldaPlugin.mergeConfigs(config, defaultConfig);

    this._listenForSummons();
    this._listenForVoiceStatusChanges();
  }

  _listenForSummons() {
    this.responder.addListener({
      messages: this.config.commands.summon,
      privateAllowed: true,
      callback: this._summonedToChat.bind(this)
    });

    this.responder.addListener({
      messages: this.config.commands.dismiss,
      privateAllowed: false,
      callback: this._leaveChat.bind(this)
    });
  }

  _listenForVoiceStatusChanges() {
    this.client.on('voiceStateUpdate', (oldState, newState) => {
      const guildConnection = this.client.voiceConnections.get(newState.guild.id);

      if (newState.user.id == this.client.user.id || !guildConnection) {
          return;
      }

      if (newState.voiceChannel && newState.voiceChannel.id === guildConnection.channel.id) {
          this._announceUserArrival(newState, guildConnection.channel);
      }
      else if (oldState.voiceChannel.id === guildConnection.channel.id) {
          this._announceUserExit(oldState, guildConnection.channel);
      }
    });
  }

  _summonedToChat(message) {
    if (!message.guild || !message.member || message.author.id === this.client.user.id) {
      return;
    }

    const voiceChannel = message.member.voiceChannel;

    if (!voiceChannel) {
      message.reply(this.config.messages.errors.memberNotInAVoiceChannel);
    }

    if (voiceChannel.connection && voiceChannel.connection.status === Discord.Constants.VoiceStatus.CONNECTED) {
      message.reply(this.config.messages.errors.alreadyInMembersChannel);
      return;
    }

    voiceChannel.join().then((voiceInfo, err) => {
      const message = this.config.messages.summoned;

      if (err) {
        console.log(err);
        return;
      }

      this.voice.announce(voiceChannel, message);
    });
  }

  _leaveChat(message) {
    const voiceChannel = message.member.voiceChannel;

    if (voiceChannel.connection && voiceChannel.connection.status === Discord.Constants.VoiceStatus.CONNECTED) {
        voiceChannel.leave();
    }
  }

  _announceUserArrival(guildMember, voiceChannel) {
    let name = (guildMember.nickname || guildMember.user.username);
    const message = this.config.messages.memberConnected;
    this.voice.announce(voiceChannel, message);
  }

  _announceUserExit(guildMember, voiceChannel) {
    let name = (guildMember.nickname || guildMember.user.username);
    const message = this.config.messages.memberDisconnected;
    this.voice.announce(voiceChannel, message);
  }
}

module.exports = VoicePlugin;

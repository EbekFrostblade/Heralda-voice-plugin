const Discord = require('discord.js');
const format = require('string-template');
const HeraldaPlugin = require('heralda-plugin-base');

const Voice = require("./classes/voice.js");
const defaultConfig = require('./config.json');

class VoicePlugin extends HeraldaPlugin {
  init(client, config) {
    this.config = HeraldaPlugin.mergeConfigs(config, defaultConfig);
    this.voice = new Voice(this.config.voice);

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
      let message = null;

      if (newState.user.id == this.client.user.id || !guildConnection) {
        return;
      }

      if (newState && newState.voiceChannel && oldState && oldState.voiceChannel) {
        if (newState.voiceChannel.id == oldState.voiceChannel.id) {
          return;
        } 
      }

      if (newState.voiceChannel && newState.voiceChannel.id === guildConnection.channel.id) {
        message = this._announceUser(newState, this.config.messages.memberConnected);
      }
      else if (oldState.voiceChannel.id === guildConnection.channel.id) {
        message = this._announceUser(oldState, this.config.messages.memberDisconnected);
      }

      if (message) {
        this.voice.announce(guildConnection.channel, message); 
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

  _announceUser(guildMember, message) {
    return format(message, { name: (guildMember.nickname || guildMember.user.username) });
  }
}

module.exports = VoicePlugin;

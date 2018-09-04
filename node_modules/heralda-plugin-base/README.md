# Heralda, the helpful Discord Herald Bot

Heralda is a chat bot that announces the arrival of new users to voice channels in Discord. She uses voicerss.org to retrieve text-to-speech voice clips, which she then plays in the voice channel.

## This Component

This is the basis for one of Heralda's plugins, which is what gives her the basic functions she can perform. Extending this class, you can easily create your own packages, and use NPM to install them. Heralda will automatically detect any installed packages, and attempt to initialize them upon a successful login.

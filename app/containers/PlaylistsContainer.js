import Axios from 'axios';
import React, { Component } from 'react';
import Playlists from '../components/Playlists';
import Sound from 'react-sound';

const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
const globals = require('../api/Globals');
const ytdl = require('ytdl-core');
const youtube = require('../api/Youtube');


export default class PlaylistsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: []
    };
  }

  componentWillMount() {
    fs.readdir(
      path.join(
        globals.directories.userdata,
        globals.directories.playlists
      ),
      (err, items) => {
        items.map((item, i) => {
          var contents = jsonfile.readFileSync(
            path.join(
              globals.directories.userdata,
              globals.directories.playlists,
              item
            )
          );
          this.state.playlists.push({filename: item, contents: contents});
          this.setState(this.state);
        });
      }
    );
  }

  playlistPlayCallback(playlist, event, value) {
    this.props.home.setState({
      platStatus: Sound.status.STOPPED,
      songQueue: [],
      currentSongNumber: 0,
      currentSongPosition: 0,
      seekFromPosition: 0,
      songStreamLoading: false
    });

    this.props.home.showAlertSuccess("Playing playlist "+playlist.filename+".");

    this.props.home.state.songQueue.length = 0;
    playlist.contents.tracks.map((el, i) => {
      youtube.youtubeFetchVideoDetails(el);
      this.props.home.addToQueue(el, this.props.home.videoInfoCallback, null);
    });

    this.props.home.changeSong(0);
    this.props.home.togglePlay();
  }

  playlistAddToQueueCallback(playlist, event, value) {
    this.props.home.showAlertSuccess("Playlist "+playlist.contents.name+" added to queue.");

    playlist.contents.tracks.map((el, i) => {
      youtube.youtubeFetchVideoDetails(el);
      this.props.home.addToQueue(el, this.props.home.videoInfoCallback, null);
    });
  }

  playlistRenameCallback(playlist, event, value) {
    console.log(playlist);
  }

  playlistDeleteCallback(playlist, event, value) {
    console.log(playlist);
  }

  render() {
    return(
      <Playlists
        playlists={this.state.playlists}
        playlistPlayCallback={this.playlistPlayCallback.bind(this)}
        playlistAddToQueueCallback={this.playlistAddToQueueCallback.bind(this)}
        playlistRenameCallback={this.playlistRenameCallback.bind(this)}
        playlistDeleteCallback={this.playlistDeleteCallback.bind(this)}
      />
    );
  }
}

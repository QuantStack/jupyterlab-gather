import {
  HMSPeer,
  selectIsConnectedToRoom,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectIsLocalVideoPluginPresent,
  selectLocalPeer,
  selectLocalPeerID,
  selectPeers
} from '@100mslive/hms-video-store';
import { ISignal, Signal } from '@lumino/signaling';
import ArCubePlugin from './arCubePlugin';
import { hmsActions, hmsStore } from './hms';

class VideoPresentation {
  constructor(node: HTMLElement) {
    this.node = node;

    // Initialize HMS Store
    hmsActions.initAppData(this.initAppData);

    this.peerCount = 0;
    this.isPluginLoaded = false;
    this.arPlugin = new ArCubePlugin();
    this._pluginStateChanged = new Signal<this, void>(this);

    this.buildHtml(node);

    this.pluginStateChanged.connect(this.onPluginStateChange.bind(this));

    // this.initialize();
  }

  node: HTMLElement;
  form: any;
  joinBtn: any;
  conference: any;
  arContainer: any;
  peersContainer: any;
  leaveBtn: any;
  activateArBtn: any;
  muteAudio: any;
  muteVideo: any;
  controls: any;
  peerCount: number;
  arPlugin: ArCubePlugin;
  isPluginLoaded: boolean;
  _pluginStateChanged;
  localId: string;
  arPresentationTile: any;
  arPresentationVideo: any;

  get pluginStateChanged(): ISignal<this, void> {
    return this._pluginStateChanged;
  }

  initAppData() {
    const initialAppData = {
      node: null
    };
  }

  pluginButton(plugin: any, name: string) {
    const togglePluginState = async () => {
      if (!this.isPluginLoaded) {
        setTimeout(async () => {
          console.log('wait');
          console.log('adding');
          await hmsActions.addPluginToVideoTrack(plugin);
          this._pluginStateChanged.emit();
        }, 2000);
      } else {
        console.log('removing');
        await hmsActions.removePluginFromVideoTrack(plugin);
      }
    };

    // Create leave button element
    const pluginButton = document.createElement('button');
    pluginButton.id = 'activate-ar-btn';
    pluginButton.classList.add('btn-primary');
    pluginButton.textContent = `${this.isPluginLoaded ? 'Remove' : 'Add'} ${name}`;
    pluginButton.onclick = togglePluginState;

    return pluginButton;
  }

  initialize() {
    hmsActions.setAppData('node', this.node);

    // Joining the room
    this.joinBtn.onclick = async () => {
      console.log('Clicking join');
      const userName = (this.node.querySelector('#name') as HTMLInputElement)
        .value;
      const roomCode = (
        this.node.querySelector('#room-code') as HTMLInputElement
      ).value;
      // use room code to fetch auth token
      const authToken = await hmsActions.getAuthTokenByRoomCode({
        roomCode
      });
      // join room using username and auth token
      hmsActions.join({
        userName,
        authToken
      });
    };

    // Cleanup if user refreshes the tab or navigates away
    window.onunload = window.onbeforeunload = this.leaveRoom.bind(this);
    this.leaveBtn.onclick = this.leaveRoom.bind(this);

    // Reactive state - renderPeers is called whenever there is a change in the peer-list
    hmsStore.subscribe(this.renderPeers.bind(this), selectPeers);

    // Mute and unmute audio
    this.muteAudio.onclick = () => {
      const audioEnabled = !hmsStore.getState(selectIsLocalAudioEnabled);
      hmsActions.setLocalAudioEnabled(audioEnabled);
      this.muteAudio.textContent = audioEnabled ? 'Mute' : 'Unmute';
    };

    // Mute and unmute video
    this.muteVideo.onclick = () => {
      console.log('Clicking mute');
      const videoEnabled = !hmsStore.getState(selectIsLocalVideoEnabled);
      hmsActions.setLocalVideoEnabled(videoEnabled);
      this.muteVideo.textContent = videoEnabled ? 'Hide' : 'Unhide';
      // Re-render video tile
      this.renderPeers();
    };

    // Listen to the connection state
    hmsStore.subscribe(this.onConnection.bind(this), selectIsConnectedToRoom);

    // Listen to plugin state
    hmsStore.subscribe(
      this.updatePluginState.bind(this),
      selectIsLocalVideoPluginPresent(this.arPlugin.getName())
    );
  }

  async leaveRoom() {
    console.log('leaving room');
    await hmsActions.leave();
    this.peersContainer.innerHTML = '';
  }

  // Helper function to create html elements
  createElementWithClass(tag: any, className: any) {
    const newElement = document.createElement(tag);
    newElement.className = className;
    return newElement;
  }

  // Render a single peer
  renderPeer(peer: HMSPeer, type: string) {
    console.log('render peer');
    this.peerCount++;
    type = 'ar';
    const peerTileDiv = this.createElementWithClass('div', `${type}-tile`);
    const videoElement = this.createElementWithClass('video', `${type}-video`);
    const peerTileName = this.createElementWithClass('span', `${type}-name`);
    // if (type === 'ar') {
    //   const peerCanvas = this.createElementWithClass('canvas', 'peer-canvas');
    //   peerCanvas.id = 'target';
    //   peerTileDiv.append(peerCanvas);
    // }
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsinline = true;
    videoElement.id = `peer-video-${this.peerCount}`;
    peerTileName.textContent = peer.name;
    if (peer.videoTrack) {
      hmsActions.attachVideo(peer.videoTrack, videoElement);
    }
    peerTileDiv.append(videoElement);
    peerTileDiv.append(peerTileName);
    return peerTileDiv;
  }

  // Display a tile for each peer in the peer list
  renderPeers() {
    console.log('rendering peers');
    this.peersContainer.innerHTML = '';
    const peers = hmsStore.getState(selectPeers);

    peers.forEach(peer => {
      if (peer.videoTrack && peer.id !== this.localId) {
        console.log('is this happening');
        this.peersContainer.append(this.renderPeer(peer, 'peer'));
        // this.peersContainer.append(this.renderPeer(peer, 'peer'));
        // this.peersContainer.append(this.renderPeer(peer, 'peer'));
        // this.peersContainer.append(this.renderPeer(peer, 'peer'));
        // this.peersContainer.append(this.renderPeer(peer, 'peer'));
      }
    });
  }

  // Showing the required elements on connection/disconnection
  onConnection(isConnected: any, prevConnected: any) {
    console.log('on connection');
    if (isConnected) {
      this.localId = hmsStore.getState(selectLocalPeerID);

      console.log('this.localId', this.localId);
      this.form.classList.add('hide');
      this.conference.classList.remove('hide');
      // this.leaveBtn.classList.remove('hide');
      // this.grayScaleBtn.classList.remove('hide');
      this.controls.classList.remove('hide');
      this.peersContainer.classList.remove('hide');
      // default view
      this.peersContainer.classList.add('peers-container-main');

      // TODO: These 2 are just for testing
      // this.peersContainer.classList.add('peers-container-sidebar');
      // this.arContainer.classList.remove('hide');
    } else {
      // Not connected to room, showing login form
      this.form.classList.remove('hide');
      this.conference.classList.add('hide');
      // this.leaveBtn.classList.add('hide');
      // this.grayScaleBtn.classList.add('hide');
      this.controls.classList.add('hide');
      this.peersContainer.classList.add('hide');
      this.arContainer.classList.add('hide');
    }
  }

  onPluginStateChange() {
    console.log('signal junk');
    console.log('this.isPluginLoaded', this.isPluginLoaded);
    if (this.isPluginLoaded) {
      console.log('plugin loaded');
      const localPeer = hmsStore.getState(selectLocalPeer);
      // show the big img stuff
      console.log('localPeer', localPeer);
      this.arContainer.classList.remove('hide');
      this.peersContainer.classList.remove('peers-container-main');
      this.peersContainer.classList.add('peers-container-sidebar');
      if (localPeer?.videoTrack) {
        console.log('WIPPLE');
        if (localPeer.videoTrack) {
          console.log('this.arPresentationVideo', this.arPresentationVideo);
          hmsActions.attachVideo(
            localPeer.videoTrack,
            this.arPresentationVideo
          );
        }
      }
    } else {
      // show the grid shit
      this.arContainer.classList.add('hide');
      this.peersContainer.classList.remove('peers-container-sidebar');
      this.peersContainer.classList.add('peers-container-main');
    }
  }

  updatePluginState(newState: any, prevState: any) {
    this.isPluginLoaded = newState;
  }

  buildHtml(node: HTMLElement) {
    const container = document.createElement('div');
    container.classList.add('main-container');

    // Create header element
    // const header = document.createElement('header');
    // header.textContent = 'PlaceHolder';

    // Append header to the body or any other parent element
    // container.appendChild(header);

    // Append form to the body or any other parent element
    const form = this.buildForm();
    container.appendChild(form);

    // Create div element for the conference section
    const conferenceDiv = document.createElement('div');
    conferenceDiv.id = 'conference';
    conferenceDiv.classList.add('conference-section', 'hide');

    // Create h2 element for the conference section heading
    // const conferenceHeading = document.createElement('h2');
    // conferenceHeading.textContent = 'Conference';

    // Create the AR container div
    const arContainer = document.createElement('div');
    arContainer.id = 'ar-container';

    const arPresentationTile = this.buildArPresentation();
    arContainer.appendChild(arPresentationTile);

    // Create div element for the peers container
    const peersContainerDiv = document.createElement('div');
    peersContainerDiv.id = 'peers-container';

    // Append the conference heading and peers container to the conference section div
    // conferenceDiv.appendChild(conferenceHeading);
    conferenceDiv.appendChild(arContainer);
    conferenceDiv.appendChild(peersContainerDiv);

    // Append the conference section div to the body or any other parent element
    container.appendChild(conferenceDiv);

    // Append the controls section div to the body or any other parent element
    const controlsDiv = this.buildControlsBar();
    container.appendChild(controlsDiv);

    node.appendChild(container);

    setTimeout(() => {
      // HTML elements
      this.form = document.getElementById('join');
      this.joinBtn = document.getElementById('join-btn');
      this.conference = document.getElementById('conference');
      this.peersContainer = document.getElementById('peers-container');
      this.arContainer = document.getElementById('ar-container');
      this.leaveBtn = document.getElementById('leave-btn');
      this.activateArBtn = document.getElementById('activate-ar-btn');
      this.muteAudio = document.getElementById('mute-aud');
      this.muteVideo = document.getElementById('mute-vid');
      this.controls = document.getElementById('controls');
      this.arPresentationTile = document.getElementById('ar-tile');
      this.arPresentationVideo = document.getElementById('ar-video');
      console.log('this.arPresentationVideo', this.arPresentationVideo);

      this.initialize();
    }, 0);
  }

  buildForm() {
    // Create form element
    const form = document.createElement('form');
    form.id = 'join';

    // Create h2 element
    const heading = document.createElement('h2');
    heading.textContent = 'Join Room';

    // Create div for input container 1
    const inputContainer1 = document.createElement('div');
    inputContainer1.classList.add('input-container');

    // Create input element for name
    const nameInput = document.createElement('input');
    nameInput.id = 'name';
    nameInput.type = 'text';
    nameInput.name = 'username';
    nameInput.placeholder = 'Your name';
    nameInput.value = 'we';

    // Append name input to input container 1
    inputContainer1.appendChild(nameInput);

    // Create div for input container 2
    const inputContainer2 = document.createElement('div');
    inputContainer2.classList.add('input-container');

    // Create input element for room code
    const roomCodeInput = document.createElement('input');
    roomCodeInput.id = 'room-code';
    roomCodeInput.type = 'text';
    roomCodeInput.name = 'roomCode';
    roomCodeInput.placeholder = 'Room code';

    // Append room code input to input container 2
    inputContainer2.appendChild(roomCodeInput);

    // Create button element
    const joinButton = document.createElement('button');
    joinButton.type = 'button';
    joinButton.id = 'join-btn';
    joinButton.classList.add('btn-primary');
    joinButton.textContent = 'Join';

    // Append all elements to the form
    form.appendChild(heading);
    form.appendChild(inputContainer1);
    form.appendChild(inputContainer2);
    form.appendChild(joinButton);

    return form;
  }

  buildControlsBar() {
    // Create div element for the controls section
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'controls';
    controlsDiv.classList.add('control-bar', 'hide');

    // Create button element for muting audio
    const muteAudioButton = document.createElement('button');
    muteAudioButton.id = 'mute-aud';
    muteAudioButton.classList.add('btn-control');
    muteAudioButton.textContent = 'Mute';

    // Create button element for muting video
    const muteVideoButton = document.createElement('button');
    muteVideoButton.id = 'mute-vid';
    muteVideoButton.classList.add('btn-control');
    muteVideoButton.textContent = 'Hide';

    // Create leave button element
    const leaveButton = document.createElement('button');
    leaveButton.id = 'leave-btn';
    leaveButton.classList.add('btn-danger');
    leaveButton.textContent = 'Leave Room';

    // Create Ar button element
    const arButton = this.pluginButton(this.arPlugin, 'AR Junk');

    // Append the buttons to the controls section div
    controlsDiv.appendChild(muteAudioButton);
    controlsDiv.appendChild(muteVideoButton);
    controlsDiv.appendChild(leaveButton);
    controlsDiv.appendChild(arButton);

    return controlsDiv;
  }

  buildArPresentation() {
    const arPresentationTileDiv = this.createElementWithClass('div', 'ar-tile');
    const videoElement = this.createElementWithClass('video', 'ar-video');
    const peerTileName = this.createElementWithClass('span', 'ar-name');
    const peerCanvas = this.createElementWithClass('canvas', 'ar-canvas');
    videoElement.classList.add('local.peer-video');
    arPresentationTileDiv.id = 'ar-tile';
    videoElement.id = 'ar-video';
    peerCanvas.id = 'target';
    arPresentationTileDiv.append(peerCanvas);
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsinline = true;

    arPresentationTileDiv.append(videoElement);
    arPresentationTileDiv.append(peerTileName);
    return arPresentationTileDiv;
  }
}

export default VideoPresentation;

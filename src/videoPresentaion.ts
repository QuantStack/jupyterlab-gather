import {
  HMSPeer,
  selectAppData,
  selectIsConnectedToRoom,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectIsLocalVideoPluginPresent,
  selectPeers
} from '@100mslive/hms-video-store';
import { ISignal, Signal } from '@lumino/signaling';
import ArCubePlugin from './arCubePlugin';
import { hmsActions, hmsStore } from './hms';

class VideoPresentation {
  constructor(node: HTMLElement) {
    console.log('constructor');
    this.node = node;

    // Initialize HMS Store
    hmsActions.initAppData(this.initAppData);

    this.peerCount = 0;
    this.isPluginLoaded = false;
    this.grayScalePlugin = new ArCubePlugin();
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
  grayScaleBtn: any;
  muteAudio: any;
  muteVideo: any;
  controls: any;
  peerCount: number;
  grayScalePlugin: ArCubePlugin;
  isPluginLoaded: boolean;
  _pluginStateChanged;

  get pluginStateChanged(): ISignal<this, void> {
    return this._pluginStateChanged;
  }

  onPluginStateChange() {
    console.log('signal junk');
    if (this.isPluginLoaded) {
      // show the big img stuff
      this.arContainer.classList.remove('hide');
      this.peersContainer.classList.remove('peers-container-main');
      this.peersContainer.classList.add('peers-container-sidebar');
    } else {
      // show the grid shit
      this.arContainer.classList.add('hide');
      this.peersContainer.classList.remove('peers-container-sidebar');
      this.peersContainer.classList.add('peers-container-main');
    }
  }

  initAppData() {
    const initialAppData = {
      node: null
    };
  }

  pluginButton(plugin: any, name: string) {
    const togglePluginState = async () => {
      if (!this.isPluginLoaded) {
        console.log('adding');
        await hmsActions.addPluginToVideoTrack(plugin);
      } else {
        console.log('removing');
        await hmsActions.removePluginFromVideoTrack(plugin);
      }
      this._pluginStateChanged.emit();
    };

    // Create leave button element
    const pluginButton = document.createElement('button');
    pluginButton.id = 'grayscale-btn';
    pluginButton.classList.add('btn-primary', 'hide');
    pluginButton.textContent = `${this.isPluginLoaded ? 'Remove' : 'Add'} ${name}`;
    pluginButton.onclick = togglePluginState;

    return pluginButton;
  }

  initialize() {
    hmsActions.setAppData('node', this.node);
    console.log('banana video node', hmsStore.getState(selectAppData('node')));
    console.log('banana this.node', this.node);

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
      selectIsLocalVideoPluginPresent(this.grayScalePlugin.getName())
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
  renderPeer(peer: HMSPeer) {
    this.peerCount++;
    const peerTileDiv = this.createElementWithClass('div', 'peer-tile');
    const videoElement = this.createElementWithClass('video', 'peer-video');
    const peerTileName = this.createElementWithClass('span', 'peer-name');
    const peerCanvas = this.createElementWithClass('canvas', 'peer-canvas');
    peerCanvas.id = 'target';
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
    peerTileDiv.append(peerCanvas);
    return peerTileDiv;
  }

  // Display a tile for each peer in the peer list
  renderPeers() {
    console.log('rendering peers');
    this.peersContainer.innerHTML = '';
    const peers = hmsStore.getState(selectPeers);
    console.log('peers', peers);

    peers.forEach(peer => {
      if (peer.videoTrack) {
        this.peersContainer.append(this.renderPeer(peer));
        // this.peersContainer.append(this.renderPeer(peer));
        // this.peersContainer.append(this.renderPeer(peer));
        // this.peersContainer.append(this.renderPeer(peer));
        // this.peersContainer.append(this.renderPeer(peer));
      }
    });
  }

  // Showing the required elements on connection/disconnection
  onConnection(isConnected: any, prevConnected: any) {
    if (isConnected) {
      this.form.classList.add('hide');
      this.conference.classList.remove('hide');
      this.leaveBtn.classList.remove('hide');
      this.grayScaleBtn.classList.remove('hide');
      this.controls.classList.remove('hide');
      this.peersContainer.classList.remove('hide');
      this.peersContainer.classList.add('peers-container-main');
    } else {
      this.form.classList.remove('hide');
      this.conference.classList.add('hide');
      this.leaveBtn.classList.add('hide');
      this.grayScaleBtn.classList.add('hide');
      this.controls.classList.add('hide');
      this.peersContainer.classList.add('hide');
      this.arContainer.classList.add('hide');
    }
  }

  updatePluginState(newState: any, prevState: any) {
    this.isPluginLoaded = newState;
  }

  buildHtml(node: HTMLElement) {
    const container = document.createElement('div');

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
      this.grayScaleBtn = document.getElementById('grayscale-btn');
      this.muteAudio = document.getElementById('mute-aud');
      this.muteVideo = document.getElementById('mute-vid');
      this.controls = document.getElementById('controls');

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
    leaveButton.classList.add('btn-danger', 'hide');
    leaveButton.textContent = 'Leave Room';

    // Create Ar button element
    const arButton = this.pluginButton(this.grayScalePlugin, 'AR Junk');

    // Append the buttons to the controls section div
    controlsDiv.appendChild(muteAudioButton);
    controlsDiv.appendChild(muteVideoButton);
    controlsDiv.appendChild(leaveButton);
    controlsDiv.appendChild(arButton);

    return controlsDiv;
  }
}

export default VideoPresentation;

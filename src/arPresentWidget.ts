import { ILayoutRestorer, JupyterFrontEnd } from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { Widget } from '@lumino/widgets';
import { SidebarWidget } from './Sidebar';
import ArCube from './arCube';
import VideoPresentation from './videoPresentaion';

class ArPresentWidget extends Widget {
  constructor() {
    super();
    // this.arCube = new ArCube(this.node);
    this.videoPresentation = new VideoPresentation(this.node);
  }

  // arCube: ArCube;
  videoPresentation: VideoPresentation;
}

export default function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  settingRegistry: ISettingRegistry | null,
  restorer: ILayoutRestorer | null
) {
  console.log('JupyterLab extension jupyterlab_arpresent is activated!');

  let widget: MainAreaWidget<ArPresentWidget>;
  const sidebarPanel = new SidebarWidget();
  sidebarPanel.id = 'test-panel';
  sidebarPanel.title.caption = 'Caption';

  // Add an application command
  const arPresentCommand: string = 'arpresent:open';
  app.commands.addCommand(arPresentCommand, {
    label: 'AR Presentation',
    execute: () => {
      // Regenerate the widget if disposed
      if (!widget || widget.isDisposed) {
        const content = new ArPresentWidget();
        widget = new MainAreaWidget({ content });
        widget.id = 'arpresent-jupyterlab';
        widget.title.label = 'AR Presentation';
        widget.title.closable = true;
      }
      // if (!tracker.has(widget)) {
      //   // Track the state of the widget for later restoration
      //   tracker.add(widget);
      // }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }

      // widget.content.arCube.animate();

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  const arStartCommand: string = 'arpresent:start';
  app.commands.addCommand(arStartCommand, {
    label: 'Start AR',
    execute: () => {
      const arCube = new ArCube(widget.node);
      arCube.animate();
      // arCube.attachToVideo();
    }
  });

  // Add the command to the palette.
  palette.addItem({ command: arPresentCommand, category: 'Tutorial' });
  palette.addItem({ command: arStartCommand, category: 'Tutorial' });

  app.shell.add(sidebarPanel, 'left', { rank: 2000 });
  // Track and restore the widget state
  // const tracker = new WidgetTracker<MainAreaWidget<ArPresent>>({
  //   namespace: 'arpresent'
  // });
  // if (restorer) {
  //   restorer.restore(tracker, {
  //     command,
  //     name: () => 'arpresent'
  //   });
  // }
}

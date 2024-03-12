import { ILayoutRestorer, JupyterFrontEnd } from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { Widget } from '@lumino/widgets';
import ArCube from './arCube';

class ArPresentWidget extends Widget {
  constructor() {
    super();
    this.arCube = new ArCube(this.node);
  }

  arCube: ArCube;
}

export default function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  settingRegistry: ISettingRegistry | null,
  restorer: ILayoutRestorer | null
) {
  console.log('JupyterLab extension jupyterlab_arpresent is activated!');

  let widget: MainAreaWidget<ArPresentWidget>;

  // Add an application command
  const command: string = 'arpresent:open';
  app.commands.addCommand(command, {
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

      widget.content.arCube.animate();
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });

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

import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { LogoIcon } from './components/Icons';
import { RootDisplayWidget } from './components/RootDisplay';
import { IArPresentInterface, IArPresentToken } from './tokens';
import { SidebarWidget } from './widgets/Sidebar';

export { IArPresentInterface, IArPresentToken } from './tokens';
/**
 * Activate the arpresent widget extension.
 */

/**
 * Initialization data for the jupyterlab_arpresent extension.
 */
const plugin: JupyterFrontEndPlugin<IArPresentInterface> = {
  id: 'jupyterlab_arpresent',
  description: 'Video presentation over WebRTC with AR capabilities.',
  autoStart: true,
  provides: IArPresentToken,
  requires: [ICommandPalette, ILauncher],
  optional: [ILayoutRestorer, ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null,
    settingRegistry: ISettingRegistry | null,
    restorer: ILayoutRestorer | null
  ): IArPresentInterface => {
    console.log('JupyterLab extension jupyterlab_arpresent is activated!');

    let widget: MainAreaWidget<RootDisplayWidget>;

    const sidebarPanel = new SidebarWidget();
    sidebarPanel.id = 'AR-sidepanel';

    // Add an application command
    const arPresentCommand: string = 'arpresent:open';
    app.commands.addCommand(arPresentCommand, {
      label: 'AR Presentation',
      icon: LogoIcon,
      execute: () => {
        // Regenerate the widget if disposed
        if (!widget || widget.isDisposed) {
          // const content = new ArPresentWidget();

          const content = new RootDisplayWidget();
          widget = new MainAreaWidget({ content });
          widget.id = 'arpresent-jupyterlab';
          widget.title.label = 'AR Presentation';
          widget.title.closable = true;
          widget.title.icon = LogoIcon;
        }
        // if (!tracker.has(widget)) {
        //   // Track the state of the widget for later restoration
        //   tracker.add(widget);
        // }
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'main');
        }

        // Activate the widget
        app.shell.activateById(widget.id);
        app.shell.add(widget, 'main');
        app.shell.add(sidebarPanel, 'left', { rank: 2000 });
      }
    });

    // Add the command to the palette.
    palette.addItem({ command: arPresentCommand, category: 'Video Chat' });

    if (launcher) {
      launcher.add({
        command: arPresentCommand,
        category: 'Video Chat',
        rank: 2
      });
    }
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

    return sidebarPanel;
  }
};

const duckPlugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_duck',
  description: 'a duck.',
  autoStart: true,
  requires: [ICommandPalette, IArPresentToken],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    arPresent: IArPresentInterface
  ) => {
    console.log('JupyterLab extension The Duck is activated!');

    const duckPluginCommand: string = 'duckPlugin:open';
    app.commands.addCommand(duckPluginCommand, {
      label: 'The Duck',
      execute: () => {
        arPresent.foo(
          'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Suzanne/glTF/Suzanne.gltf'
        );
      }
    });

    palette.addItem({ command: duckPluginCommand, category: 'Video Chat' });
  }
};

export default [plugin, duckPlugin];

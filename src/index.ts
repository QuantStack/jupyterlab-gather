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
import { IGatherRegistryToken, IModelRegistry, ModelManager } from './registry';
import { LeftSidebarWidget } from './widgets/LeftSidebar';
import { RightSidebarWidget } from './widgets/RightSidebar';
export { IGatherRegistryToken, IModelRegistry };

/**
 * Initialization data for the jupyterlab_gather extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_gather',
  description: 'Video presentation over WebRTC with AR capabilities.',
  autoStart: true,
  requires: [ICommandPalette, ILauncher, IGatherRegistryToken],
  optional: [ILayoutRestorer, ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null,
    registry: IModelRegistry,
    settingRegistry: ISettingRegistry | null,
    restorer: ILayoutRestorer | null
  ) => {
    console.log('JupyterLab extension jupyterlab_gather is activated!');

    let widget: MainAreaWidget<RootDisplayWidget>;

    // Add an application command
    const gatherCommand: string = 'gather:open';
    app.commands.addCommand(gatherCommand, {
      label: 'Start Gather',
      icon: LogoIcon,
      execute: () => {
        // Regenerate the widget if disposed
        if (!widget || widget.isDisposed) {
          const content = new RootDisplayWidget(registry.modelRegistryChanged);
          widget = new MainAreaWidget({ content });
          widget.id = 'gather-jupyterlab';
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

        const leftSidebarPanel = new LeftSidebarWidget(
          registry.modelRegistryChanged
        );
        leftSidebarPanel.id = 'gather-leftSidePanel';

        const rightSidebarPanel = new RightSidebarWidget();
        rightSidebarPanel.id = 'gather-rightSidePanel';

        // Activate the widget
        app.shell.activateById(widget.id);
        app.shell.add(widget, 'main');
        app.shell.add(leftSidebarPanel, 'left', { rank: 2000 });
        app.shell.add(rightSidebarPanel, 'right', { rank: 2000 });

        // Register default models
        registry.registerModel({
          name: 'duck',
          url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Duck/glTF/Duck.gltf'
        });

        registry.registerModel({
          name: 'brain stem',
          url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/BrainStem/glTF/BrainStem.gltf'
        });
      }
    });

    // Add the command to the palette.
    palette.addItem({ command: gatherCommand, category: 'Video Chat' });

    if (launcher) {
      launcher.add({
        command: gatherCommand,
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
  }
};

const modelRegistryPlugin: JupyterFrontEndPlugin<IModelRegistry> = {
  id: 'jupyterlab_gather:registry',
  description: 'Registry of available models to display in ar present',
  autoStart: true,
  requires: [],
  provides: IGatherRegistryToken,
  activate: () => {
    const modelRegistryManager = new ModelManager();

    return modelRegistryManager;
  }
};

// const duckPlugin: JupyterFrontEndPlugin<void> = {
//   id: 'jupyterlab_duck',
//   description: 'a duck.',
//   autoStart: true,
//   requires: [ICommandPalette, IGatherRegistryToken],
//   activate: (
//     app: JupyterFrontEnd,
//     palette: ICommandPalette,
//     registry: IModelRegistry
//   ) => {
//     console.log('JupyterLab extension The Duck is activated!');

//     const duckPluginCommand: string = 'duckPlugin:open';
//     app.commands.addCommand(duckPluginCommand, {
//       label: 'The Duck',
//       execute: () => {
//         console.log('executing the duck');
//         // const data = JSON.stringify(threeCube);
//         // const data = JSON.parse(threeCube);
//         const data = threeCube;
//         registry.registerModel({
//           name: 'Three Cube',
//           gltf: data
//         });
//       }
//     });

//     palette.addItem({ command: duckPluginCommand, category: 'Video Chat' });
//   }
// };

export default [plugin, modelRegistryPlugin];

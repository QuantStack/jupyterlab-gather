import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  ICommandPalette,
  IThemeManager,
  MainAreaWidget
} from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { IStateDB } from '@jupyterlab/statedb';
import { LogoIcon } from './components/Icons';
import { IGatherRegistryToken, IModelRegistry, ModelManager } from './registry';
import { LeftSidebarWidget } from './widgets/LeftSidebar';
import { RightSidebarWidget } from './widgets/RightSidebar';
import { RootDisplayWidget } from './widgets/RootDisplay';
export { IGatherRegistryToken, IModelRegistry };

const PLUGIN_ID = 'jupyterlab_gather';
/**
 * Initialization data for the jupyterlab_gather extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: 'Video presentation over WebRTC with AR capabilities.',
  autoStart: true,
  requires: [
    ICommandPalette,
    ILauncher,
    IGatherRegistryToken,
    IStateDB,
    IThemeManager
  ],
  optional: [ILayoutRestorer, ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null,
    registry: IModelRegistry,
    state: IStateDB,
    themeManager: IThemeManager,
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
          const content = new RootDisplayWidget(
            registry.modelRegistryChanged,
            state,
            themeManager.themeChanged
          );
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

        const leftSidebarPanel = new LeftSidebarWidget(registry);
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
          url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb'
        });

        registry.registerModel({
          name: 'fox',
          url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Fox/glTF-Binary/Fox.glb'
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

export default [plugin, modelRegistryPlugin];

# jupyterlab_gather

[![Github Actions Status](https://github.com/QuantStack/jupyterlab-gather/workflows/Build/badge.svg)](https://github.com/QuantStack/jupyterlab-gather/actions/workflows/build.yml)[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/QuantStack/jupyterlab-gather/main?urlpath=lab)

**JupyterLab-Gather** enables video conferencing capabilities directly within Jupyter Lab, and also introduces the feature of using an AR cube marker to display GLTF models in real-time during video calls.

Imagine being able to share your work, collaborate on projects, or even teach in a more immersive and interactive way, all within the familiar Jupyter Lab environment. With this extension, you can now:

- **Video Conferencing**: Engage in real-time video calls directly from Jupyter Lab, facilitating seamless collaboration and communication among team members or students.
- **AR Cube Marker**: Utilize an AR cube marker to display GLTF models in real-time during video calls. This feature allows for the dynamic integration of 3D models into your presentations or collaborative sessions, enhancing the learning experience and making complex concepts more tangible.
- **Integration with JupyterCAD**: Using [JupyterCAD-Gather](https://github.com/jupytercad/jupytercad-gather), seamlessly integrate models created with JupyterCAD, a powerful JupyterLab extension for 3D geometry modeling, directly into your video calls. This allows you to share and collaborate on complex 3D designs in real-time, enhancing the learning and collaboration experience by making it more interactive and tangible

This extension is built on the foundation of JupyterLab's robust ecosystem, ensuring compatibility with existing JupyterLab features and extensions. Whether you're a teacher looking to make your lessons more interactive, a researcher wanting to share your findings in a more engaging way, or a student seeking a more immersive learning experience, this extension is designed to meet your needs.

## Requirements

- JupyterLab >= 4.0.0

## Install

To install the extension, execute:

```bash
pip install jupyterlab_gather
```

## Setup

1. Go to https://www.100ms.live/ and click `Try for Free` to get started.

   ![landing page](./docs/images/1_landing.png 'Landing')

2. Login however you like.

   ![login page](./docs/images/2_login.png 'Login')

3. Select `Video Conferencing`.

   ![use case page](./docs/images/3_usecase.png 'Use Case')

4. Go to the dashboard.

   ![role page](./docs/images/4_role.png 'Role')

5. Click on `Join` to see your room details.

   ![dashboard](./docs/images/5_dashboard.png 'Dashboard')

6. Copy the room code for whichever role you like. This code will be entered on the join form to gain access to the video conference room. Anyone with the code will be able to join the room.

   ![room code](./docs/images/6_roomcode.png 'Room Code')

7. Start Gather from the JupyterLab start page.

   ![jupyter](./docs/images/7_jupyter.png 'Jupyter')

8. Enter the room code on the join form and click `Join`.

   ![gather join](./docs/images/8_gather.png 'Join Room')

9. And that's all! You're all set up!

## Usage

[Check here for usage instructions](./docs/usage.md)

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterlab_gather
```

## Troubleshoot

Check the frontend extension is installed:

```bash
jupyter labextension list
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab_gather directory
# Install package in development mode
pip install -e ".[test]"
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Server extension must be manually installed in develop mode
jupyter server extension enable jupyterlab_gather
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
# Server extension must be manually disabled in develop mode
jupyter server extension disable jupyterlab_gather
pip uninstall jupyterlab_gather
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab_gather` within that folder.

### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)

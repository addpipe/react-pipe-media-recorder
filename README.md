# React Pipe Media Recorder

`@addpipe/react-pipe-media-recorder` provides a fully typed React hook for both TypeScript and JavaScript integrations that introduces the [Pipe Platform](https://addpipe.com) into your React projects. This package allows video, audio, and screen + camera recording. It's ideal for applications that need to capture user-generated content such as video feedback, messages, resumes, or testimonials. The recorder is easy to set up and ensures cross-platform compatibility, working on both desktop and mobile devices.

With `@addpipe/react-pipe-media-recorder`, you can:
- Record high-quality **audio and video** content directly from users.
- Capture **screen and camera** for detailed visual feedback or presentations.
- **Embed multiple recorders** on a page for various user interactions.

**Note**: You will need a free trial or paid account with [Addpipe](https://addpipe.com) to use this package.

> **How it loads:** As of version `1.3.0`, the recording client is bundled directly via the [`@addpipe/pipe-recording-client`](https://www.npmjs.com/package/@addpipe/pipe-recording-client) npm package instead of being injected into the page through remote `<script>`/`<link>` tags. The Pipe recording client is imported by the hook, so your bundler (Vite, webpack, Next.js, CRA, …) handles them automatically, no extra setup is required. The recorder still communicates with Pipe's servers at runtime; only how the client is loaded has changed. The recording client version follows this package's `@addpipe/pipe-recording-client` dependency range (`^2.0.0`); see [Pinning a specific recording-client version](#pinning-a-specific-recording-client-version) if you need to lock it to an exact release.

## Features:

- **Video, Audio, and Screen Recording**: Add high-quality media recording functionality to any React app, supporting both desktop and mobile devices.
- **Up to 4K Video**: Supports recording up to 4K resolution.
- **No Upload Time**: Stream recordings while they are created, minimizing the wait time for users.
- **Mobile Compatibility**: Supports HTML Media Capture for mobile video/audio recording.
- **Screen + Camera Recording**: Capture both the screen and camera simultaneously for enhanced recording capabilities.
- **Multilingual Support**: Available in multiple languages: English, French, German, and Spanish, with custom language support.
- **Keyboard Accessibility**: Fully controllable via keyboard for improved accessibility.
- **Connection Resilience**: Auto-reconnect ensures data recovery if the connection drops during recording.

## Installation

Install the package using npm:

```bash
npm install @addpipe/react-pipe-media-recorder
```

## Usage Examples

👉 **Working Demo**: You can find a working demo [here](https://addpipe.com/react-demo/). The source code for the demo is available in both JavaScript and TypeScript React. Find more about it [here](https://addpipe.com/react-demo/).

### Inserting a single recorder into the page

In this example, we insert a single Pipe recorder into the page and control it using the recorder's API (`record()` and `stopVideo()`). 

```jsx
import { useState } from "react";
import usePipeSDK from "@addpipe/react-pipe-media-recorder"; // Importing the Pipe recorder npm package

// Inserting a single Pipe recorder into the page
const SingleRecorder = () => {
  // Storing the generated recorder inside of a state - optional
  const [recorder, setRecorder] = useState(null);
  const [canRecord, setCanRecord] = useState(false);

  // Using the Pipe recorder custom hook
  const { isLoaded } = usePipeSDK((PipeSDK) => {
    // Check to make sure the code below is only executed on the initial load
    if (isLoaded) return;

    // Prepare the parameters needed to generate a new recorder
    const pipeParams = { size: { width: 640, height: 390 }, qualityurl: "avq/360p.xml", accountHash: "YOUR_ACCOUNT_HASH", eid: "YOUR_ENV_CODE", mrt: 600, avrec: 1 };

    // Inserting a new recorder into the page
    PipeSDK.insert("custom-id", pipeParams, (pipeRecorder) => {
      setRecorder(pipeRecorder); // Store the recorder instance for later use
      pipeRecorder.onReadyToRecord = () => {
        setCanRecord(true);
      }
    });
  });

  // Function to start a new recording using the recorder's API
  const startRecording = () => {
    if (!recorder || !canRecord) return;
    recorder.record(); // Call to start recording
  };

  // Function to stop a recording using the recorder's API
  const stopRecording = () => {
    if (!recorder || !canRecord) return;
    recorder.stopVideo(); // Call to stop recording
  };

  return (
    <div>
      {!isLoaded && <div>Loading the Pipe recorder</div>}
      <div id="custom-id"></div> {/* Placeholder for where the new recorder should be inserted */}
      {isLoaded && recorder && (
        <>
          {/* Buttons to control the recorder - Only display them after all prerequisites have loaded */}
          <button onClick={startRecording}>Record</button>
          <button onClick={stopRecording}>Stop</button>
        </>
      )}
    </div>
  );
};

export default SingleRecorder;
```
### Inserting a single recorder loaded from our EU client delivery servers (S1)

In this example, we insert a single Pipe recorder into the page and control it using the recorder's API (`record()` and `stopVideo()`). We load its static assets from our EU client delivery servers (S1) instead of the default global CDN by passing `useS1: true`.

> **Deprecated:** The `buildSlug` option no longer has any effect and is kept only for backward compatibility. It used to request a specific `pipe.min.js`/`pipe.min.css` release; the recording-client version is now determined by the installed [`@addpipe/pipe-recording-client`](https://www.npmjs.com/package/@addpipe/pipe-recording-client) dependency. Passing `buildSlug` logs a one-time console warning. To control the client version, see [Pinning a specific recording-client version](#pinning-a-specific-recording-client-version) below.

```jsx
import { useState } from "react";
import usePipeSDK from "@addpipe/react-pipe-media-recorder"; // Importing the Pipe recorder npm package

// Inserting a single Pipe recorder into the page
const SingleRecorder = () => {
  // Storing the generated recorder inside of a state - optional
  const [recorder, setRecorder] = useState(null);
  const [canRecord, setCanRecord] = useState(false);

  // Custom options
  const options = {
    useS1: true, // Load from our EU client delivery servers (S1)
  }

  // Using the Pipe recorder custom hook with S1
  const { isLoaded } = usePipeSDK((PipeSDK) => {
    // Check to make sure the code below is only executed on the initial load
    if (isLoaded) return;

    // Prepare the parameters needed to generate a new recorder
    const pipeParams = { size: { width: 640, height: 390 }, qualityurl: "avq/360p.xml", accountHash: "YOUR_ACCOUNT_HASH", eid: "YOUR_ENV_CODE", mrt: 600, avrec: 1 };

    // Inserting a new recorder into the page
    PipeSDK.insert("custom-id", pipeParams, (pipeRecorder) => {
      setRecorder(pipeRecorder); // Store the recorder instance for later use
      pipeRecorder.onReadyToRecord = () => {
        setCanRecord(true);
      }
    });
  }, options);

  // Function to start a new recording using the recorder's API
  const startRecording = () => {
    if (!recorder || !canRecord) return;
    recorder.record(); // Call to start recording
  };

  // Function to stop a recording using the recorder's API
  const stopRecording = () => {
    if (!recorder || !canRecord) return;
    recorder.stopVideo(); // Call to stop recording
  };

  return (
    <div>
      {!isLoaded && <div>Loading the Pipe recorder</div>}
      <div id="custom-id"></div> {/* Placeholder for where the new recorder should be inserted */}
      {isLoaded && recorder && (
        <>
          {/* Buttons to control the recorder - Only display them after all prerequisites have loaded */}
          <button onClick={startRecording}>Record</button>
          <button onClick={stopRecording}>Stop</button>
        </>
      )}
    </div>
  );
};

export default SingleRecorder;
```

### Pinning a specific recording-client version

This package depends on [`@addpipe/pipe-recording-client`](https://www.npmjs.com/package/@addpipe/pipe-recording-client) with the range `^2.0.0`, so by default you get the latest compatible `2.x` recording client. This is the modern replacement for the old `buildSlug` option.

To lock the recording client to an exact client version, override the dependency from **your own** project's `package.json` (not this package's). The recording client bundled into your app is whatever version resolves there.

**npm** (v8.3+) - add an [`overrides`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides) field:

```json
{
  "overrides": {
    "@addpipe/pipe-recording-client": "2.0.0"
  }
}
```

**Yarn / pnpm** - add a [`resolutions`](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) field:

```json
{
  "resolutions": {
    "@addpipe/pipe-recording-client": "2.0.0"
  }
}
```

Then reinstall (`npm install`, `yarn`, or `pnpm install`) and confirm the resolved version with `npm ls @addpipe/pipe-recording-client`. Available versions are listed on the [recording-client versions page](https://www.npmjs.com/package/@addpipe/pipe-recording-client?activeTab=versions).

### Inserting multiple recorders into the page

This example demonstrates how to insert multiple Pipe recorders into the page.

```jsx
import { useState } from "react";
import usePipeSDK from "@addpipe/react-pipe-media-recorder"; // Importing the Pipe recorder npm package

// Inserting multiple Pipe recorders into the page
const MultipleRecorders = () => {
  // Storing the global PipeSDK into a state
  const [pipeSdk, setPipeSdk] = useState(null);

  // Custom IDs for the recorders
  const CUSTOM_IDS = ["custom-id-1", "custom-id-2", "custom-id-3"];

  // Using the Pipe recorder custom hook
  const { isLoaded } = usePipeSDK((PipeSDK) => {
    // Check to make sure the code below is only executed on the initial load
    if (isLoaded) return;

    // Prepare the parameters needed to generate new recorders
    const pipeParams = { size: { width: 640, height: 390 }, qualityurl: "avq/360p.xml", accountHash: "YOUR_ACCOUNT_HASH", eid: "YOUR_ENV_CODE", mrt: 600, avrec: 1 };

    // Inserting new recorders into the page
    CUSTOM_IDS.forEach((id) => PipeSDK.insert(id, pipeParams, () => {}));

    // Store PipeSDK into a state for controlling the recorders later
    setPipeSdk(PipeSDK);
  });

  // Function to start a new recording using PipeSDK
  const startRecording = (recorderId) => {
    if (!pipeSdk) return;
    pipeSdk.getRecorderById(recorderId).record(); // Call to start recording for a specific recorder
  };

  // Function to stop a recording using PipeSDK
  const stopRecording = (recorderId) => {
    if (!pipeSdk) return;
    pipeSdk.getRecorderById(recorderId).stopVideo(); // Call to stop recording for a specific recorder
  };

  return (
    <>
      {CUSTOM_IDS.map((id, index) => (
        <div key={index}>
          <div id={id}></div> {/* Placeholder for where the new recorder should be inserted */}
          {/* Buttons to control the recorder - Only display them after all prerequisites have loaded */}
          {isLoaded && (
            <>
              <button onClick={() => startRecording(id)}>Record</button>
              <button onClick={() => stopRecording(id)}>Stop</button>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default MultipleRecorders;
```

## Controlling the Recorder

To control the recorders, you can use the API control methods, such as:

- `record()`: Starts a new recording.
- `stopVideo()`: Stops the recording.

A full list of the recorder's API control methods can be found in the official [Pipe API Documentation](https://addpipe.com/docs/javascript/js-api-v2/#methods-list).

## Embed Code Parameters

The `pipeParams` object is used to configure the Pipe recorder. Here’s an example of its structure:

```js
const pipeParams = {
  size: { width: 640, height: 390 },
  qualityurl: "avq/360p.xml",
  accountHash: "YOUR_ACCOUNT_HASH",
  eid: "YOUR_ENV_CODE",
  mrt: 600,
  avrec: 1,
  // Additional options available in the official documentation
};
```

For more detailed embed code options, refer to the [Addpipe Embed Code Options](https://addpipe.com/docs/desktop-recording-client/embed-code-options-desktop/#20-javascript).

## Documentation and Pricing

- Official Developer Documentation: [Addpipe Docs](https://addpipe.com/docs)
- Pricing Information: [Addpipe Pricing](https://addpipe.com/pricing)

---

### Keywords
- Video Recorder
- Video Recording
- Audio Recorder
- Audio Recording
- Screen Recorder
- Screen Recording
- Camera Recorder
- React Video Recorder
- React Audio Recorder
- Screen and Camera Capture
- React Hooks for Media

# Releases

All releases are available [here](https://github.com/addpipe/react-pipe-media-recorder/releases)
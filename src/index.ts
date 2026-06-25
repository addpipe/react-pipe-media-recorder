import { useEffect, useRef, useState } from "react";
import PipeSDKClient from "@addpipe/pipe-recording-client";
import "@addpipe/pipe-recording-client/pipe.min.css";

export type EmbedCodeOptions = {
  accountHash: string;
  size: {
    width: string | number;
    height: string | number;
  };
  qualityurl: string;
  eid?: string;
  ao?: number;
  mrt?: string | number;
  showMenu?: number;
  asv?: number;
  mv?: number;
  sis?: number;
  ssb?: number;
  avrec?: number;
  dup?: number;
  srec?: number;
  ns?: number;
  bgCol?: string;
  cornerradius?: string | number;
  menuCol?: string;
  normalCol?: string;
  overCol?: string;
  countdowntimer?: number;
  bgblur?: number;
  downloadbtn?: number;
  timertype?: number;
  hidesave?: number;
  // Allow additional properties
  [key: string]: any;
};

export type RecorderObject = {
  name: string;
  record: () => void;
  stopVideo: () => void;
  playVideo: () => void;
  pause: () => void;
  save: () => void;
  download: () => void;
  getStreamTime: () => void;
  getPlaybackTime: () => void;
  getStreamName: () => void;
  remove: () => void;
  btPausePressed: (recorderId: string) => void;
  btPlayPressed: (recorderId: string) => void;
  btRecordPressed: (recorderId: string) => void;
  btStopRecordingPressed: (recorderId: string) => void;
  onReadyToRecord: (recorderId: string, recorderType: string) => void;
  onCamAccess: (recorderId: string, allowed: boolean) => void;
  onConnectionClosed: (recorderId: string) => void;
  onConnectionStatus: (recorderId: string, status: string) => void;
  onDesktopVideoUploadFailed: (recorderId: string, error: string) => void;
  onDesktopVideoUploadProgress: (recorderId: string, percent: string | number) => void;
  onDesktopVideoUploadStarted: (recorderId: string, filename: string, filetype: string, audioOnly: boolean) => void;
  onDesktopVideoUploadSuccess: (recorderId: string, filename: string, filetype: string, videoId: string, audioOnly: boolean, location: string) => void;
  onMicActivityLevel: (recorderId: string, currentActivityLevel: number) => void;
  onPlaybackComplete: (recorderId: string) => void;
  onRecordingStarted: (recorderId: string) => void;
  onSaveOk: (recorderId: string, streamName: string, streamDuration: number, cameraName: string, micName: string, audioCodec: string, videoCodec: string, fileType: string, videoId: string, audioOnly: boolean, location: string) => void;
  onUploadDone: (recorderId: string, streamName: string, streamDuration: number, audioCodec: string, videoCodec: string, fileType: string, audioOnly: boolean, location: string) => void;
  onUploadProgress: (recorderId: string, percent: number | string) => void;
  onVideoUploadFailed: (recorderId: string, error: string) => void;
  onVideoUploadProgress: (recorderId: string, percent: number | string) => void;
  onVideoUploadStarted: (recorderId: string, filename: string, filetype: string, audioOnly: boolean) => void;
  onVideoUploadSuccess: (recorderId: string, filename: string, filetype: string, videoId: string, audioOnly: boolean, location: string) => void;
  userHasCamMic: (recorderId: string, cam_number: number, mic_number: number) => void;
  // Allow additional properties
  [key: string]: any;
};

export type PipeSDKObject = {
  insert: (id: string, params: EmbedCodeOptions, callback: (recorderObject: RecorderObject) => void) => void;
  getRecorderById: (recorderId: string) => RecorderObject | undefined;
  onRecordersInserted: () => void;
  recorders: Record<string, RecorderObject>;
  // Allow additional properties
  [key: string]: any;
};

export interface PipeSDKOptions {
  useS1?: boolean;
  buildSlug?: string;
}

export type UsePipeSDK = (
  callback: (PipeSDK: PipeSDKObject) => void,
  options?: PipeSDKOptions
) => {
  isLoaded: boolean;
};

// The bundled recording client exposes the same global `PipeSDK` object that
// pipe.min.js used to set at runtime. Casting keeps the public callback type
// (`PipeSDKObject`, which includes runtime-only helpers such as `getRecorderById`)
// unchanged for existing implementations.
const PipeSDK = PipeSDKClient as unknown as PipeSDKObject;

// Emit the `buildSlug` deprecation warning at most once per session.
let hasWarnedBuildSlug = false;

export const usePipeSDK: UsePipeSDK = (callback, options = {}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { useS1 = false, buildSlug } = options;
  const callbackRef = useRef(callback);
  // Ensure the callback runs only once per hook instance.
  const hasInitialized = useRef(false);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (hasInitialized.current) return;

    // `buildSlug` used to request a specific pipe.js/pipe.css release. The client
    // version is now pinned by the installed `@addpipe/pipe-recording-client`
    // package, so the option no longer has any effect.
    if (buildSlug && !hasWarnedBuildSlug) {
      hasWarnedBuildSlug = true;
      console.warn(
        "[react-pipe-media-recorder] The `buildSlug` option is deprecated and has no effect. " +
          "The recording client version is now determined by the installed " +
          "`@addpipe/pipe-recording-client` package version."
      );
    }

    try {
      // Choose the delivery server before any recorder is inserted. `useS1` loads
      // assets from Pipe's EU client-delivery servers (S1); the default is the CDN.
      if (typeof PipeSDK.setServer === "function") {
        PipeSDK.setServer(useS1 ? "s1" : "cdn");
      }

      hasInitialized.current = true;
      callbackRef.current(PipeSDK);
      setIsLoaded(true);
    } catch (err) {
      console.error("PipeSDK failed to initialize:", err);
      setError(err as Error);
    }
  }, [useS1, buildSlug]);

  return { isLoaded, error };
};

export default usePipeSDK;

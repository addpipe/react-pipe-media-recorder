import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    PipeSDK: PipeSDKObject;
  }
}

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

// Track loading state globally to prevent duplicate script insertions
let loadingPromise: Promise<any> | null = null;
let loadError: Error | null = null;
let loadAttempts = 0;
const MAX_LOAD_ATTEMPTS = 3;

export const usePipeSDK: UsePipeSDK = (callback, options = {}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { useS1 = false, buildSlug } = options;
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const loadFrom = useS1 ? "s1" : "cdn";
    
    const scriptSrc = buildSlug
      ? `https://${loadFrom}.addpipe.com/releases/2.0/${buildSlug}/pipe.js`
      : `https://${loadFrom}.addpipe.com/2.0/pipe.min.js`;
    
    const stylesheetHref = buildSlug
      ? `https://${loadFrom}.addpipe.com/releases/2.0/${buildSlug}/pipe.css`
      : `https://${loadFrom}.addpipe.com/2.0/pipe.css`;

    const insertScriptAndStylesheet = () => {
      loadAttempts++;
      
      loadingPromise = new Promise((resolve, reject) => {
        // Insert pipe.js
        const script = document.createElement("script");
        script.src = scriptSrc;
        
        script.onload = () => {
          loadError = null;
          loadAttempts = 0; // Reset attempts on success
          resolve(window.PipeSDK);
          if (window.PipeSDK) {
            callbackRef.current(window.PipeSDK);
            setIsLoaded(true);
          }
        };
        
        script.onerror = () => {
          loadError = new Error(`Failed to load PipeSDK script (attempt ${loadAttempts}/${MAX_LOAD_ATTEMPTS})`);
          reject(loadError);
        };
        
        document.head.appendChild(script);

        // Insert pipe.css
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = stylesheetHref;
        document.head.appendChild(stylesheet);
      });
    };

    const loadPipeSDK = async () => {
      // If PipeSDK already exists, use it immediately
      if (window.PipeSDK) {
        callbackRef.current(window.PipeSDK);
        setIsLoaded(true);
        return;
      }

      // If we've exceeded max attempts and there's an error, don't try again
      if (loadAttempts >= MAX_LOAD_ATTEMPTS && loadError) {
        setError(loadError);
        return;
      }

      // Check if script already exists in the DOM
      const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
      
      if (existingScript) {
        // Script exists, wait for it to load
        if (loadingPromise) {
          // Reuse existing loading promise
          try {
            await loadingPromise;
            if (window.PipeSDK) {
              callbackRef.current(window.PipeSDK);
              setIsLoaded(true);
            }
          } catch (error) {
            console.error('PipeSDK failed to load:', error);
            setError(error as Error);
            // If we haven't exceeded max attempts, try again
            if (loadAttempts < MAX_LOAD_ATTEMPTS) {
              existingScript.remove();
              loadingPromise = null;
              insertScriptAndStylesheet();
            }
          }
        } else {
          // Script exists but no loading promise, create one to wait for it
          loadingPromise = new Promise((resolve, reject) => {
            // Check if it's already loaded
            if (window.PipeSDK) {
              resolve(window.PipeSDK);
              return;
            }
            
            const onLoad = () => {
              existingScript.removeEventListener('load', onLoad);
              existingScript.removeEventListener('error', onError);
              resolve(window.PipeSDK);
            };
            
            const onError = () => {
              existingScript.removeEventListener('load', onLoad);
              existingScript.removeEventListener('error', onError);
              loadError = new Error('Script failed to load');
              reject(loadError);
            };
            
            existingScript.addEventListener('load', onLoad);
            existingScript.addEventListener('error', onError);
          });

          try {
            await loadingPromise;
            if (window.PipeSDK) {
              callbackRef.current(window.PipeSDK);
              setIsLoaded(true);
            }
          } catch (error) {
            console.error('PipeSDK failed to load:', error);
            setError(error as Error);
            // If we haven't exceeded max attempts, try again
            if (loadAttempts < MAX_LOAD_ATTEMPTS) {
              existingScript.remove();
              loadingPromise = null;
              insertScriptAndStylesheet();
            }
          }
        }
      } else {
        // No script exists, insert it
        insertScriptAndStylesheet();
      }
    };

    loadPipeSDK();
  }, [useS1, buildSlug]);

  return { isLoaded, error };
};

export default usePipeSDK;

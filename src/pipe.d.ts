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
  onCamAccess: (recorderId: string, allowed: boolean) => void;
  onConnectionClosed: (recorderId: string) => void;
  onConnectionStatus: (recorderId: string, status: string) => void;
  onDesktopVideoUploadFailed: (recorderId: string, error: string) => void;
  onDesktopVideoUploadProgress: (recorderId: string, percent: string | number) => void;
  onDesktopVideoUploadStarted: (recorderId: string, filename: string, filetype: string, audioOnly: boolean) => void;
  onDesktopVideoUploadSuccess: (recorderId: string, filename: string, filetype: string, videoId: string, audioOnly: boolean, location: string) => void;
  onFlashReady: (recorderId: string) => void;
  onMicActivityLevel: (recorderId: string, currentActivityLevel: number) => void;
  onPlaybackComplete: (recorderId: string, recorderType: string) => void;
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

export type UsePipeSDK = (callback: (PipeSDK: PipeSDKObject) => void) => {
  isLoaded: boolean;
};

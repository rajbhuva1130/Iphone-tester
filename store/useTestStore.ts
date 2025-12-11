import { create } from 'zustand';

export type TestStatus = 'pending' | 'running' | 'pass' | 'fail' | 'warning' | 'skipped';

export type TestKey =
  | 'camera'
  | 'microphone'
  | 'speaker'
  | 'touch'
  | 'deadPixels'
  | 'brightness'
  | 'vibration'
  | 'gyroscope'
  | 'accelerometer'
  | 'magnetometer'
  | 'gps'
  | 'wifi'
  | 'networkSpeed'
  | 'battery'
  | 'deviceInfo'
  | 'orientation'
  | 'flashlight'
  | 'proximity';

export interface BaseTestResult {
  status: TestStatus;
  updatedAt: number;
  notes?: string;
}

export interface CameraResult extends BaseTestResult {
  data?: { facing?: 'front' | 'back'; lastPhotoUri?: string; permission?: string };
}

export interface AudioResult extends BaseTestResult {
  data?: { uri?: string; durationMs?: number; level?: number };
}

export interface TouchResult extends BaseTestResult {
  data?: { completed: number; total: number };
}

export interface SensorResult extends BaseTestResult {
  data?: { x?: number; y?: number; z?: number; heading?: number };
}

export interface LocationResult extends BaseTestResult {
  data?: { latitude?: number; longitude?: number; accuracy?: number };
}

export interface WifiResult extends BaseTestResult {
  data?: { type?: string; isConnected?: boolean; ipAddress?: string | null; ssid?: string | null };
}

export interface NetworkSpeedResult extends BaseTestResult {
  data?: { latencyMs?: number };
}

export interface BatteryResult extends BaseTestResult {
  data?: { level?: number; state?: string };
}

export interface DeviceInfoResult extends BaseTestResult {
  data?: { model?: string; osName?: string; osVersion?: string; brand?: string };
}

export interface OrientationResult extends BaseTestResult {
  data?: { orientation?: string; locked?: boolean };
}

export interface FlashlightResult extends BaseTestResult {
  data?: { enabled?: boolean };
}

export interface BrightnessResult extends BaseTestResult {
  data?: { level?: number };
}

export interface ProximityResult extends BaseTestResult {
  data?: { near?: boolean };
}

export type TestResults = {
  camera: CameraResult;
  microphone: AudioResult;
  speaker: AudioResult;
  touch: TouchResult;
  deadPixels: BaseTestResult;
  brightness: BrightnessResult;
  vibration: BaseTestResult;
  gyroscope: SensorResult;
  accelerometer: SensorResult;
  magnetometer: SensorResult;
  gps: LocationResult;
  wifi: WifiResult;
  networkSpeed: NetworkSpeedResult;
  battery: BatteryResult;
  deviceInfo: DeviceInfoResult;
  orientation: OrientationResult;
  flashlight: FlashlightResult;
  proximity: ProximityResult;
};

const now = () => Date.now();

const initialResult = (status: TestStatus = 'pending'): BaseTestResult => ({
  status,
  updatedAt: now()
});

const createInitialState = (): TestResults => ({
  camera: initialResult(),
  microphone: initialResult(),
  speaker: initialResult(),
  touch: { ...initialResult(), data: { completed: 0, total: 25 } },
  deadPixels: initialResult(),
  brightness: initialResult(),
  vibration: initialResult(),
  gyroscope: initialResult(),
  accelerometer: initialResult(),
  magnetometer: initialResult(),
  gps: initialResult(),
  wifi: initialResult(),
  networkSpeed: initialResult(),
  battery: initialResult(),
  deviceInfo: initialResult(),
  orientation: initialResult(),
  flashlight: initialResult(),
  proximity: initialResult()
});

export interface TestStore {
  results: TestResults;
  updateResult: <K extends TestKey>(key: K, result: Partial<TestResults[K]> & { status?: TestStatus }) => void;
  reset: () => void;
  summary: () => Array<{ key: TestKey; status: TestStatus }>;
}

export const useTestStore = create<TestStore>((set, get) => ({
  results: createInitialState(),
  updateResult: (key, result) =>
    set((state) => ({
      results: {
        ...state.results,
        [key]: {
          ...state.results[key],
          ...result,
          updatedAt: now(),
          status: result.status ?? state.results[key].status
        }
      }
    })),
  reset: () => set({ results: createInitialState() }),
  summary: () => Object.entries(get().results).map(([key, value]) => ({ key: key as TestKey, status: value.status }))
}));

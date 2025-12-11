import {
  TestResults,
  TestStatus,
  TestKey,
  BaseTestResult,
  BatteryResult,
  WifiResult,
  NetworkSpeedResult
} from '../store/useTestStore';

export interface AiIssue {
  key: TestKey;
  severity: TestStatus;
  summary: string;
}

export interface AiResponse {
  message: string;
  issues: AiIssue[];
  suggestions: string[];
}

export const analyzeTestResults = async (results: TestResults): Promise<AiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const issues: AiIssue[] = [];
  const suggestions = new Set<string>();

  const pushIssue = (key: TestKey, severity: TestStatus, summary: string) => {
    issues.push({ key, severity, summary });
  };

  const healthCheck = (result: BaseTestResult, key: TestKey, summary: string) => {
    if (result.status === 'fail') pushIssue(key, 'fail', summary);
    if (result.status === 'pending') pushIssue(key, 'pending', `${summary} not completed yet.`);
  };

  // Core checks
  healthCheck(results.camera, 'camera', 'Camera test incomplete or failed.');
  healthCheck(results.microphone, 'microphone', 'Microphone recording failed.');
  healthCheck(results.speaker, 'speaker', 'Speaker playback failed.');
  healthCheck(results.touch, 'touch', 'Touch grid not fully tapped.');
  healthCheck(results.deadPixels, 'deadPixels', 'Dead-pixel sweep not verified.');
  healthCheck(results.brightness, 'brightness', 'Brightness sweep not verified.');
  healthCheck(results.vibration, 'vibration', 'Haptics did not trigger.');
  healthCheck(results.gyroscope, 'gyroscope', 'Gyroscope data missing.');
  healthCheck(results.accelerometer, 'accelerometer', 'Accelerometer data missing.');
  healthCheck(results.magnetometer, 'magnetometer', 'Compass data missing.');
  healthCheck(results.gps, 'gps', 'GPS position missing.');
  healthCheck(results.orientation, 'orientation', 'Orientation lock test pending.');
  healthCheck(results.flashlight, 'flashlight', 'Torch did not toggle.');
  healthCheck(results.proximity, 'proximity', 'Proximity simulation not marked.');

  // Battery heuristics
  const battery = results.battery as BatteryResult;
  if (battery.data?.level !== undefined && battery.data.level < 0.2) {
    pushIssue('battery', 'fail', 'Battery level below 20%. Consider service if drop is unexpected.');
    suggestions.add('Run a full charge cycle and re-test battery health.');
  }

  // Connectivity heuristics
  const wifi = results.wifi as WifiResult;
  if (wifi.data?.isConnected === false) {
    pushIssue('wifi', 'fail', 'WiFi is disconnected.');
    suggestions.add('Toggle WiFi and router, then rerun connectivity tests.');
  }

  const speed = results.networkSpeed as NetworkSpeedResult;
  if (speed.data?.latencyMs !== undefined && speed.data.latencyMs > 200) {
    pushIssue('networkSpeed', 'warning', `High latency detected (${speed.data.latencyMs} ms).`);
    suggestions.add('Move closer to the access point or switch to a less congested network.');
  }

  const message =
    issues.length === 0
      ? 'All completed tests look healthy. Feel free to export a report for your records.'
      : 'I found items that need attention. Review the issues and try the suggested fixes.';

  return {
    message,
    issues,
    suggestions: Array.from(suggestions)
  };
};

export const generateReport = (results: TestResults) => {
  const lines: string[] = [];
  lines.push('IPHONE HARDWARE DIAGNOSTIC REPORT');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');

  Object.entries(results).forEach(([key, value]) => {
    lines.push(`[${value.status.toUpperCase()}] ${key}`);
    if ((value as any).data) {
      lines.push(`  Data: ${JSON.stringify((value as any).data)}`);
    }
    if (value.notes) {
      lines.push(`  Notes: ${value.notes}`);
    }
    lines.push('');
  });

  return lines.join('\n');
};

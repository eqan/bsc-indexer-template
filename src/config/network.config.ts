type NetworkSettings = {
  enableWebSocket: boolean;
  enableReorgCheck: boolean;
  reorgCheckFrequency: number[];
  realtimeSyncFrequencySeconds: number;
  realtimeSyncMaxBlockLag: number;
  backfillBlockBatchSize: number;
};

export const getNetworkSettings = (): NetworkSettings => {
  const defaultNetworkSettings: NetworkSettings = {
    enableWebSocket: true,
    enableReorgCheck: true,
    realtimeSyncFrequencySeconds: 15,
    realtimeSyncMaxBlockLag: 8,
    backfillBlockBatchSize: 16,
    reorgCheckFrequency: [1, 5, 10, 30, 60], // In Minutes
  };
  return defaultNetworkSettings;
};

export interface SnapshotOption {
  width: number;
  height: number;
  full: boolean;
  device?: string;
}


export const snapshot = async (url: string, option?: SnapshotOption): Promise<string> => {
  const resp = await fetch(`/api/snapshot?url=${encodeURIComponent(url)}&width=${option?.width}&height=${option?.height}&full=${option?.full}&device=${option?.device}`);
  const blob = await resp.blob();
  return URL.createObjectURL(blob);
}

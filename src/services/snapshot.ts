interface SnapshotOption {
}


export const snapshot = async (url: string, option?: SnapshotOption): Promise<string> => {
  const resp = await fetch(`/api/snapshot?url=${encodeURIComponent(url)}`);
  const blob = await resp.blob();
  return URL.createObjectURL(blob);
}

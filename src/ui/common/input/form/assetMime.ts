// Plugins name an asset kind the way getMediaType does ('image', 'sound', 'video'), which is not
// always the MIME top-level type a browser reports for a file - sounds are 'audio/*'. Using the
// kind directly made `accept` match nothing and rejected every dropped sound file.
export function assetMimePrefix(assetType?: string): string | null {
  if (assetType == null) {
    return null;
  }
  return assetType === 'sound' ? 'audio' : assetType;
}

export function assetAcceptAttr(assetType?: string): string {
  const prefix = assetMimePrefix(assetType);
  return prefix != null ? prefix + '/*' : '*';
}

export function isAcceptedAssetFile(file: File, assetType?: string): boolean {
  const prefix = assetMimePrefix(assetType);
  return prefix == null || file.type === '' || file.type.startsWith(`${prefix}/`);
}

import { FieldValues } from 'react-hook-form';

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${sizes[i]}`;
}

export function convertReactFormToFormData(form: FieldValues) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(form)) {
    formData.append(key, value);
  }
  return formData;
}

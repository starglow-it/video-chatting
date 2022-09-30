import * as path from 'path';
import { slugify } from 'transliteration';

export const getFileNameAndExtension = (title: string) => {
  const formatTitle = slugify(title);

  const ext = path.extname(formatTitle).slice(1);
  const filename = path.basename(formatTitle, `.${ext}`);

  return {
    extension: ext,
    fileName: filename,
  };
};

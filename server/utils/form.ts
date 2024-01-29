import type { H3Event } from 'h3'
import formidable from 'formidable'
import type { Fields, Files, Options } from 'formidable'
import type IncomingForm from 'formidable/Formidable'

export interface FormResult {
  fields: Fields
  files: Files
}

interface ReadFilesOptions extends Options {
  getForm?: (incomingForm: IncomingForm) => void
}

export async function readForm(event: H3Event, options?: ReadFilesOptions): Promise<FormResult> {
  const form = formidable(options)
  options?.getForm?.(form)

  return await new Promise<FormResult>((resolve, reject) => {
    form.parse(event.req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

// interface Upload {
//   file: formidable.File[]
// }

// interface Data {
//   a: string
//   b: string
//   angelo: string
// }

// const { fields, files } = await readForm<Data, Upload>(event, {
//   maxFileSize: 6 * 1024 * 1024, // 1MB
// })
// const _file = Array.isArray(files.file) ? files.file[0] : files.file
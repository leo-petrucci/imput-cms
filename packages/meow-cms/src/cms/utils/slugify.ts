import s from 'slugify'

export const slugify = (string: string) =>
  s(string, {
    replacement: '-',
    remove: undefined,
    lower: true, // convert to lower case
    strict: true, // strip special characters except replacement
    locale: 'vi', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars
  })

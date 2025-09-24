import {
  I18nOptions,
  I18nJsonLoader,
  QueryResolver,
  HeaderResolver,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import * as path from 'path';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'vi',
  loader: I18nJsonLoader,
  loaderOptions: {
    path: path.resolve(process.cwd(), 'src/i18n'),
    watch: true,
  },
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    { use: HeaderResolver, options: ['x-lang'] },
    AcceptLanguageResolver,
  ],
};

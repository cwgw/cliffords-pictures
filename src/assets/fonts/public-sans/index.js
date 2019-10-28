/**
 * Public Sans by United States government!
 * @link https://public-sans.digital.gov/
 */
import publicSansItalicTTF from './public-sans-italic-vf.ttf';
import publicSansItalicWOFF2 from './public-sans-italic-vf.woff2';
import publicSansRomanTTF from './public-sans-roman-vf.ttf';
import publicSansRomanWOFF2 from './public-sans-roman-vf.woff2';

export default [
  {
    fontFamily: `'Public Sans'`,
    src: `url('${publicSansRomanWOFF2}') format('woff2'),
          url('${publicSansRomanTTF}') format('truetype')`,
    fontWeight: '100 900',
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    fontFamily: `'Public Sans'`,
    src: `url('${publicSansItalicWOFF2}') format('woff2'),
          url('${publicSansItalicTTF}') format('truetype')`,
    fontWeight: '100 900',
    fontStyle: 'italic',
    fontDisplay: 'swap',
  },
];

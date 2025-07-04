declare module '*.png' {
  import type { StaticImageData } from 'next/image';
  const value: StaticImageData;
  export default value;
}

declare module '*.jpg' {
  import type { StaticImageData } from 'next/image';
  const value: StaticImageData;
  export default value;
}

declare module '*.svg' {
  import type { StaticImageData } from 'next/image';
  const value: StaticImageData;
  export default value;
}

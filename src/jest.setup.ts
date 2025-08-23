import React from 'react';
global.React = React;

import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder as NodeTextDecoder } from 'util';


if (!global.TextEncoder) {
  (global as any).TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  (global as any).TextDecoder = NodeTextDecoder;
}

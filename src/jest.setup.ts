import React from 'react';
global.React = React;

import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder as NodeTextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  Object.assign(global, { TextEncoder });
}

if (typeof global.TextDecoder === 'undefined') {
  Object.assign(global, { TextDecoder: NodeTextDecoder });
}

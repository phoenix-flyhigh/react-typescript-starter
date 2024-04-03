import {render} from '@testing-library/react';
import React from 'react';
import App from '../src/App';
import axios from "axios";

test('jest running', () => {
  jest.spyOn(axios, "get").mockResolvedValue([]);
  
  render(<App />);
  expect(true).toBe(true)
});
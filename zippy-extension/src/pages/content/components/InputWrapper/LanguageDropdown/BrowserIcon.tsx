import React from 'react';
import whale from '@assets/img/whale.png';

interface BrowserIconProps {
  name: string;
}
const BrowserIcon = ({ name }: BrowserIconProps) => {
  const browseName = name.toLowerCase();
  switch (browseName) {
    case 'brave':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
          <path
            fill="#ff651f"
            d="M41,13l1,4l-4.09,16.35c-0.59,2.35-2.01,4.41-4.01,5.79l-8.19,5.68c-0.51,0.36-1.11,0.53-1.71,0.53	c-0.6,0-1.2-0.17-1.71-0.53l-8.19-5.68c-2-1.38-3.42-3.44-4.01-5.79L6,17l1-4l-1-2l3.25-3.25c1.05-1.05,2.6-1.44,4.02-0.99	c0.04,0.01,0.07,0.02,0.1,0.03L14,7l4-4h12l4,4l0.65-0.22c0.83-0.28,1.7-0.27,2.5,0c0.58,0.19,1.13,0.51,1.58,0.95	c0.01,0.01,0.01,0.01,0.02,0.02L42,11L41,13z"
          />
          <path
            fill="#f4592b"
            d="M38.73,7.73L33,11l-9,2l-9-3l-2.07-2.07c-0.56-0.56-1.41-0.74-2.15-0.44L8.67,8.33l0.58-0.58	c1.05-1.05,2.6-1.44,4.02-0.99c0.04,0.01,0.07,0.02,0.1,0.03L14,7l4-4h12l4,4l0.65-0.22c0.83-0.28,1.7-0.27,2.5,0	C37.73,6.97,38.28,7.29,38.73,7.73z"
          />
          <path
            fill="#fff"
            d="M32.51,23.49c-0.3,0.3-0.38,0.77-0.19,1.15l0.34,0.68c0.22,0.45,0.34,0.94,0.34,1.44	c0,0.8-0.29,1.57-0.83,2.16l-0.66,0.74c-0.32,0.21-0.72,0.23-1.04,0.05l-5.23-2.88c-0.59-0.4-0.6-1.27-0.01-1.66l3.91-2.66	c0.48-0.28,0.63-0.89,0.35-1.37l-1.9-3.16C27.28,17.46,27.45,17.24,28,17l6-3h-5l-3,0.75c-0.55,0.14-0.87,0.7-0.72,1.24l1.46,5.09	c0.14,0.51-0.14,1.05-0.65,1.22l-1.47,0.49c-0.21,0.07-0.41,0.11-0.62,0.11c-0.21,0-0.42-0.04-0.63-0.11l-1.46-0.49	c-0.51-0.17-0.79-0.71-0.65-1.22l1.46-5.09c0.15-0.54-0.17-1.1-0.72-1.24L19,14h-5l6,3c0.55,0.24,0.72,0.46,0.41,0.98l-1.9,3.16	c-0.28,0.48-0.13,1.09,0.35,1.37l3.91,2.66c0.59,0.39,0.58,1.26-0.01,1.66l-5.23,2.88c-0.32,0.18-0.72,0.16-1.04-0.05l-0.66-0.74	C15.29,28.33,15,27.56,15,26.76c0-0.5,0.12-0.99,0.34-1.44l0.34-0.68c0.19-0.38,0.11-0.85-0.19-1.15l-4.09-4.83	c-0.83-0.99-0.94-2.41-0.26-3.51l3.4-5.54c0.27-0.36,0.75-0.49,1.17-0.33l2.62,1.05c0.48,0.19,0.99,0.29,1.49,0.29	c0.61,0,1.23-0.14,1.79-0.42c0.75-0.38,1.57-0.57,2.39-0.57s1.64,0.19,2.39,0.57c1.03,0.51,2.22,0.56,3.28,0.13l2.62-1.05	c0.42-0.16,0.9-0.03,1.17,0.33l3.4,5.54c0.68,1.1,0.57,2.52-0.26,3.51L32.51,23.49z"
          />
          <path
            fill="#fff"
            d="M29.51,32.49l-4.8,3.8c-0.19,0.19-0.45,0.29-0.71,0.29s-0.52-0.1-0.71-0.29l-4.8-3.8	c-0.24-0.24-0.17-0.65,0.13-0.8l4.93-2.47c0.14-0.07,0.29-0.1,0.45-0.1s0.31,0.03,0.45,0.1l4.93,2.47	C29.68,31.84,29.75,32.25,29.51,32.49z"
          />
          <path
            fill="#ed4d01"
            d="M41,13l1,4l-4.09,16.35c-0.59,2.35-2.01,4.41-4.01,5.79l-8.19,5.68c-0.51,0.36-1.11,0.53-1.71,0.53	V10.36L25,12h7v-2l5.15-3.22c0.59,0.19,1.15,0.52,1.6,0.97L42,11L41,13z"
          />
          <path
            fill="#f5f5f5"
            d="M32.51,23.49c-0.3,0.3-0.38,0.77-0.19,1.15l0.34,0.68c0.22,0.45,0.34,0.94,0.34,1.44	c0,0.8-0.29,1.57-0.83,2.16l-0.66,0.74c-0.32,0.21-0.72,0.23-1.04,0.05l-5.23-2.88c-0.59-0.4-0.6-1.27-0.01-1.66l3.91-2.66	c0.48-0.28,0.63-0.89,0.35-1.37l-1.9-3.16C27.28,17.46,27.45,17.24,28,17l6-3h-5l-3,0.75c-0.55,0.14-0.87,0.7-0.72,1.24l1.46,5.09	c0.14,0.51-0.14,1.05-0.65,1.22l-1.47,0.49c-0.21,0.07-0.41,0.11-0.62,0.11V9.63c0.82,0,1.64,0.19,2.39,0.57	c1.03,0.51,2.22,0.56,3.28,0.13l2.62-1.05c0.42-0.16,0.9-0.03,1.17,0.33l3.4,5.54c0.68,1.1,0.57,2.52-0.26,3.51L32.51,23.49z"
          />
          <path
            fill="#f5f5f5"
            d="M29.51,32.49l-4.8,3.8c-0.19,0.19-0.45,0.29-0.71,0.29v-7.46c0.16,0,0.31,0.03,0.45,0.1l4.93,2.47	C29.68,31.84,29.75,32.25,29.51,32.49z"
          />
        </svg>
      );
    case 'chrome':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
          <path
            fill="#fff"
            d="M34,24c0,5.521-4.479,10-10,10s-10-4.479-10-10s4.479-10,10-10S34,18.479,34,24z"
          />
          <linearGradient
            id="Pax8JcnMzivu8f~SZ~k1ya"
            x1="5.789"
            x2="31.324"
            y1="34.356"
            y2="20.779"
            gradientTransform="matrix(1 0 0 -1 0 50)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#4caf50" />
            <stop offset=".489" stopColor="#4aaf50" />
            <stop offset=".665" stopColor="#43ad50" />
            <stop offset=".79" stopColor="#38aa50" />
            <stop offset=".892" stopColor="#27a550" />
            <stop offset=".978" stopColor="#11a050" />
            <stop offset="1" stopColor="#0a9e50" />
          </linearGradient>
          <path
            fill="url(#Pax8JcnMzivu8f~SZ~k1ya)"
            d="M31.33,29.21l-8.16,14.77C12.51,43.55,4,34.76,4,24C4,12.96,12.96,4,24,4v11 c-4.97,0-9,4.03-9,9s4.03,9,9,9C27.03,33,29.7,31.51,31.33,29.21z"
          />
          <linearGradient
            id="Pax8JcnMzivu8f~SZ~k1yb"
            x1="33.58"
            x2="33.58"
            y1="6"
            y2="34.797"
            gradientTransform="matrix(1 0 0 -1 0 50)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ffd747" />
            <stop offset=".482" stopColor="#ffd645" />
            <stop offset=".655" stopColor="#fed43e" />
            <stop offset=".779" stopColor="#fccf33" />
            <stop offset=".879" stopColor="#fac922" />
            <stop offset=".964" stopColor="#f7c10c" />
            <stop offset="1" stopColor="#f5bc00" />
          </linearGradient>
          <path
            fill="url(#Pax8JcnMzivu8f~SZ~k1yb)"
            d="M44,24c0,11.05-8.95,20-20,20h-0.84l8.17-14.79C32.38,27.74,33,25.94,33,24 c0-4.97-4.03-9-9-9V4c7.81,0,14.55,4.48,17.85,11C43.21,17.71,44,20.76,44,24z"
          />
          <linearGradient
            id="Pax8JcnMzivu8f~SZ~k1yc"
            x1="36.128"
            x2="11.574"
            y1="44.297"
            y2="28.954"
            gradientTransform="matrix(1 0 0 -1 0 50)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#f7572f" />
            <stop offset=".523" stopColor="#f7552d" />
            <stop offset=".712" stopColor="#f75026" />
            <stop offset=".846" stopColor="#f7461b" />
            <stop offset=".954" stopColor="#f7390a" />
            <stop offset="1" stopColor="#f73100" />
          </linearGradient>
          <path
            fill="url(#Pax8JcnMzivu8f~SZ~k1yc)"
            d="M41.84,15H24c-4.97,0-9,4.03-9,9c0,1.49,0.36,2.89,1.01,4.13H16L7.16,13.26H7.14 C10.68,7.69,16.91,4,24,4C31.8,4,38.55,8.48,41.84,15z"
          />
          <linearGradient
            id="Pax8JcnMzivu8f~SZ~k1yd"
            x1="19.05"
            x2="28.95"
            y1="30.95"
            y2="21.05"
            gradientTransform="matrix(1 0 0 -1 0 50)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#2aa4f4" />
            <stop offset="1" stopColor="#007ad9" />
          </linearGradient>
          <path
            fill="url(#Pax8JcnMzivu8f~SZ~k1yd)"
            d="M31,24c0,3.867-3.133,7-7,7s-7-3.133-7-7s3.133-7,7-7S31,20.133,31,24z"
          />
        </svg>
      );
    case 'edge':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
          <path
            fill="#1e88e5"
            d="M40.69,35.42c-9.15,11.88-21.41,8.8-26.23,6.1 c-7.35-4.11-12.5-13.68-9.44-23.25c0.9-2.82,2.27-5.23,3.98-7.23c1.67,0.13,3.65,0.13,6-0.04c14-1,18,11,17,14 c-0.51,1.53-2.32,2.02-3.97,2.13c0.16-0.22,0.36-0.54,0.64-1.02c0.87-1.54,0.98-4.49-1.73-6.27c-2.61-1.7-5.43-0.65-6.88,1.28 c-1.45,1.92-0.88,4.81-0.37,6.09c2.2,5.52,6.26,6.95,9.02,7.78c2.76,0.83,6.86,0.71,9.05-0.19c2.18-0.91,2.8-1.43,3.22-0.97 C41.41,34.29,41.11,34.82,40.69,35.42z"
          />
          <path
            fill="#0d47a1"
            d="M40.732,35.42c-3.48,4.52-7.41,6.87-11.21,7.91 c-0.03,0.01-0.06,0.01-0.08,0.02c-2.2,0.42-3.95,0.08-5.85-0.29c-3.09-0.6-7.35-4.01-8.38-10.18c-0.88-5.31,1.63-9.81,5.59-12.54 c-0.26,0.24-0.49,0.5-0.7,0.78c-1.45,1.92-0.88,4.81-0.37,6.09c2.2,5.52,6.26,6.95,9.02,7.78c2.76,0.83,6.86,0.71,9.05-0.19 c2.18-0.91,2.8-1.43,3.22-0.97C41.452,34.29,41.152,34.82,40.732,35.42z"
          />
          <path
            fill="#00e5ff"
            d="M26.94,4.25c0.02,0.26,0.03,0.54,0.03,0.81c0,3.78-1.75,7.14-4.48,9.32 c-1.02-0.52-2.21-0.94-3.65-1.22c-4.07-0.78-10.63,1.1-13.3,5.77c-0.88,1.53-1.25,3.1-1.41,4.55c0.04-1.71,0.33-3.46,0.89-5.21 C8.31,8.01,17.86,3.05,26.94,4.25z"
          />
          <path
            fill="#00e676"
            d="M41.4,27.89c-2.76,2.78-6.27,2.86-8.67,2.73 c-2.41-0.12-3.59-0.82-4.69-1.5c-1.11-0.69-0.48-1.37-0.37-1.52c0.11-0.15,0.38-0.41,1-1.49c0.29-0.51,0.5-1.18,0.54-1.91 c4.62-3.43,7.96-8.49,9.16-14.34c2.92,2.95,4.3,6.21,4.79,7.61C44.04,19.99,44.71,24.56,41.4,27.89z"
          />
          <path
            fill="#1de9b6"
            d="M38.37,9.85v0.01c-1.2,5.85-4.54,10.91-9.16,14.34c0.03-0.42,0-0.87-0.1-1.32 c0-0.02-0.01-0.04-0.01-0.05c-0.25-1.47-0.99-3.33-2.22-4.77c-1.22-1.44-2.52-2.73-4.39-3.68c2.73-2.18,4.48-5.54,4.48-9.32 c0-0.27-0.01-0.55-0.03-0.81c0.4,0.05,0.79,0.11,1.19,0.19C32.74,5.33,36.04,7.49,38.37,9.85z"
          />
        </svg>
      );
    case 'internet explorer':
    case 'unknown':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
          <path
            fill="#29B6F6"
            d="M29.4,8.4c1.1-0.7,5.3-3.3,8.8-3.3c6.6,0,3.5,7.7,3.5,7.7l0.2,0.2C45.7,3.3,38.4,4,38.4,4c-4.1,0-9.3,3.4-10.4,4.2c-1-0.1-2-0.2-3.1-0.2C9.7,8,7.4,19.6,7.1,23C7,23.5,7,23.8,7,23.8c0,0,0,0,0,0C7,23.9,7,24,7,24c0-0.1,0-0.2,0-0.3c6.1-8.7,14.5-12.2,14.5-12.2v0.6C9,20.6,6,33.2,5.3,35.7C4.5,38.3,5,44,10.3,44s10.4-4.2,10.4-4.2S21.9,40,25,40c13.2,0,16.7-12,16.7-12H30c0,0-1.2,4-5.4,4c-5.8,0-5.6-6-5.6-6h23c0.4-5.5-1.1-9.3-3.3-11.9C36.9,11.5,34,9.3,29.4,8.4z M20,39.6c0,0-7.8,4.9-11.4,1.5c-1.9-3.4,1.2-8.2,1.2-8.2S12.2,37.8,20,39.6z M18.8,10.3C18.8,10.3,18.7,10.3,18.8,10.3L18.8,10.3L18.8,10.3z M19,21c0,0-0.1-5,5.5-5c5.4,0,5.5,5,5.5,5H19z"
          />
        </svg>
      );
    case 'safari':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
          <path
            fill="#cfd8dc"
            d="M44,24c0,11.044-8.956,20-20,20S4,35.044,4,24S12.956,4,24,4S44,12.956,44,24z"
          />
          <path
            fill="#448aff"
            d="M41,24c0,9.391-7.609,17-17,17S7,33.391,7,24S14.609,7,24,7S41,14.609,41,24z"
          />
          <path fill="#ff3d00" d="M21.898,21.898l4.203,4.203l9.199-13.402L21.898,21.898z" />
          <path fill="#bf360c" d="M24,24l11.301-11.301l-9.199,13.402L24,24z" />
          <path fill="#fff" d="M21.898,21.898l-9.199,13.402l13.402-9.199L21.898,21.898z" />
          <path fill="#bdbdbd" d="M24,24L12.699,35.301l13.402-9.199L24,24z" />
          <path
            fill="#bbdefb"
            d="M17.102,10.699c0.598-0.301,1.199-0.598,1.797-0.801l1.203,2.703l-1.801,0.797L17.102,10.699z M36,25h2.898c0-0.301,0.102-0.699,0.102-1s0-0.699-0.102-1H36V25z M12.699,14.102l2.102,2.098l1.398-1.398l-2.098-2.102C13.602,13.199,13.199,13.602,12.699,14.102z M25,9.102C24.699,9,24.301,9,24,9s-0.699,0-1,0.102V12h2V9.102z M30.398,10.5c-0.598-0.301-1.199-0.5-1.898-0.699l-1.102,2.801l1.902,0.699L30.398,10.5z M12.5,20.5l0.699-1.898L10.5,17.5c-0.301,0.602-0.5,1.199-0.699,1.898L12.5,20.5z M12,23H9.102C9,23.301,9,23.699,9,24s0,0.699,0.102,1H12V23z M35.5,27.5l-0.699,1.898L37.5,30.5c0.301-0.602,0.5-1.199,0.699-1.898L35.5,27.5z M38.102,18.898c-0.203-0.598-0.5-1.199-0.801-1.797l-2.699,1.199l0.797,1.801L38.102,18.898z M35.301,33.898l-2.102-2.098l-1.398,1.398l2.098,2.102C34.398,34.801,34.801,34.398,35.301,33.898z M13.398,29.699l-0.797-1.801l-2.703,1.203c0.203,0.598,0.5,1.199,0.801,1.797L13.398,29.699z M29.699,34.602l-1.801,0.797l1.203,2.703c0.598-0.203,1.199-0.5,1.797-0.801L29.699,34.602z M20.5,35.5l-1.898-0.699L17.5,37.5c0.602,0.301,1.199,0.5,1.898,0.699L20.5,35.5z M25,38.898V36h-2v2.898c0.301,0,0.699,0.102,1,0.102S24.699,39,25,38.898z"
          />
        </svg>
      );
    case 'whale':
      return <img width={20} height={20} src={whale} alt="웨일" />;
    default:
      return null;
  }
};

export default BrowserIcon;
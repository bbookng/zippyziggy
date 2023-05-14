interface LogOnDev {
  log: (...message: Array<any>) => void;
  info: (...message: Array<any>) => void;
  error: (...message: Array<any>) => void;
  warn: (...message: Array<any>) => void;
  dir: (...message: Array<any>) => void;
}

const DEV = 'development';
const PROD = 'production';
const isDevelopment = import.meta.env.MODE === DEV;

const logOnDev: LogOnDev = {
  log: (...message) => {
    if (isDevelopment) {
      console.log(...message);
    }
  },

  error: (...message) => {
    if (isDevelopment) {
      console.error(...message);
    }
  },

  info: (...message) => {
    if (isDevelopment) {
      console.info(...message);
    }
  },

  warn: (...message) => {
    if (isDevelopment) {
      console.warn(...message);
    }
  },

  dir: (...message) => {
    if (isDevelopment) {
      console.dir(...message);
    }
  },
};

export default logOnDev;

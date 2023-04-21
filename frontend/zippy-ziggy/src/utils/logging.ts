interface LogOnDev {
  log: (...message: Array<any>) => void;
  info: (...message: Array<any>) => void;
  error: (...message: Array<any>) => void;
  warn: (...message: Array<any>) => void;
  dir: (...message: Array<any>) => void;
}

const logOnDev: LogOnDev = {
  log: (...message) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...message);
    }
  },

  error: (...message) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...message);
    }
  },

  info: (...message) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...message);
    }
  },

  warn: (...message) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...message);
    }
  },

  dir: (...message) => {
    if (process.env.NODE_ENV === 'development') {
      console.dir(...message);
    }
  },
};

export default logOnDev;

interface LogOnDev {
  log: (...message: Array<any>) => void;
  info: (...message: Array<any>) => void;
  error: (...message: Array<any>) => void;
  warn: (...message: Array<any>) => void;
  dir: (...message: Array<any>) => void;
}

const logOnDev: LogOnDev = {
  log: (...message) => {
    if (import.meta.env.MODE === 'development') {
      console.log(...message);
    }
  },

  error: (...message) => {
    if (import.meta.env.MODE === 'development') {
      console.error(...message);
    }
  },

  info: (...message) => {
    if (import.meta.env.MODE === 'development') {
      console.info(...message);
    }
  },

  warn: (...message) => {
    if (import.meta.env.MODE === 'development') {
      console.warn(...message);
    }
  },

  dir: (...message) => {
    if (import.meta.env.MODE === 'development') {
      console.dir(...message);
    }
  },
};

export default logOnDev;

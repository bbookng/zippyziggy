interface LogOnDev {
  log: (...message: Array<any>) => void;
  info: (...message: Array<any>) => void;
  error: (...message: Array<any>) => void;
  warn: (...message: Array<any>) => void;
  dir: (...message: Array<any>) => void;
}

const logOnDev: LogOnDev = {
  log: (...message) => {
    if (import.meta.env.MODE === 'production') {
      console.log(...message);
    }
  },

  error: (...message) => {
    if (import.meta.env.MODE === 'production') {
      console.error(...message);
    }
  },

  info: (...message) => {
    if (import.meta.env.MODE === 'production') {
      console.info(...message);
    }
  },

  warn: (...message) => {
    if (import.meta.env.MODE === 'production') {
      console.warn(...message);
    }
  },

  dir: (...message) => {
    if (import.meta.env.MODE === 'production') {
      console.dir(...message);
    }
  },
};

export default logOnDev;

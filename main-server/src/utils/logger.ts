enum LogLevel {
  Debug,
  Info,
  Warning,
  Error,
  Fatal,
}

class Logger {
  __label: string;
  constructor(label: string) {
    this.__label = label;
  }
  log(msg: string, level: LogLevel = LogLevel.Info) {
    const message = `${this.__label}: ${msg}`;

    switch (level) {
      case LogLevel.Debug:
        console.debug(message);
        break;
      case LogLevel.Info:
        console.info(message);
        break;
      case LogLevel.Warning:
        console.warn(message);
        break;
      case LogLevel.Error:
        console.error(message);
        break;
      default:
        console.log(message);
    }
  }
}

export default Logger;
export { LogLevel };

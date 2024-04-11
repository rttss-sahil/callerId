import { createLogger, transports, format } from 'winston';
const { combine, prettyPrint } = format;

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const winstonLogger = createLogger({
  format: combine(
  format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss',
  }),
    prettyPrint(),
  ),
  transports: [
    new transports.Console(options.console),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

export default winstonLogger;
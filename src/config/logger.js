
import winston from 'winston';
import colors from 'colors';
import { config } from './config.js';

const { combine, timestamp, printf } = winston.format;

colors.setTheme({
    debug: 'blue',
    http: 'magenta',
    info: 'green',
    warn: 'yellow',
    error: 'red',
    fatal: 'bgRed white'
});


const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${colors[level](`[${level.toUpperCase()}]`)}: ${message}`;
});

const developmentLogger = winston.createLogger({
    level: 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const productionLogger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

const logger = config.ENTORNO === 'production' ? productionLogger : developmentLogger;

export default logger;

/**
 * 
 * logger.js - File/Network Logger.
 */


const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');

const { AppConfig } = require('./appConfig');

const configuredLogs = AppConfig.OTHER_LOGS ? Object.keys(AppConfig.OTHER_LOGS) : [];

const logFormatter = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.label}: ${info.message}`)
);

class LogConfiguration {
    constructor(logPath, name = 'AppLog', logLevel = 'debug', fileSize = '20m', history = '14d', type = 'local') {
        this.configuredLogger = null;
        this.otherLogs = {};
        this.applyConfig(logPath, name, logLevel, fileSize, history, type);
    }

    applyConfig(logPath, name = 'AppLog', logLevel = 'debug', fileSize = '20m', history = '14d', type = 'local') {
        if (this.configuredLogger == null) {
            this.logPath = logPath;
            this.name = name;
            this.level = logLevel;
            this.sizeLimit = fileSize;
            this.historyLimit = history;
            this.type = type;

            // Ensure directory exists
            if (!fs.existsSync(this.logPath)) {
                fs.mkdirSync(this.logPath, { recursive: true });
            }

            for (let index in configuredLogs) {
                let type = configuredLogs[index];
                this.otherLogs[type] = this.createTypeLogger(type);
            }
        }
    }

    createSingletonLogger() {
        if (this.configuredLogger == null) {
            this.configuredLogger = winston.createLogger({
                level: this.level,
                format: logFormatter,
                transports: [
                    new DailyRotateFile({
                        dirname: this.logPath,
                        filename: `${this.name}-%DATE%.log`,
                        datePattern: 'YYYY-MM-DD',
                        level: this.level,
                        handleExceptions: true,
                        zippedArchive: true,
                        json: false,
                        maxSize: this.sizeLimit,
                        maxFiles: this.historyLimit
                    })
                ]
            });
        }
    }

    createTypeLogger(logType) {
        return winston.createLogger({
            level: this.level,
            format: logFormatter,
            transports: [
                new DailyRotateFile({
                    dirname: AppConfig['OTHER_LOGS'][logType]['path'],
                    filename: AppConfig['OTHER_LOGS'][logType]['file'],
                    datePattern: 'YYYY-MM-DD',
                    level: this.level,
                    handleExceptions: true,
                    zippedArchive: true,
                    json: false,
                    maxSize: this.sizeLimit,
                    maxFiles: this.historyLimit
                })
            ]
        });
    }

    getConfiguredLogger(logType) {
        if (logType !== null && logType in this.otherLogs) {
            return this.otherLogs[logType];
        } else {
            if (this.configuredLogger == null) {
                this.createSingletonLogger();
            }
        }

        return this.configuredLogger;
    }
}

// singleton configuration
// Hardcoding the path as per previous requirement
const logPath = '/home/harish/Antigravity/YLGGuide/ylgguide/YLG BACKEND LOG';
const logConfiguration = new LogConfiguration(logPath);

class LogWrapper {
    constructor(configuredLogger, category, type) {
        this.logger = configuredLogger;
        this.label = `[${process.pid}] ${category}`; // Cleaned up label
        this.logType = type;
    }

    info(message, meta = '') {
        this.logger.getConfiguredLogger(this.logType).log({ label: this.label, level: 'info', message, meta });
    }

    debug(message, meta = '') {
        this.logger.getConfiguredLogger(this.logType).log({ label: this.label, level: 'debug', message, meta });
    }

    error(message, meta = '') {
        this.logger.getConfiguredLogger(this.logType).log({ label: this.label, level: 'error', message, meta });
    }
}

const Logger = (category = 'Server', logType = null) => { return new LogWrapper(logConfiguration, category, logType); };

module.exports = { Logger, logConfiguration };

const { Logger } = require('../config/logger');
const logger = Logger('Request');

const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    // Hook into response finish event
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const msg = `${method} ${originalUrl} ${status} - ${duration}ms - IP: ${ip}`;

        if (status >= 400) {
            logger.error(msg);
        } else {
            logger.info(msg);
        }
    });

    next();
};

module.exports = requestLogger;

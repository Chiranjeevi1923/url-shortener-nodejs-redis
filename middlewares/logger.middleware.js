import fs from 'node:fs';

const loggerMiddleware = (req, res, next) => {
    const log = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}\n`;
    fs.appendFileSync('server-request.log', log, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
    next();
};

export default loggerMiddleware;

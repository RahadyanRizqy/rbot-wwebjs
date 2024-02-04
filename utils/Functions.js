const https = require('https');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const { zonedTimeToUtc } = require('date-fns-tz');

function logErrorToFile(errorMsg, formatDateTimeNow, config) {
    const logDirectory = 'log';
    const timestamp = formatDateTimeNow(config.timezone, 'dd-MM-yyyy-HH-mm-ss');
    const logFilePath = path.join(logDirectory, `${timestamp}.log`);
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }
    fs.appendFile(logFilePath, errorMsg + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

function fileExists(filePath) {
    try {
        fs.statSync(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

function checkFileFromUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            // Check if the status code indicates success (2xx)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve(true); // File exists
            } else {
                resolve(false); // File does not exist
            }
        }).on('error', (err) => {
            // An error occurred during the request
            reject(err);
        });
    });
}


function formatDateTimeNow(timeZoneConfig, dateTimeFormat) {
    return format(zonedTimeToUtc(new Date(), timeZoneConfig), dateTimeFormat, { timeZone: timeZoneConfig });
}

module.exports = { logErrorToFile, fileExists, checkFileFromUrl, formatDateTimeNow };
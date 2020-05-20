import log4js from 'log4js';

log4js.configure({
    "appenders": {
        "access": {
            "type": "dateFile",
            "filename": "log/access.log",
            "pattern": "-yyyy-MM-dd",
            "category": "http"
        },
        "app": {
            "type": "file",
            "filename": "log/app.log",
            "maxLogSize": 10485760,
            "numBackups": 3
        },
        "errorFile": {
            "type": "file",
            "filename": "log/errors.log"
        },
        "errors": {
            "type": "logLevelFilter",
            "level": "ERROR",
            "appender": "errorFile"
        }
    },
    "categories": {
        "default": { "appenders": ["app", "errors"], "level": "DEBUG" },
        "http": { "appenders": ["access"], "level": "DEBUG" }
    }
}
);

export default {
    http: log4js.getLogger('http'),
    app: log4js.getLogger('app'),
    error: log4js.getLogger('error'),
    express: log4js.connectLogger(log4js.getLogger('http'), { level: log4js.levels.INFO }),
    isDebug: (category) => (log4js.levels.DEBUG.level >= category.level.level)
}

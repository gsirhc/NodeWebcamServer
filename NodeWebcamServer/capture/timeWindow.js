var suncalc = require('suncalc')
var moment = require('moment');

exports.isInTimeWindow = function(timeWindowStart, timeWindowEnd, lat, long) {
    if (timeWindowStart == "")
        return true

    try {
        var start = exports.timeWindowToDate(timeWindowStart, lat, long, false);
        var end = exports.timeWindowToDate(timeWindowEnd, lat, long, true);
        var now = new Date();

        return now >= start && now <= end;
    } catch (ex) {
        console.error("Invalid time window '" + timeWindowStart + "': " + ex);
    }
};

exports.timeWindowToDate = function (timeWindowStr, lat, long, isEnd) {
    var date = new Date();
    timeWindowStr = timeWindowStr.toUpperCase();

    if (timeWindowStr.indexOf(":") != -1) {
        var split = timeWindowStr.split(':');
        if (split.length != 2 || !isNumeric(split[0]) || !isNumeric(split[1])) throw "Invalid time format.  Expected numeric HH and MM.";
        date.setHours(parseInt(split[0]));
        date.setMinutes(parseInt(split[1]));
    } else if (timeWindowStr.indexOf("SUNRISE") != -1 || timeWindowStr.indexOf("SUNSET") != -1) {
        if (!isNumeric(lat) || !isNumeric(long))  throw "Latitude and Longitude are required";

        var isSunrise = timeWindowStr.indexOf("SUNRISE") != -1;
        var addMinutes = exports.getAddMinutes(timeWindowStr);
        var calcDate = new Date();

        // Add day if sunrise is the end of the window
        if (isSunrise && isEnd) {
            calcDate = new Date(calcDate.getTime() + 1 * 60000 * 60 * 24)
        }

        var sunresults = suncalc.getTimes(calcDate, parseInt(lat), parseInt(long));        
        date = isSunrise ? sunresults.sunrise : sunresults.sunset;
        date = new Date(date.getTime() + addMinutes*60000);
    } else {
        throw "Invalid time format.  Expected ':' or 'SUNRISE' or 'SUNSET'.";
    }

    return date;
}

exports.getAddMinutes = function (timeWindowStr) {
    if (timeWindowStr.indexOf("+") != -1) {
        var split = timeWindowStr.split("+");
        return parseInt(split[1]);
    } else if (timeWindowStr.indexOf("-") != -1) {
        var split = timeWindowStr.split("-");
        return parseInt(split[1]) * -1;
    } else {
        return 0;
    }
}

exports.getSunriseSunset = function (settings) {
    var ss = { show: false }

    try {
        ss["current"] = moment().format("LT");
        ss["sunrise"] = moment(exports.timeWindowToDate("SUNRISE", settings.Latitude, settings.Longitude)).format("LT");
        ss["sunset"] = moment(exports.timeWindowToDate("SUNSET", settings.Latitude, settings.Longitude)).format("LT");        
        ss.show = true;
    } catch(ex) {
        // ignore
    }

    return ss;
}

function isNumeric(str) {
    return str != "" && !isNaN(str);
}
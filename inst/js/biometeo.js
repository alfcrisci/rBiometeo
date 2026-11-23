/*
 * biometeo.js - Biometeorological, thermal comfort and heat stress indices.
 *
 * Copyright (c) 2019-2026 Alfonso Crisci, Marco Morabito and Alessandro Messeri
 * @authors Alfonso Crisci, Marco Morabito and Alessandro Messeri
 * Email: a.crisci@ibe.cnr.it
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Third-party code included in this file:
 *
 * - pnorm / qnorm: Copyright (c) 2000 Sundar Dorai-Raj, GNU GPL version 2 or later
 *   (see the notice above pnorm).
 *
 * - PET_Hoppe: translation of the PETBER routine (P. Hoeppe, 1996) from VDI 3787 Part 2, as
 *   distributed in PALM-4U (human_thermal_comfort_PET.f90), Copyright 2018 Deutscher Wetterdienst,
 *   GNU GPL version 3 or later.
 *
 * - PET_Walther: port of pet_steady() from pythermalcomfort, distributed under the MIT License:
 *     Copyright (c) 2019 Federico Tartarini
 *     Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *     and associated documentation files (the "Software"), to deal in the Software without
 *     restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 *     Software is furnished to do so, subject to the following conditions:
 *     The above copyright notice and this permission notice shall be included in all copies or
 *     substantial portions of the Software.
 *     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *     BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Define global constants

var Patm = 101325.0; // pascal
var CpAir = 1004.0;
var CpWat = 4186.0;
var CpVap = 1805.0;
var Hfg = 2501000.0;
var RAir = 287.055;
var TKelConv = 273.15;
var PI = Math.PI,
  pi = Math.PI,
  twopi = 2 * pi,
  rad = PI / 180,
  radians = PI / 180,
  degrees = 180 / PI,
  J1970 = 2440588,
  J2000 = 2451545;

///////////////////////////////////////////////////////////////////////////////////////////
// format

function OneDec(c) {
  return Math.round(10 * c) / 10;
}

function TwoDec(c) {
  return Math.round(100 * c) / 100;
}

function ThreeDec(c) {
  return Math.round(1000 * c) / 1000;
}

function FourDec(c) {
  return Math.round(10000 * c) / 10000;
}

function scientificNotation(c, e) {
  return c.toPrecision(e);
}

////////////////////////////////////////////////////////////////////////////////////////////
// math & trigonometric

function radToDeg(angleRad) {
  return (180.0 * angleRad) / Math.PI;
}

function degToRad(angleDeg) {
  return (Math.PI * angleDeg) / 180.0;
}

function arrayMinIndex(array) {
  return array.indexOf(Math.min.apply(null, array));
}

function arrayMaxIndex(array) {
  return array.indexOf(Math.max.apply(null, array));
}

function linspace(x0, xN, dx) {
  var n = Math.floor((xN - x0) / dx);
  var x = [];
  for (var i = 0; i < n; ++i) {
    x.push(x0 + i * dx);
  }
  return x;
}

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

/** * @(#)pnorm.js and qnorm.js
 * * Copyright (c) 2000 by Sundar Dorai-Raj
 * * @author Sundar Dorai-Raj
 * * Email: sdoraira@vt.edu
 * * This program is free software; you can redistribute it and/or
 * * modify it under the terms of the GNU General Public License
 * * as published by the Free Software Foundation; either version 2
 * * of the License, or (at your option) any later version,
 * * provided that any use properly credits the author.
 * * This program is distributed in the hope that it will be useful,
 * * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * * "Applied Statistics Algorithms" (1985) vol 22 no.3 Algorithm AS66 P. Griffiths and I. D.    * *  Hill, editor
 *
 * References:
 *   - Hill I.D. (1973). Algorithm AS 66: The normal integral. Applied Statistics 22(3): 424-427.
 */

function pnorm(z, tail) {
  if (tail === undefined) {
    tail = false;
  }

  z = parseFloat(z);

  var ltone = 7.0;
  var utzero = 18.66;
  var con, a1, a2, a3, a4, a5, a6, a7, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, y, alnorm;
  con = 1.28;
  a1 = 0.398942280444;
  a2 = 0.399903438504;
  a3 = 5.75885480458;
  a4 = 29.8213557808;
  a5 = 2.62433121679;
  a6 = 48.6959930692;
  a7 = 5.92885724438;
  b1 = 0.398942280385;
  b2 = 3.8052e-8;
  b3 = 1.00000615302;
  b4 = 3.98064794e-4;
  b5 = 1.986153813664;
  b6 = 0.151679116635;
  b7 = 5.29330324926;
  b8 = 4.8385912808;
  b9 = 15.1508972451;
  b10 = 0.742380924027;
  b11 = 30.789933034;
  b12 = 3.99019417011;

  if (z < 0) {
    tail = !tail;
    z = -z;
  }
  if (z <= ltone || (tail && z <= utzero)) {
    y = 0.5 * z * z;
    if (z > con) {
      alnorm =
        (b1 * Math.exp(-y)) /
        (z - b2 + b3 / (z + b4 + b5 / (z - b6 + b7 / (z + b8 - b9 / (z + b10 + b11 / (z + b12))))));
    } else {
      alnorm = 0.5 - z * (a1 - (a2 * y) / (y + a3 - a4 / (y + a5 + a6 / (y + a7))));
    }
  } else {
    alnorm = 0;
  }
  if (!tail) alnorm = 1 - alnorm;
  return alnorm;
}

// ALGORITHM AS 111, APPL.STATIST., VOL.26, 118-121, 1977.
// Computes z=invNorm(p)

/**
 * References:
 *   - Beasley J.D., Springer S.G. (1977). Algorithm AS 111: The percentage points of the normal distribution.
 *     Applied Statistics 26(1): 118-121.
 */

function qnorm(p) {
  p = parseFloat(p);
  var split, a0, a1, a2, a3, b1, b2, b3, b4, c0, c1, c2, c3, d1, d2, q, r, ppnd;
  split = 0.42;
  a0 = 2.50662823884;
  a1 = -18.61500062529;
  a2 = 41.39119773534;
  a3 = -25.44106049637;
  b1 = -8.4735109309;
  b2 = 23.08336743743;
  b3 = -21.06224101826;
  b4 = 3.13082909833;
  c0 = -2.78718931138;
  c1 = -2.29796479134;
  c2 = 4.85014127135;
  c3 = 2.32121276858;
  d1 = 3.54388924762;
  d2 = 1.63706781897;
  q = p - 0.5;

  if (Math.abs(q) <= split) {
    r = q * q;
    ppnd = (q * (((a3 * r + a2) * r + a1) * r + a0)) / ((((b4 * r + b3) * r + b2) * r + b1) * r + 1);
  } else {
    r = p;
    if (q > 0) r = 1 - p;
    if (r > 0) {
      r = Math.sqrt(-Math.log(r));
      ppnd = (((c3 * r + c2) * r + c1) * r + c0) / ((d2 * r + d1) * r + 1);
      if (q < 0) ppnd = -ppnd;
    } else {
      ppnd = 0;
    }
  }
  return ppnd;
}

/**
 * Wind reduction at specific height
 * @param {number} x, ref, fin
 * @return {number}
 *
 */

function reducewind(x, ref, fin) {
  if (ref === undefined) {
    ref = 10;
  }
  if (fin === undefined) {
    fin = 2;
  }
  return (x * 1) / (Math.log(ref / 0.01) / Math.log(fin / 0.01));
}

/**
 * Compute error erf function
 *
 * References:
 *   - Hill I.D. (1973). Algorithm AS 66: The normal integral. Applied Statistics 22(3): 424-427.
 * @param {number} x
 * @return {number}
 *
 */

function erf(x) {
  x = parseFloat(x);
  return 2 * pnorm(x * Math.sqrt(2)) - 1;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Date related

function ExcelDateToJSDate(serial) {
  var utc_days = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);

  var fractional_day = serial - Math.floor(serial) + 0.0000001;

  var total_seconds = Math.floor(86400 * fractional_day);

  var seconds = total_seconds % 60;

  total_seconds -= seconds;

  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
}

Date.prototype.getJulian = function () {
  return Math.floor(this / 86400000 - this.getTimezoneOffset() / 1440 + 2440587.5);
};

Date.prototype.isLeapYear = function () {
  var year = this.getFullYear();
  if ((year & 3) !== 0) return false;
  return year % 100 !== 0 || year % 400 === 0;
};

Date.prototype.getDOY = function () {
  var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var mn = this.getMonth();
  var dn = this.getDate();
  var dayOfYear = dayCount[mn] + dn;
  if (mn > 1 && this.isLeapYear()) dayOfYear++;
  return dayOfYear;
};

String.prototype.toDate = function (format) {
  var normalized = this.replace(/[^a-zA-Z0-9]/g, "-");
  var normalizedFormat = format.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  var formatItems = normalizedFormat.split("-");
  var dateItems = normalized.split("-");

  var monthIndex = formatItems.indexOf("mm");
  var dayIndex = formatItems.indexOf("dd");
  var yearIndex = formatItems.indexOf("yyyy");
  var hourIndex = formatItems.indexOf("hh");
  var minutesIndex = formatItems.indexOf("ii");
  var secondsIndex = formatItems.indexOf("ss");

  var today = new Date();

  var year = yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
  var month = monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
  var day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();

  var hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHours();
  var minute = minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
  var second = secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();

  return new Date(year, month, day, hour, minute, second);
};

function getDOY(datetime) {
  return datetime.getDOY();
}

function toJulian(date) {
  return date.valueOf() / (1000 * 60 * 60 * 24) - 0.5 + J1970;
}

function fromJulian(j) {
  return new Date((j + 0.5 - J1970) * (1000 * 60 * 60 * 24));
}

function toDays(date) {
  return toJulian(date) - J2000;
}

function parseISO8601String(dateString) {
  var timebits =
    /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(?::([0-9]*)(\.[0-9]*)?)?(?:([+-])([0-9]{2})([0-9]{2}))?/;
  var m = timebits.exec(dateString);
  var resultDate;
  if (m) {
    var utcdate = Date.UTC(
      parseInt(m[1]),
      parseInt(m[2]) - 1, // months are zero-offset (!)
      parseInt(m[3]),
      parseInt(m[4]),
      parseInt(m[5]), // hh:mm
      (m[6] && parseInt(m[6])) || 0, // optional seconds
      (m[7] && parseFloat(m[7]) * 1000) || 0
    ); // optional fraction
    // utcdate is milliseconds since the epoch
    if (m[9] && m[10]) {
      var offsetMinutes = parseInt(m[9]) * 60 + parseInt(m[10]);
      utcdate += (m[8] === "+" ? -1 : +1) * offsetMinutes * 60000;
    }
    resultDate = new Date(utcdate);
  } else {
    resultDate = null;
  }
  return resultDate;
}

/**
 * Given a year return if is a leap year.
 * @param {number} yr
 * @return {String}
 */

function isLeapYear(yr) {
  return (yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0;
}

/**
 * Given a date, return the name of the day for that date.
 * @param {Date} date
 * @return {string}
 */

function dayname_IT(date) {
  var dayNumberNameMap = {
      0: "Domenica",
      1: "Lunedi",
      2: "Martedi",
      3: "Mercoledi",
      4: "Giovedi",
      5: "Venerdi",
      6: "Sabato"
    },
    dayName,
    dayNumber;

  if (!date.getDay) {
    throw TypeError('TypeError: Argument is not of type "Date"!');
  }

  dayNumber = date.getDay();
  dayName = dayNumberNameMap[dayNumber];
  return dayName;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// sun related

/**
 * References:
 *   - Blanco-Muriel M., Alarcon-Padilla D.C., Lopez-Moratalla T., Lara-Coira M. (2001). Computing the solar
 *     vector. Solar Energy 70(5): 431-441. doi:10.1016/S0038-092X(00)00156-0
 */

function sun_data(strtime, lat, lon, parameter) {
  var datetime = new Date(strtime);
  var udtTimedHours = datetime.getHours() - 0;
  var udtTimedMinutes = datetime.getMinutes() - 0;
  var udtTimedSeconds = datetime.getSeconds() - 0;
  var udtLocationdLongitude = lon - 0;
  var udtLocationdLatitude = lat - 0;
  var dEarthMeanRadius = 6371.01;
  var dAstronomicalUnit = 149597890;
  var dDecimalHours = udtTimedHours + (udtTimedMinutes + udtTimedSeconds / 60) / 60;
  var dJulianDate = datetime.valueOf() / (1000.0 * 60.0 * 60.0 * 24.0) - 0.5 + J1970;
  var dElapsedJulianDays = dJulianDate - 2451545;
  var dOmega = 2.1429 - 0.0010394594 * dElapsedJulianDays;
  var dMeanLongitude = 4.895063 + 0.017202791698 * dElapsedJulianDays;
  var dMeanAnomaly = 6.24006 + 0.0172019699 * dElapsedJulianDays;
  var dEclipticLongitude =
    dMeanLongitude +
    0.03341607 * Math.sin(dMeanAnomaly) +
    3.4894e-4 * Math.sin(2 * dMeanAnomaly) -
    1.134e-4 -
    2.03e-5 * Math.sin(dOmega);
  var dEclipticObliquity = 0.4090928 - 6.214e-9 * dElapsedJulianDays + 3.96e-5 * Math.cos(dOmega);
  var dSin_EclipticLongitude = Math.sin(dEclipticLongitude);
  var dY = Math.cos(dEclipticObliquity) * dSin_EclipticLongitude;
  var dX = Math.cos(dEclipticLongitude);
  var dRightAscension = Math.atan2(dY, dX);
  0 > dRightAscension && (dRightAscension += twopi);
  var dDeclination = Math.asin(Math.sin(dEclipticObliquity) * dSin_EclipticLongitude);
  var dGreenwichMeanSiderealTime = 6.6974243242 + 0.0657098283 * dElapsedJulianDays + dDecimalHours;
  var dLocalMeanSiderealTime = (15 * dGreenwichMeanSiderealTime + udtLocationdLongitude) * rad;
  var dHourAngle = dLocalMeanSiderealTime - dRightAscension;
  var dLatitudeInRadians = udtLocationdLatitude * rad;
  var dCos_Latitude = Math.cos(dLatitudeInRadians);
  var dSin_Latitude = Math.sin(dLatitudeInRadians);
  var dCos_HourAngle = Math.cos(dHourAngle);
  var udtSunCoordinatesdZenithAngle = Math.acos(
    dCos_Latitude * dCos_HourAngle * Math.cos(dDeclination) + Math.sin(dDeclination) * dSin_Latitude
  );
  dY = -Math.sin(dHourAngle);
  dX = Math.tan(dDeclination) * dCos_Latitude - dSin_Latitude * dCos_HourAngle;
  var udtSunCoordinatesdAzimuth = Math.atan2(dY, dX);
  0 > udtSunCoordinatesdAzimuth && (udtSunCoordinatesdAzimuth += twopi);
  udtSunCoordinatesdAzimuth /= rad;
  var dParallax = (dEarthMeanRadius / dAstronomicalUnit) * Math.sin(udtSunCoordinatesdZenithAngle);
  udtSunCoordinatesdZenithAngle = (udtSunCoordinatesdZenithAngle + dParallax) / rad;
  var azimuth = udtSunCoordinatesdAzimuth;
  var zenith = udtSunCoordinatesdZenithAngle;
  var elevation = 90 - udtSunCoordinatesdZenithAngle;
  if (elevation > 85.0) {
    var refractionCorrection = 0.0;
  } else {
    var te = Math.tan(degToRad(elevation));
    if (elevation > 5.0) {
      var refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
    } else if (elevation > -0.575) {
      var refractionCorrection =
        1735.0 + elevation * (-518.2 + elevation * (103.4 + elevation * (-12.79 + elevation * 0.711)));
    } else {
      var refractionCorrection = -20.774 / te;
    }
    refractionCorrection = refractionCorrection / 3600.0;
  }

  var solarZen = zenith - refractionCorrection;
  if (parameter == "azimuth") {
    return FourDec(azimuth);
  } else if (parameter == "zenith") {
    return FourDec(zenith);
  } else if (parameter == "solarZenith") {
    return FourDec(solarZen);
  } else if (parameter == "elevation") {
    return FourDec(elevation);
  } else if (parameter == "declination") {
    return dDeclination * (180 / PI);
  } else if (parameter == "JD") {
    return dJulianDate;
  } else {
    return "Parameter not indicated!";
  }
}

/**
 * Given thoretical directed radiation of horizontal surface.
 *
 * References:
 *   - Masters G.M. (2004). Renewable and Efficient Electric Power Systems, ch. 7 (ASHRAE clear-sky model).
 *     Wiley, Hoboken NJ.
 * @param {number} jddate, az, elev, planezen, planeaz
 * @return {number}
 */

function radtheoric(jddate, elev, albedo, param) {
  if (albedo === undefined) {
    albedo = 0.3;
  }
  if (param === undefined) {
    param = "global";
  }

  var radcalcteoric;
  var SC = 1.361; //  kW/m2   ET solar radition I0 kW/m2 Solar constant
  var I0 = SC * (1 + 0.034 * Math.cos((jddate * 2 * pi) / 365)); //  atmospheric effect
  var A = 1.16 + 0.075 * Math.sin(((jddate - 274) * 2 * pi) / 365);
  var opt_depth = 0.174 + 0.035 * Math.sin(((jddate - 100) * 2 * pi) / 365);
  var air_mass = 1 / Math.sin((elev * 2 * pi) / 360);
  var IB = I0 * Math.exp(-opt_depth * air_mass); //  Direct Beam
  var IDH = IB * (0.095 + 0.04 * Math.sin(((jddate - 100) * 2 * pi) / 365)); // Diffuse radiation
  var ID = (IDH * (1 + Math.cos(pi - (elev * 2 * pi) / 360))) / 2; // Diffuse radiation
  var IBH = IB * Math.sin((elev * 2 * pi) / 360);
  var IR = (albedo * (IBH + IDH) * (1 + Math.cos(pi - (elev * 2 * pi) / 360))) / 2; // reflected
  var ITot = IB + ID + IR; //  total

  if (ITot < 0) {
    ITot = 0;
    IB = 0;
    IR = 0;
  }

  if (param == "global") {
    return ITot;
  } else if (param == "direct") {
    return IB;
  } else if (param == "diffuse") {
    return ID;
  } else if (param == "reflected") {
    return IR;
  } else {
    return 9999;
  }
}

/**
 * Theoretical direct beam radiation on a tilted surface (kW/m2), 0 when the sun is behind the plane.
 *
 * References:
 *   - Masters G.M. (2004). Renewable and Efficient Electric Power Systems, ch. 7 (ASHRAE clear-sky model).
 *     Wiley, Hoboken NJ.
 * @param {number} jddate   day of year (1-366), as in radtheoric
 * @param {number} az       sun azimuth (degrees)
 * @param {number} elev     sun elevation (degrees)
 * @param {number} planezen tilt of the plane from horizontal (degrees)
 * @param {number} planeaz  azimuth of the plane normal (degrees)
 * @return {number}
 */

function rad_direct_tilted(jddate, az, elev, planezen, planeaz) {
  var rad_dir = radtheoric(jddate, elev, undefined, "direct"); // elev in degrees
  // degrees -> radians
  planezen = planezen * rad;
  planeaz = planeaz * rad;
  elev = elev * rad;
  az = az * rad;
  var radinc =
    rad_dir *
    (Math.cos(elev) * Math.sin(planezen) * Math.cos(planeaz - az) + Math.sin(elev) * Math.cos(planezen));
  return Math.max(0, radinc);
}

/**
 * Given sun elevation in degrees give value of projection factor.
 *
 * References:
 *   - Jendritzky G., Menz G., Schirmer H., Schmidt-Kessen W. (1990). Methodik zur raumbezogenen Bewertung der
 *     thermischen Komponente im Bioklima des Menschen. Beitr. Akad. Raumforsch. Landesplan. 114, Hannover.
 *   - Fanger P.O. (1970). Thermal Comfort: Analysis and Applications in Environmental Engineering. Danish
 *     Technical Press, Copenhagen.
 * @param {number} suneleve
 * @return {number}
 */

function proj(sunelev) {
  if (sunelev < 0.0) {
    return 0.0;
  }
  return 0.308 * Math.cos(rad * (sunelev * (0.998 - Math.pow(sunelev, 2.0) / 50000.0)));
}

/**
 * Given a temperature in celsius degree (degC), return the Fahrenheit degree value (degF).
 * @param {number} C
 * @return {number}
 */

function C2F(C) {
  if (typeof C !== "number") {
    throw TypeError("Celsius value must be a number");
  }
  return Math.round((C * 9) / 5 + 32, 2);
}

/**
 * Given a temperature in Fahrenheit degree (degF), return  the celsius degree value (degF).
 * @param {number} F
 * @return {number}
 */

function F2C(F) {
  if (typeof F !== "number") {
    throw TypeError("Value must be a number");
  }
  return Math.round((5 / 9) * (F - 32), 3);
}

/////////////////////////////////////////////////////////////////////////////////////////
//  wind  sector direction

function compass_16(direction) {
  var dir = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW"
  ];
  var dirint = (direction + 11.25) / 22.5;
  return dir[parseInt(dirint % 16)];
}

function compass_8(direction) {
  var dir = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  var dirint = (direction + 22.5) / 45;
  return dir[parseInt(dirint % 8)];
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// radiant temperature

/**
 * Given t air temperature in degC, rh relative humidity (%), shortwave  directed beam short-wavelength radiation (W/mq)the sun elevation,albedo gives and surface emissivity provides
 * an assessment of Mean Radiant Temperature.
 *
 * References:
 *   - Jendritzky G., Menz G., Schirmer H., Schmidt-Kessen W. (1990). Methodik zur raumbezogenen Bewertung der
 *     thermischen Komponente im Bioklima des Menschen. Beitr. Akad. Raumforsch. Landesplan. 114, Hannover.
 *   - VDI 3787 Part 2 (2008). Environmental meteorology - Methods for the human biometeorological evaluation
 *     of climate and air quality for urban and regional planning. Part I: Climate. Beuth, Berlin.
 *   - Fanger P.O. (1970). Thermal Comfort: Analysis and Applications in Environmental Engineering. Danish
 *     Technical Press, Copenhagen.
 * @param {number} t, rh, wind, rshort, sunelev
 * @return {number}
 */

function mrt_solar_proj(t, rh, solar, sunelev, albedo, emis_sfc, fdir) {
  if (albedo === undefined) {
    albedo = 0.3;
  }
  if (emis_sfc === undefined) {
    emis_sfc = 0.97;
  }
  if (fdir === undefined) {
    fdir = 0.8;
  }
  if (sunelev === undefined) {
    sunelev = 90;
  }

  var temprad;
  var emiair;
  var tsk;
  var rshort = solar * fdir;
  var rdiffuse = solar - rshort;

  var sig = 5.67e-8;
  emiair = emis_atm(t, rh);
  tsk = t + 273.12;
  var ratio = 0.0429 * Math.sin(sunelev * rad) + 0.345 * Math.cos(sunelev * rad);
  var proj = 0.308 * Math.cos(rad * (sunelev * (0.998 - Math.pow(sunelev, 2.0) / 50000.0)));

  temprad =
    Math.pow(
      emiair * Math.pow(tsk, 4) +
        ((1 - albedo) * rdiffuse) / (sig * emis_sfc) +
        (1 - albedo) * proj * ratio * ((rshort - rdiffuse) / (sig * emis_sfc)),
      0.25
    ) - 273.16;

  return temprad;
}

/**
 * Mean radiant temperature from globe temperature, Thorsson et al. (2007)
 * convection coefficients (1.335e8 v^0.71), forced convection only.
 *
 * References:
 *   - Thorsson S., Lindberg F., Eliasson I., Holmer B. (2007). Different methods for estimating the mean
 *     radiant temperature in an outdoor urban setting. Int. J. Climatol. 27: 1983-1993. doi:10.1002/joc.1537
 * @param {number} t     air temperature (degC)
 * @param {number} tg    globe temperature (degC)
 * @param {number} wind  wind speed at globe level (m/s)
 * @param {number} [diam=0.15] globe diameter in meters
 * @return {number} mean radiant temperature (degC), NaN if not physically defined
 */

function mrt_thorsson(t, tg, wind, diam) {
  if (diam === undefined) {
    diam = 0.15;
  }
  var emis_globe = 0.97;
  var x =
    Math.pow(tg + 273.15, 4) +
    ((1.335e8 * Math.pow(wind, 0.71)) / (emis_globe * Math.pow(diam, 0.4))) * (tg - t);
  if (x <= 0) {
    return NaN;
  }
  return Math.pow(x, 0.25) - 273.15;
}

/**
 * References:
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 */

function fglob_sphere(Tglobe_prev, Tair, rh, speed, solar, zenith, pair, alb_sfc, fdir, diam) {
  if (zenith === undefined) {
    zenith = 0.0000000001;
  }
  if (zenith <= 0) {
    zenith = 0.0000000001;
  }
  if (zenith > 1.57) {
    zenith = 1.57;
  }
  if (pair === undefined) {
    pair = 1013.25;
  }
  if (alb_sfc === undefined) {
    alb_sfc = 0.4;
  }
  if (fdir === undefined) {
    fdir = 0.8;
  }
  if (diam === undefined) {
    diam = 0.05;
  }

  var cza, dT, Tref, h, Tglobe;
  var speedmin = 0.13;
  var alb_globe = 0.05;
  var emis_globe = 0.95;
  var emis_sfc = 0.999;
  var stefanb = 0.000000056696;
  var Tsfc = Tair;
  var RH = rh * 0.01;
  var emis_air;
  var converge = 0.05;

  cza = Math.cos(zenith);

  Tref = 0.5 * (Tglobe_prev + Tair);

  h = h_sphere_in_air(Tref, speed, pair);

  Tglobe = Math.pow(
    0.5 * (emis_atm(Tair, RH) * Math.pow(Tair, 4) + emis_sfc * Math.pow(Tsfc, 4)) -
      (h / (emis_globe * stefanb)) * (Tglobe_prev - Tair) +
      (solar / (2 * emis_globe * stefanb)) * (1 - alb_globe) * (fdir * (1 / (2 * cza) - 1) + 1 + alb_sfc),
    0.25
  );

  dT = Math.abs(Tglobe - Tglobe_prev);

  return dT;
}

/**
 *  Given t air temperature (degC), rh relative humidity (%) , speed as wind speed in m/s,
 *  solar as global radiation in  Watt/mq, solar zenith in radians, pair Air Pressure in millibar (hPa),
 *  alb_sfc as the mean albedo of surrounding surfaces, fdir is the ratio between diffuse and directed radiation,
 *  irad is 1 if the radiation is taken into account , diam is the diameter of heat globe in meters,
 *  maxair and minair are  the range respect to air temperature where  solution was searched and prec is the precision.
 *
 * References:
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 *  @param {number} t,rh,wind,solar,zenith,pair,alb_sfc,fdir,irad,diam,maxair,minair,prec
 *  @return {number}
 */

function tglob_sphere(t, rh, speed, solar, zenith, pair, alb_sfc, fdir, diam, maxair, minair, prec) {
  if (pair === undefined) {
    pair = 1013.25;
  }
  if (alb_sfc === undefined) {
    alb_sfc = 0.4;
  }
  if (fdir === undefined) {
    fdir = 0.8;
  }
  if (diam === undefined) {
    diam = 0.05;
  }
  if (minair === undefined) {
    minair = 2;
  }
  if (maxair === undefined) {
    maxair = 10;
  }
  if (prec === undefined) {
    prec = 0.01;
  }

  if (solar > 15 && zenith > 1.54) {
    zenith = 1.54;
  }
  if (solar > 900 && zenith > 1.52) {
    zenith = 1.52;
  }

  var Tair = t + 273.15;
  var map1 = [];
  var array1 = linspace(Tair - minair, Tair + maxair, prec);
  for (var i = 0; i < array1.length; i++) {
    map1[i] = fglob_sphere(array1[i], Tair, rh, speed, solar, zenith, pair, alb_sfc, fdir, diam);
  }
  return array1[arrayMinIndex(map1)] - 273.15;
}

/**
 * Mean radiant temperature from globe temperature (ISO 7726).
 * The convective coefficient is the larger of forced (6.3 v^0.6 / D^0.4)
 * and natural (1.4 (|Tg-Ta|/D)^0.25) convection, as prescribed by ISO 7726.
 *
 * References:
 *   - ISO 7726:1998. Ergonomics of the thermal environment - Instruments for measuring physical quantities.
 *     ISO, Geneva.
 *   - Thorsson S., Lindberg F., Eliasson I., Holmer B. (2007). Different methods for estimating the mean
 *     radiant temperature in an outdoor urban setting. Int. J. Climatol. 27: 1983-1993. doi:10.1002/joc.1537
 * @param {number} t          air temperature (degC)
 * @param {number} tg         globe temperature (degC)
 * @param {number} wind       wind speed at globe level (m/s)
 * @param {number} [diam_globe=0.05] globe diameter in meters (standard Vernon globe = 0.15)
 * @param {number} [emis_globe=0.97] globe emissivity
 * @return {number} mean radiant temperature (degC), NaN if not physically defined
 */

function mrt_globe(t, tg, wind, diam_globe, emis_globe) {
  if (diam_globe === undefined) {
    diam_globe = 0.05;
  }
  if (emis_globe === undefined) {
    emis_globe = 0.97;
  }

  var stefanb = 5.67e-8;
  var dT = tg - t;

  var hc_forced = (6.3 * Math.pow(wind, 0.6)) / Math.pow(diam_globe, 0.4);
  var hc_natural = 1.4 * Math.pow(Math.abs(dT) / diam_globe, 0.25);
  var hc = Math.max(hc_forced, hc_natural);

  var x = Math.pow(tg + 273.15, 4) + (hc / (emis_globe * stefanb)) * dT;
  if (x <= 0) {
    return NaN;
  }

  return Math.pow(x, 0.25) - 273.15;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Psycrometrics related functions.

/**
 * Given air temperature (Celsius), relative humidity (%)  gives natural wetbulb in celsius degrees.
 * Formulation from Stull 2011, Journal of Applied Meteorology and Climatology.
 *
 * References:
 *   - Stull R. (2011). Wet-bulb temperature from relative humidity and air temperature. J. Appl. Meteor.
 *     Climatol. 50: 2267-2269. doi:10.1175/JAMC-D-11-0143.1
 * @param {number} t,rh
 * @return {number}
 */

function wetbulb_stull(t, rh) {
  var c = new Array(6);
  c[0] = 0.151977;
  c[1] = 8.313659;
  c[2] = 1.676331;
  c[3] = 0.00391838;
  c[4] = 0.023101;
  c[5] = 4.686035;

  var wetbulb =
    t * Math.atan(c[0] * Math.sqrt(rh + c[1])) +
    Math.atan(t + rh) -
    Math.atan(rh - c[2]) +
    c[3] * Math.pow(rh, 3 / 2) * Math.atan(c[4] * rh) -
    c[5];
  return wetbulb;
}

/**
 * References:
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 */

function fnatural_wetbulb(Twb_prev, Tair, rh, wspeed, solar, zenith, pair, alb_sfc, fdir, irad) {
  if (alb_sfc === undefined) {
    alb_sfc = 0.4;
  }
  if (fdir === undefined) {
    fdir = 0.8;
  }
  if (irad === undefined) {
    irad = 1;
  }

  var dT, Tref, h, Twb, Fatm, density, eair;
  var speedmin = 0.13;
  var emis_sfc = 0.999;
  var stefanb = 0.000000056696;

  /* heat capaticy of dry air at constant pressure */

  var cp = 1003.5;
  var m_air = 28.97;
  var m_h2o = 18.015;
  var r_gas = 8314.34;
  var r_air = r_gas / m_air;
  var ratio = (cp * m_air) / m_h2o;
  var Pr = cp / (cp + 1.25 * r_air);

  // Wick constants

  var emis_wick = 0.95; // emissivity
  var alb_wick = 0.4; // albedo
  var diam_wick = 0.007; // diameter (in m)
  var len_wick = 0.0254; // length (in m)

  // Globe constants

  var Tsfc = Tair;
  var RH = rh * 0.01;
  var emis_air = emis_atm(Tair, RH);
  eair = RH * esat(Tair);
  Tref = 0.5 * (Twb_prev + Tair);

  // Radiative heating term

  Fatm =
    stefanb *
      emis_wick *
      (0.5 * (emis_air * Math.pow(Tair, 4) + emis_sfc * Math.pow(Tsfc, 4)) - Math.pow(Twb_prev, 4)) +
    (1 - alb_wick) *
      solar *
      ((1 - fdir) * (1 + (0.25 * diam_wick) / len_wick) +
        (Math.tan(zenith) / 3.1416 + (0.25 * diam_wick) / len_wick) * fdir +
        alb_sfc);

  // Schmidt number

  density = (pair * 100) / (Tair * r_air);

  var Sc = viscosity(Tair) / (density * diffusivity(Tref, pair));

  // Calculate the convective heat transfer coefficient for a long cylinder in cross flow

  h = h_cylinder_in_air(Twb_prev, wspeed, pair, speedmin, diam_wick);

  // Calculate the saturation vapor pressure (hPa) over liquid water

  var ewick = esat(Twb_prev);

  // Calculate the heat of evaporation, J/(kg K)

  var evap = h_evap(Twb_prev);

  Twb =
    Tair - (evap / ratio) * ((ewick - eair) / (pair - ewick)) * Math.pow(Pr / Sc, 0.56) + (Fatm / h) * irad;

  dT = Twb - Twb_prev;

  return Math.abs(dT);
}

/**
 *  Given t air temperature (degC), rh relative humidity (%) , wspeed as wind speed in m/s,
 *  solar as global radiation in  Watt/mq, solar zenith in radians, pair Air Pressure in millibar (hPa),
 *  alb_sfc as the mean albedo of surrounding surfaces, fdir is the ratio between diffuse and directed radiation,
 *  irad is 1 if the radiation is taken into account , diam is the diameter of heat globe in meters,
 *  maxair and minair are  the range respect to air temperature where  solution was searched and prec is the precision
 *  gives natural wetbulb temperature.
 *
 * References:
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 *  @param {number} t,rh,wind,solar,zenith,pair,alb_sfc,fdir,irad,diam,maxair,minair,prec
 *  @return {number}
 */

function natural_wetbulb(t, rh, wspeed, solar, zenith, pair, alb_sfc, fdir, irad, maxair, minair, prec) {
  if (zenith === undefined) {
    zenith = 0.0000000001;
  }
  if (zenith <= 0) {
    zenith = 0.0000000001;
  }
  if (zenith > 1.57) {
    zenith = 1.57;
  }

  if (wspeed === undefined) {
    wspeed = 0.13;
  }
  if (solar === undefined) {
    solar = 0;
  }
  if (minair === undefined) {
    minair = 2;
  }
  if (maxair === undefined) {
    maxair = 10;
  }
  if (pair === undefined) {
    pair = 1010;
  }
  if (alb_sfc === undefined) {
    alb_sfc = 0.4;
  }
  if (fdir === undefined) {
    fdir = 0.8;
  }
  if (irad === undefined) {
    irad = 1;
  }
  if (prec === undefined) {
    prec = 0.1;
  }

  var Tair = t + 273.15;
  var Twb_prev = dewpoint(t, rh) + 273.15;
  var map1 = [];
  var array1 = linspace(Twb_prev - minair, Tair + maxair, prec);
  for (var i = 0; i < array1.length; i++) {
    map1[i] = fnatural_wetbulb(array1[i], Tair, rh, wspeed, solar, zenith, pair);
  }
  return array1[arrayMinIndex(map1)] - 273.15;
}

/**
 * Purpose: to calculate the convective h the heat tranfer coefficient for flow around a sphere. tk (Kelvin),
 * speed as wind speed in m/s, pair air pressure in millibar(hPa) , the minimal wind speed and diameter of the globe.
 * Reference; BSL, page 23.;
 *
 * References:
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 *   - Bird R.B., Stewart W.E., Lightfoot E.N. (2002). Transport Phenomena, 2nd ed. Wiley, New York.
 * @param {number} t, speed,pair,speedmin,diam_globe;
 * @return {number}
 */

function h_sphere_in_air(tk, speed, pair, speedmin, diam_globe) {
  if (diam_globe === undefined) {
    diam_globe = 0.05;
  }
  if (speedmin === undefined) {
    speedmin = 0.13;
  }
  if (pair === undefined) {
    pair = 1013.25;
  }
  var Rair = 8314.34 / 28.97;
  var Pr = 1003.5 / (1003.5 + 1.25 * Rair);
  var thermal_con = (1003.5 + (1.25 * 8314.34) / 28.97) * viscosity(tk);
  var density = (pair * 100) / (Rair * tk); // kg/m3;
  if (speed < speedmin) {
    speed = speedmin;
  }
  var Re = (speed * density * diam_globe) / viscosity(tk);
  var Nu = 2 + 0.6 * Math.pow(Re, 0.5) * Math.pow(Pr, 0.3333);
  return (Nu * thermal_con) / diam_globe; // W/(m2 K);
}

/**
 * Purpose: to calculate the convective heat tranfer coefficient for heat flow around a cylinder tk in degK
 * and air pressure in millibar(hPa).
 * Reference : Bird, Stewart, && Lightfoot (BSL), page 409.;
 *
 * References:
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 *   - Bird R.B., Stewart W.E., Lightfoot E.N. (2002). Transport Phenomena, 2nd ed. Wiley, New York.
 * @param {number} t, speed,pair,speedmin,diam_globe
 * @return {number}
 */

function h_cylinder_in_air(tk, speed, pair, speedmin, diam_wick) {
  if (diam_wick === undefined) {
    diam_wick = 0.007;
  }
  if (speedmin === undefined) {
    speedmin = 0.13;
  }
  if (pair === undefined) {
    pair = 1010;
  }

  var m_air = 28.97;
  var r_gas = 8314.34;
  var r_air = r_gas / m_air;
  var cp = 1003.5; // heat capaticy at constant pressure of dry air
  var Pr = cp / (cp + 1.25 * r_air);

  // Calculate the thermal conductivity of air, W/(m K)

  var thermal_con = (cp + (1.25 * r_gas) / m_air) * viscosity(tk);

  // Density of the air

  var density = (pair * 100) / (r_air * tk);

  if (speed < speedmin) {
    speed = speedmin;
  }

  // Reynolds number

  var Re = (speed * density * diam_wick) / viscosity(tk);

  //  Nusselt number

  var Nu = 0.281 * Math.pow(Re, 0.6) * Math.pow(Pr, 0.44);

  // Convective heat transfer coefficient in W/(m2 K) for a long cylinder in cross flow
  var h_cylinder_in_air = (Nu * thermal_con) / diam_wick;

  return h_cylinder_in_air;
}

/**
 * Given a air temperature tk (degK) calculate the heat of evaporation.
 * Purpose: to calculate the convective heat tranfer coefficient for flow around a sphere.; t in K
 * Reference : Bird, Stewart, && Lightfoot (BSL), page 409.;

 *
 * References:
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 * @param {number} tk
 * @return {number}
 */

function h_evap(tk) {
  var evap = ((313.15 - tk) / 30) * -71100 + 2407300;
  return evap;
}

/**
 * Given a air emissivity by using temperature in degK and relative umidity ( number)
 * Purpose: to calculate the convective heat tranfer coefficient for flow around a sphere.; t in K
 * Reference; Oke (2nd edition), page 373.;
 *
 * References:
 *   - Oke T.R. (1987). Boundary Layer Climates, 2nd ed. Methuen/Routledge, London.
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 * @param {number} tk,rh
 * @return {number}
 */

function emis_atm(tk, rh) {
  var e = rh * esat(tk);
  return 0.575 * Math.pow(e, 0.143);
}

/**
 * Calculate the saturation vapor pressure (mb) over liquid water given the temperature (degK).;
 * Reference Buck's (1981) approximation (eqn 3) of Wexler's (1976) formulae.;
 *
 * References:
 *   - Buck A.L. (1981). New equations for computing vapor pressure and enhancement factor. J. Appl. Meteor.
 *     20: 1527-1532.
 * @param {number} tk
 * @return {number}

 */

function esat(tk) {
  var esat = 1.004 * (6.1121 * Math.exp((17.502 * (tk - 273.15)) / (tk - 32.18)));
  return esat;
}

/**
 * Given a air temperature tk (degK) compute the viscosity of air in kg/(m s).
 * Reference; BSL, page 23.;
 *
 * References:
 *   - Bird R.B., Stewart W.E., Lightfoot E.N. (2002). Transport Phenomena, 2nd ed. Wiley, New York.
 * @param {number} tk
 * @return {number}
 */

function viscosity(tk) {
  var omega = ((tk / 97 - 2.9) / 0.4) * -0.034 + 1.048;
  return (0.0000026693 * Math.pow(28.97 * tk, 0.5)) / (3.617 * 3.617 * omega);
}

/**
 * Given a air temperature tk (degK) and air pressure in millibar (hPa) compute the heat diffusivity in air.
 * Reference; BSL, page 23.;
 *
 * References:
 *   - Bird R.B., Stewart W.E., Lightfoot E.N. (2002). Transport Phenomena, 2nd ed. Wiley, New York.
 * @param {number} tk, pairt
 * @return {number}
 */

function diffusivity(tk, pair) {
  if (pair === undefined) {
    pair = 1013.25;
  }

  var pcrit13 = Math.pow(36.4 * 218, 1 / 3);
  var tcrit512 = Math.pow(132 * 647.3, 5 / 12);
  var Tcrit12 = Math.pow(132 * 647.3, 0.5);
  var Mmix = Math.pow(1 / 28.97 + 1 / 18.015, 0.5);
  var diffusivity =
    ((0.000364 * Math.pow(tk / Tcrit12, 2.334) * pcrit13 * tcrit512 * Mmix) / (pair / 1013.25)) * 0.0001;
  return diffusivity;
}

/**
 * Given a air temperature t (degC) and td dewpoint  (degC) compute the relative humidity
 * Reference; BSL, page 23.;
 *
 * References:
 *   - Hardy B. (1998). ITS-90 formulations for vapor pressure, frostpoint temperature, dewpoint temperature,
 *     and enhancement factors in the range -100 to +100 C. Proc. 3rd Int. Symp. on Humidity & Moisture, NPL,
 *     Teddington, pp. 214-221.
 * @param {number} t, td
 * @return {number}
 */

function fRH(t, td) {
  var rh;
  rh = 100 * (es(td) / es(t));
  return rh;
}

/*
 * Given air temperature T (Celsius)  function gives Saturation Vapor Pressure for Ice . Dimension of outcomes in Pascal (hPa)
 * Saturation Vapor Pressure formula for range -100..0 Deg. C.
 * Hardy B, 1998,"ITS-90 Formulations for Vapor Pressure, Frostpoint Temperature,Dewpoint Temperature, and Enhancement Factors in the Range 100 to +100 C".
 * Proceedings of the Third International Symposium on Humidity & Moisture",Teddington, London, England, April 1998
 *
 * References:
 *   - Hardy B. (1998). ITS-90 formulations for vapor pressure, frostpoint temperature, dewpoint temperature,
 *     and enhancement factors in the range -100 to +100 C. Proc. 3rd Int. Symp. on Humidity & Moisture, NPL,
 *     Teddington, pp. 214-221.
 */

function pvsIce(T) {
  var k0 = -5.8666426e3;
  var k1 = 2.232870244e1;
  var k2 = 1.39387003e-2;
  var k3 = -3.4262402e-5;
  var k4 = 2.7040955e-8;
  var k5 = 6.7063522e-1;
  var lnP = k0 / T + k1 + (k2 + (k3 + k4 * T) * T) * T + k5 * Math.log(T);
  return Math.exp(lnP);
}

/**
 * Given air temperature T (deC)  function gives Saturation Vapor Pressure. Dimension of outcomes in kiloPascal (kPa)
 * Saturation Vapor Pressure formula for range 273..678 Deg. K.
 * Equation (30) in Section 8.1 "The Saturation-Pressure Equation (Basic Equation),Erlangen, Germany, September 1997.
 *
 * References:
 *   - IAPWS (1997). Revised Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties
 *     of Water and Steam (IAPWS-IF97), eq. 30. Erlangen.
 * @param {number} T
 * @return {number}
 */

function pvsWater(T) {
  var n1 = 0.11670521452767e4;
  var n6 = 0.1491510861353e2;
  var n2 = -0.72421316703206e6;
  var n7 = -0.48232657361591e4;
  var n3 = -0.17073846940092e2;
  var n8 = 0.40511340542057e6;
  var n4 = 0.1202082470247e5;
  var n9 = -0.23855557567849;
  var n5 = -0.32325550322333e7;
  var n10 = 0.65017534844798e3;

  var th = T + n9 / (T - n10);
  var A = (th + n1) * th + n2;
  var B = (n3 * th + n4) * th + n5;
  var C = (n6 * th + n7) * th + n8;

  var p = (2 * C) / (-B + Math.sqrt(B * B - 4 * A * C));
  p *= p;
  p *= p;
  return p * 1e6;
}

/**
 * Given air temperature T (Celsius)  function gives Saturation Vapor Pressure. Dimension of outcomes in Pascal (hPa)
 *
 *
 * References:
 *   - Hardy B. (1998). ITS-90 formulations for vapor pressure, frostpoint temperature, dewpoint temperature,
 *     and enhancement factors in the range -100 to +100 C. Proc. 3rd Int. Symp. on Humidity & Moisture, NPL,
 *     Teddington, pp. 214-221.
 *   - IAPWS (1997). Revised Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties
 *     of Water and Steam (IAPWS-IF97), eq. 30. Erlangen.
 * @param {number} t
 * @return {number}
 */

function PVS(t) {
  t = t + 273.16;
  var minT = 173; // -100 Deg. C.
  var maxT = 678;
  var noresp = -9999;
  var pvsresp;

  if (t < minT || t > maxT) {
    return noresp;
  } else if (t < 273.15) {
    pvsresp = pvsIce(t) / 100;
  } else {
    pvsresp = pvsWater(t) / 100;
  }

  return TwoDec(pvsresp);
}

/**
 * Given air temperature (Celsius), relative humidity (%) and pressure ( pa) give deficit of saturation in delta hPA
 *
 * @param {number} t,rh
 * @return {number}
 */

function deficitsat(t, rh) {
  var pws = PVS(t);
  var pae = (rh / 100) * pws;
  return pws - pae;
}

/**
 * Given air temperature (Celsius) gives  saturation  pressure in hPa.
 *
 * References:
 *   - Hardy B. (1998). ITS-90 formulations for vapor pressure, frostpoint temperature, dewpoint temperature,
 *     and enhancement factors in the range -100 to +100 C. Proc. 3rd Int. Symp. on Humidity & Moisture, NPL,
 *     Teddington, pp. 214-221.
 * @param {number} t,rh
 * @return {number}
 */

function es(t) {
  var es_air, tk, i;
  var g = new Array(8);
  g[0] = -2.8365744e3;
  g[1] = -6.028076559e3;
  g[2] = 1.954263612e1;
  g[3] = -2.737830188e-2;
  g[4] = 1.6261698e-5;
  g[5] = 7.0229056e-10;
  g[6] = -1.8680009e-13;
  g[7] = 2.7150305;

  tk = t + 273.15;

  es_air = g[7] * Math.log(tk);

  for (var i = 0; i < 7; i++) {
    es_air = es_air + g[i] * Math.pow(tk, i - 2);
  }

  var es = Math.exp(es_air) * 0.01;

  return es;
}

/**
 * Given air temperature (Celsius), relative humidity (%).
 * @param {number} t,rh
 * @return {number}
 */

function pvap(t, rh) {
  var E;
  E = es(t) * (rh / 100);
  return E;
}

/**
 *  Given a air temperature t (degC) and air relative humidity  (rh)  and formula give the dew-point in degC.
 *
 * References:
 *   - Alduchov O.A., Eskridge R.E. (1996). Improved Magnus form approximation of saturation vapor pressure. J.
 *     Appl. Meteor. 35: 601-609.
 *   - Sonntag D. (1990). Important new values of the physical constants of 1986, vapour pressure formulations
 *     based on the ITS-90, and psychrometer formulae. Z. Meteorol. 40(5): 340-344.
 *  @param {number} t,rh,formula
 *  @return {number}
 */

function dewpoint(t, rh, formula) {
  if (formula == undefined) {
    formula = "NOAA";
  }
  var RHD = rh / 100;
  if (formula == "Paroscientific") {
    return (
      (237.3 * (Math.log(RHD) / 17.27 + t / (237.3 + t))) / (1 - Math.log(RHD) / 17.27 - t / (237.3 + t))
    );
  } else if (formula == "Sonntag") {
    return (
      (243.12 * (Math.log(RHD) / 17.62 + t / (243.12 + t))) / (1 - Math.log(RHD) / 17.62 - t / (243.12 + t))
    );
  } else {
    return (
      (243.5 * (Math.log(RHD) / 17.67 + t / (243.5 + t))) / (1 - Math.log(RHD) / 17.67 - t / (243.5 + t))
    );
  }
}

/**
 * Calculates the humidity ratio of air/water vapor mixture.  
 * Based on formula in the ASHRAE Handbook of Fundamentals.  
 * Inputs is water vapor pressure [hPa]. Assume aipr=1013.25 [hPa]  
 * output : function = humidity ratio  
 *
 * References:
 *   - ASHRAE (2005/2017). ASHRAE Handbook - Fundamentals, ch. 1 Psychrometrics. ASHRAE, Atlanta.
 * @param {number} p,pa
 * @return {number}
 */

function humrat(p, pa) {
  var y;
  y = (0.62198 * p) / (pa - p);
  return y;
}

/**
 * Calculates the enthalpy of air/water vapor mixture [kJ/kg]  
 * Inputs are dry-bulb temperature [C] and humidity ratio (unitless).  
 *
 * References:
 *   - ASHRAE (2005/2017). ASHRAE Handbook - Fundamentals, ch. 1 Psychrometrics. ASHRAE, Atlanta.
 * @param {number} t,hum_ratio
 * @return {number}
 */

function enthalpy(t, hum_ratio) {
  var y;
  y = 1.006 * t + hum_ratio * (2501.0 + 1.805 * t);
  return y;
}

/**
 * Gets the specific volume of air/water vapor mixture [m^3/kg]
 *
 * References:
 *   - ASHRAE (2005/2017). ASHRAE Handbook - Fundamentals, ch. 1 Psychrometrics. ASHRAE, Atlanta.
 * input: t dry_bulb temperature [C], hum_ratio humidity ratio [unitless],pair air pressure  [hPa].                       * @param {number} t,hum_ratio,pa
 * @return {number}
 */

function spvol(t, hum_ratio, pa) {
  var tk, y;
  tk = t + 273.16;
  y = (287.055 * tk * (1 + 1.6078 * hum_ratio)) / (pa * 100.0);
  return y;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Metabolic section

/**
 * Given a temperature t (Celsius) and return the metabolism useful for pmv_hoppe_iso function.
 * @param {number} t
 * @return {number}
 */

function metabolism(t) {
  return -3.0909 * t + 203.64;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Thermal Confort index section

/**
 * Given PMV value and Metabolic energy production M (58 to 400 W/m2) return the PPD Index ISO 7730.
 *
 * References:
 *   - ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of
 *     thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria. ISO,
 *     Geneva.
 * @param {number} PMV
 * @return {number}
 */

function PPD(PMV) {
  var PPD = 100 - 95 * Math.exp(-0.03353 * Math.pow(PMV, 4) - 0.2179 * Math.pow(PMV, 2));
  return Math.round(PPD * 10) / 10;
}

/**
 * Given PMV and metabolic rate the heat body balance is done following ISO 7730 PMV's scheme.
 *
 *
 * References:
 *   - ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of
 *     thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria. ISO,
 *     Geneva.
 * @param {number} pmv,m
 * @return {number}
 */

function balancePMV7730(pmv, M) {
  var balance = pmv / (0.303 * Math.exp(-0.036 * M) + 0.028);
  return balance;
}

/**
 * Given antropometric features ( body mass,age, height and gender) give custom basal metabolic rate/
 * request for a day Harris Benedict Equation (cal/day) , kJ and divided for daily seconds Watt but already normalized for Adu.
 *
 * References:
 *   - Harris J.A., Benedict F.G. (1918). A biometric study of human basal metabolism. PNAS 4(12): 370-373.
 * @param {number} mbody,age,ht,gender
 * @return {number}
 */
function HB_bmr_met(mbody, age, ht, gender) {
  var bmr;
  var adu = 0.203 * Math.pow(mbody, 0.425) * Math.pow(ht, 0.725);

  if (gender == "female") {
    // Female
    bmr = 655.0955 + 9.5634 * mbody + 1.8496 * (ht * 100) - 4.6756 * age;
  } else {
    // Male
    bmr = 66.473 + 13.7516 * mbody + 5.0033 * (ht * 100) - 6.755 * age;
  }
  var metb = (bmr * 4.1868 * 1000) / (24 * 60 * 60); // in Watt
  return metb / adu;
}

/**
 * Given a temperature t (degC), relative humidity rh (%), wind ( m/sec), mean radiant temperature mtrad (degC)
 * and clothing insulation level (clo) gives PMV following Hoppe scheme for a customized person.
 *
 * References:
 *   - Fanger P.O. (1970). Thermal Comfort: Analysis and Applications in Environmental Engineering. Danish
 *     Technical Press, Copenhagen.
 *   - Hoppe P. (1984). Die Energiebilanz des Menschen. Wiss. Mitt. Meteorol. Inst. Univ. Muenchen 49.
 *   - Harris J.A., Benedict F.G. (1918). A biometric study of human basal metabolism. PNAS 4(12): 370-373.
 * @param {number} ta
 * @return {number}
 */

function PMV_custom(t, rh, wind, mtrad, iclo, age, mbody, ht, gender) {
  var eta = 0.01; // Mechanical efficiency
  var tcl = 30.005;
  var MAX_LOOP = 200;
  var MAX_LOOP_HALF = MAX_LOOP / 2;
  var tcl_eps = 0.05;
  var eps = 0.97;
  var sigm = 5.67e-8;
  var vpa, fcl, metm, metf, metb, h, aef, p1, tcl1, tcl2;
  var hc, diff, abhc, abtcl, difhc, tsk, esw, rsum, csum;
  var erel, eres, ed, load, ts, bmr, icl;

  var adu = 0.203 * Math.pow(mbody, 0.425) * Math.pow(ht, 0.725);

  if (gender == "female") {
    // Female
    bmr = 655.0955 + 9.5634 * mbody + 1.8496 * (ht * 100) - 4.6756 * age;
  } else {
    // Male
    bmr = 66.473 + 13.7516 * mbody + 5.0033 * (ht * 100) - 6.755 * age;
  }

  var metb = (bmr * 4.1868 * 1000) / (24 * 60 * 60); // Person global metabolic request for a day Harris Benedict Equation (cal/day) -> kJ and divided for daily seconds Watt but already normalized for Adu.

  vpa = (rh / 100) * 6.105 * Math.pow(2.718281828, (17.27 * t) / (237.7 + t));

  icl = iclo * 0.155;

  if (icl <= 0.078) {
    fcl = 1 + 1.29 * icl;
  } else {
    fcl = 1.05 + 0.645 * icl;
  }

  h = metb * adu;

  aef = 0.71 * fcl * adu;

  var tcl_guess = 35.7 - 0.032 * (metb / adu); // Initial clothing temperature

  tcl1 = tcl;
  for (var i = 0; i < MAX_LOOP; i++) {
    if (i < MAX_LOOP_HALF) {
      hc = 12.06 * Math.sqrt(wind);
      abhc = 0.0;
    } else {
      hc = 2.38 * Math.pow(Math.abs(tcl1 - t), 0.25); // natural convection, ISO 7730
      abhc = 0.6 * Math.abs(Math.pow(tcl1 - t, -0.75));
    }
    tcl2 =
      tcl_guess -
      0.155 *
        iclo *
        (3.94 * 0.00000001 * fcl * (Math.pow(tcl1 + 273.2, 4.0) - Math.pow(mtrad + 273.2, 4.0)) +
          fcl * hc * (tcl1 - t));
    diff = Math.abs(tcl1 - tcl2);
    if (diff < tcl_eps) break;
    abtcl =
      -0.155 *
        iclo *
        (4.0 * 3.94 * 0.00000001 * fcl * Math.pow(tcl1 + 273.2, 3.0) + fcl * hc - fcl * (tcl1 - t) * abhc) -
      1.0;
    tcl1 = tcl1 - (tcl2 - tcl1) / abtcl;
    difhc = 12.06 * Math.sqrt(wind) - 2.38 * Math.pow(Math.abs(t - tcl1), 0.25);
    if (difhc > 0.0 && i == MAX_LOOP_HALF) break;
  }
  tsk = 35.7 - (0.028 * h) / adu; // Initial tskin temperature
  esw = 0.42 * adu * (h / adu - 58.08);
  esw = esw < 0.0 ? 0.0 : esw;
  rsum = aef * eps * sigm * (Math.pow(tcl1 + 273.2, 4.0) - Math.pow(mtrad + 273.2, 4.0));
  csum = adu * fcl * hc * (tcl1 - t);
  erel = 0.0023 * metb * (44.0 - 0.75 * vpa);
  eres = 0.0014 * metb * (34.0 - t);
  ed = 0.406 * adu * (1.92 * tsk - 25.3 - 0.75 * vpa);
  load = (h - ed - erel - eres - esw - rsum - csum) / adu;
  ts = 0.303 * Math.exp(-0.036 * (h / adu)) + 0.028;
  var pmv = ts * load;
  return TwoDec(pmv);
}

/**
 * Perceived temperature (degC) following the PMV-based equivalent-temperature concept
 * (Jendritzky / Klima-Michel model, with fixed clothing): the air temperature of a reference
 * environment (mean radiant temperature = air temperature, wind 0.1 m/s, rh 50%) in which a person
 * with the same metabolic rate, work and clothing would have the same ISO 7730 PMV as in the actual one.
 *
 * References:
 *   - Staiger H., Laschewski G., Graetz A. (2012). The perceived temperature - a versatile index for the
 *     assessment of the human thermal environment. Part A: scientific basics. Int. J. Biometeorol. 56:
 *     165-176. doi:10.1007/s00484-011-0409-6
 *   - ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of
 *     thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria. ISO,
 *     Geneva.
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} wind wind speed (m/s)
 * @param {number} tr   mean radiant temperature (degC)
 * @param {number} [M=58.15] metabolic rate (W/m2)
 * @param {number} [W=0]     external work (W/m2)
 * @param {number} clo  clothing insulation (clo)
 * @return {number} perceived temperature (degC), NaN if no solution in [-60, 60] degC
 */

function perceived_temperature(t, rh, wind, tr, M, W, clo) {
  if (M === undefined) {
    M = 58.15;
  }
  if (W === undefined) {
    W = 0;
  }
  var rh_ref = 50;
  var wind_ref = 0.1;
  var target = pmv_iso7730_raw(t, rh, wind, tr, M, W, clo);
  if (isNaN(target)) {
    return NaN;
  }
  var f = function (tref) {
    return pmv_iso7730_raw(tref, rh_ref, wind_ref, tref, M, W, clo) - target;
  };
  var lo = -60,
    hi = 60;
  var flo = f(lo),
    fhi = f(hi);
  if (isNaN(flo) || isNaN(fhi) || flo * fhi > 0) {
    return NaN;
  }
  // bisection: PMV increases monotonically with the reference temperature
  for (var i = 0; i < 60 && hi - lo > 0.001; i++) {
    var mid = 0.5 * (lo + hi);
    var fmid = f(mid);
    if (isNaN(fmid)) {
      return NaN;
    }
    if (fmid * flo > 0) {
      lo = mid;
      flo = fmid;
    } else {
      hi = mid;
    }
  }
  return TwoDec(0.5 * (lo + hi));
}

/**
 * Physiological Equivalent Temperature (PET, degC), steady-state MEMI model as corrected by
 * Walther & Goestchel (2018). JavaScript port of pet_steady() from pythermalcomfort v4.8
 * (MIT License, Copyright (c) 2019 Federico Tartarini), including its parameter conventions.
 * Defaults describe the standard PET person (male, 35 years, 75 kg, 1.75 m, standing,
 * 80 W of activity, 0.9 clo); note that pythermalcomfort's own defaults differ (sitting, 23 years,
 * 1.8 m). Values can differ from the original Hoeppe routine (PET_Hoppe, file pet_hoppe.js) by a few K.
 *
 * References:
 *   - Walther E., Goestchel Q. (2018). The P.E.T. comfort index: Questioning the model. Build. Environ.
 *     137: 1-10. doi:10.1016/j.buildenv.2018.03.054
 *   - Hoeppe P. (1999). The physiological equivalent temperature - a universal index for the
 *     biometeorological assessment of the thermal environment. Int. J. Biometeorol. 43: 71-75.
 *     doi:10.1007/s004840050118
 *   - Tartarini F., Schiavon S. (2020). pythermalcomfort: A Python package for thermal comfort research.
 *     SoftwareX 12: 100578. doi:10.1016/j.softx.2020.100578
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} wind air speed (m/s)
 * @param {number} tmrt mean radiant temperature (degC)
 * @param {number} [met=1.3746] activity in met; as in pythermalcomfort it is multiplied by 58.2 and
 *                 added (as W) to the basal metabolism, so the default corresponds to 80 W
 * @param {number} [clo=0.9] clothing insulation (clo)
 * @param {number} [pair=1013.25] air pressure (hPa)
 * @param {string} [position="standing"] "standing", "sitting" or "standing, forced convection"
 * @param {number} [age=35] age (years)
 * @param {string} [sex="male"] "male" or "female"
 * @param {number} [weight=75] body mass (kg)
 * @param {number} [height=1.75] height (m)
 * @param {number} [wme=0] external work fraction (0-1)
 * @return {number} PET (degC), rounded to 2 decimals
 */
function PET_Walther(t, rh, wind, tmrt, met, clo, pair, position, age, sex, weight, height, wme) {
  if (met === undefined) met = 80 / 58.2;
  if (clo === undefined) clo = 0.9;
  if (pair === undefined) pair = 1013.25;
  if (position === undefined) position = "standing";
  if (age === undefined) age = 35;
  if (sex === undefined) sex = "male";
  if (weight === undefined) weight = 75;
  if (height === undefined) height = 1.75;
  if (wme === undefined) wme = 0;
  if (isNaN(t) || isNaN(rh) || isNaN(wind) || isNaN(tmrt) || isNaN(pair)) {
    return NaN;
  }

  var metW = met * 58.2;

  // saturation vapour pressure (Pa), ASHRAE (Hyland & Wexler 1983) as in pythermalcomfort
  function p_sat(tdb) {
    var tk = tdb + 273.15;
    if (tk < 273.15) {
      return Math.exp(
        -5674.5359 / tk +
          6.3925247 +
          tk * (-0.9677843e-2 + tk * (0.62215701e-6 + tk * (0.20747825e-8 + -0.9484024e-12 * tk))) +
          4.1635019 * Math.log(tk)
      );
    }
    return Math.exp(
      -5800.2206 / tk +
        1.3914993 +
        tk * (-0.048640239 + tk * (0.41764768e-4 + tk * -0.14452093e-7)) +
        6.5459673 * Math.log(tk)
    );
  }

  // skin blood flow (L/m2/h) and core/skin mass repartition
  function vasomotricity(t_cr, t_sk) {
    var sig_skin = 34 - t_sk;
    var sig_core = t_cr - 36.6;
    if (sig_core < 0) sig_core = 0;
    if (sig_skin < 0) sig_skin = 0;
    var m_blood = (6.3 + 75.0 * sig_core) / (1.0 + 0.5 * sig_skin);
    if (m_blood > 90) m_blood = 90;
    var alpha = 0.0417737 + 0.7451833 / (m_blood + 0.585417);
    return { m_blood: m_blood, alpha: alpha };
  }

  // sweat rate (g/m2/h)
  function sweat_rate(t_body) {
    var sig_body = t_body - (0.1 * 34 + 0.9 * 36.6);
    if (sig_body < 0) sig_body = 0;
    return Math.min(304.94 * sig_body, 500);
  }

  // energy balance: vector [core, skin, clothing] (actual environment) or scalar (reference room)
  function solve_pet(t_arr, _tdb, _tr, _v, _rh, _met, _clo, actual) {
    var e_skin = 0.99,
      e_clo = 0.95,
      h_vap = 2.42e6,
      sbc = 5.67e-8,
      cb = 3640;
    var t_cr = t_arr[0],
      t_sk = t_arr[1],
      t_clo = t_arr[2];
    var a_dubois = 0.202 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
    var cube = (height * 100.0) / Math.pow(weight, 1 / 3);
    var met_correction =
      sex == "male"
        ? 3.45 * Math.pow(weight, 0.75) * (1.0 + 0.004 * (30.0 - age) + 0.01 * (cube - 43.4))
        : 3.19 * Math.pow(weight, 0.75) * (1.0 + 0.004 * (30.0 - age) + 0.018 * (cube - 42.1));
    var he = (_met + met_correction) / a_dubois;
    var h = he * (1.0 - wme);
    var i_m = 0.38;
    var fcl = 1 + 0.31 * _clo;
    var f_a_cl = (173.51 * _clo - 2.36 - 100.76 * _clo * _clo + 19.28 * Math.pow(_clo, 3)) / 100;
    var a_clo = a_dubois * f_a_cl + a_dubois * (fcl - 1.0);
    var f_eff = position == "standing" ? 0.696 : 0.725;
    var a_r_eff = a_dubois * f_eff;
    var vpa = actual ? ((_rh / 100.0) * p_sat(_tdb)) / 100 : 12; // hPa
    var hc = 2.67 + 6.5 * Math.pow(_v, 0.67);
    if (position == "standing") hc = 2.26 + 7.42 * Math.pow(_v, 0.67);
    if (position == "standing, forced convection") hc = 8.6 * Math.pow(_v, 0.513);
    hc = Math.max(3.0 * Math.pow(pair / 1013.25, 0.53), hc);
    hc = hc * Math.pow(pair / 1013.25, 0.55);
    // respiration
    var t_exp = 0.47 * _tdb + 21.0;
    var d_vent_pulm = he * 1.44e-6;
    var c_res = 1010 * (_tdb - t_exp) * d_vent_pulm;
    var vpexp = p_sat(t_exp) / 100;
    var q_res = ((0.623 * h_vap) / pair) * (vpa - vpexp) * d_vent_pulm;
    var ere = c_res + q_res;
    // tissues and clothing
    var vaso = vasomotricity(t_cr, t_sk);
    var tbody = vaso.alpha * t_sk + (1 - vaso.alpha) * t_cr;
    var r_cl = _clo / 6.45;
    var y = 0;
    f_a_cl = Math.min(f_a_cl, 1.0);
    if (_clo >= 2.0) y = 1.0;
    if (_clo > 0.6 && _clo < 2.0) y = (height - 0.2) / height;
    if (_clo <= 0.6 && _clo > 0.3) y = 0.5;
    if (_clo <= 0.3 && _clo > 0.0) y = 0.1;
    var r2 = (a_dubois * (fcl - 1.0 + f_a_cl)) / (6.28 * height * y);
    var r1 = (f_a_cl * a_dubois) / (6.28 * height * y);
    var di = r2 - r1;
    var htcl = (6.28 * height * y * di) / (r_cl * Math.log(r2 / r1) * a_clo);
    // sweating and vapour diffusion
    var esw = ((h_vap / 1000) * sweat_rate(tbody)) / 3600;
    var p_v_sk = p_sat(t_sk) / 100;
    var lr = 1.67; // Lewis ratio (K/hPa)
    var he_diff = hc * lr;
    var fecl = 1 / (1 + 0.92 * hc * r_cl);
    var e_max = he_diff * fecl * (p_v_sk - vpa);
    if (e_max == 0) e_max = 0.001;
    var w = esw / e_max;
    if (w > 1) {
      w = 1;
      if (esw - e_max < 0) esw = e_max;
    }
    esw = Math.max(esw, 0);
    var r_ecl = (1 / (fcl * hc) + r_cl) / (lr * i_m);
    var ediff = ((1 - w) * (p_v_sk - vpa)) / r_ecl;
    var evap = -(ediff + esw);
    // radiation and convection
    var r_bare =
      (a_r_eff * (1.0 - f_a_cl) * e_skin * sbc * (Math.pow(_tr + 273.15, 4) - Math.pow(t_sk + 273.15, 4))) /
      a_dubois;
    var r_clo =
      (f_eff * a_clo * e_clo * sbc * (Math.pow(_tr + 273.15, 4) - Math.pow(t_clo + 273.15, 4))) / a_dubois;
    var c_bare = (hc * (_tdb - t_sk) * a_dubois * (1.0 - f_a_cl)) / a_dubois;
    var c_clo = (hc * (_tdb - t_clo) * a_clo) / a_dubois;
    var blood = ((vaso.m_blood / 3600) * cb + 5.28) * (t_cr - t_sk);
    if (actual) {
      return [
        h + ere - blood,
        r_bare + c_bare + evap + blood - htcl * (t_sk - t_clo),
        c_clo + r_clo + htcl * (t_sk - t_clo)
      ];
    }
    return h + ere + r_clo + r_bare + c_clo + c_bare + evap;
  }

  // Newton-Raphson with numerical Jacobian and step halving for the 3 body temperatures
  function F(x) {
    return solve_pet(x, t, tmrt, wind, rh, metW, clo, true);
  }
  function norm(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }
  function solve3(A, b) {
    var M = [A[0].concat([b[0]]), A[1].concat([b[1]]), A[2].concat([b[2]])];
    for (var col = 0; col < 3; col++) {
      var piv = col;
      for (var r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
      var tmp = M[col];
      M[col] = M[piv];
      M[piv] = tmp;
      if (M[col][col] === 0) return null;
      for (var r2 = col + 1; r2 < 3; r2++) {
        var f = M[r2][col] / M[col][col];
        for (var k = col; k < 4; k++) M[r2][k] -= f * M[col][k];
      }
    }
    var x = [0, 0, 0];
    for (var i = 2; i >= 0; i--) {
      var s = M[i][3];
      for (var k2 = i + 1; k2 < 3; k2++) s -= M[i][k2] * x[k2];
      x[i] = s / M[i][i];
    }
    return x;
  }

  var x = [36.7, 34, 0.5 * (t + tmrt)];
  var fx = F(x);
  for (var iter = 0; iter < 200 && norm(fx) > 1e-9; iter++) {
    var J = [[], [], []];
    for (var jcol = 0; jcol < 3; jcol++) {
      var hstep = 1e-6 * Math.max(1, Math.abs(x[jcol]));
      var xh = x.slice();
      xh[jcol] += hstep;
      var fh = F(xh);
      for (var irow = 0; irow < 3; irow++) J[irow][jcol] = (fh[irow] - fx[irow]) / hstep;
    }
    var dx = solve3(J, [-fx[0], -fx[1], -fx[2]]);
    if (dx === null) break;
    var lambda = 1;
    var xn, fn;
    do {
      xn = [x[0] + lambda * dx[0], x[1] + lambda * dx[1], x[2] + lambda * dx[2]];
      fn = F(xn);
      lambda /= 2;
    } while (!(norm(fn) < norm(fx)) && lambda > 1e-6);
    x = xn;
    fx = fn;
  }
  // In uncompensable heat (e.g. very hot and humid air) the three balances have no exact solution:
  // as scipy's fsolve in pythermalcomfort, the closest approximate body state is used.
  if (isNaN(norm(fx))) {
    return NaN;
  }

  // PET: reference-room temperature giving the same (scalar) energy balance
  function g(tx) {
    return solve_pet(x, tx, tx, 0.1, 50, 80, 0.9, false);
  }
  var lo = x[2] - 1,
    hi = x[2] + 1;
  var glo = g(lo),
    ghi = g(hi);
  for (var e = 0; e < 60 && glo * ghi > 0; e++) {
    lo -= 2;
    hi += 2;
    glo = g(lo);
    ghi = g(hi);
  }
  if (glo * ghi > 0) {
    return NaN;
  }
  for (var b = 0; b < 100 && hi - lo > 1e-7; b++) {
    var mid = 0.5 * (lo + hi);
    var gm = g(mid);
    if (gm * glo > 0) {
      lo = mid;
      glo = gm;
    } else {
      hi = mid;
    }
  }
  return Math.round(0.5 * (lo + hi) * 100) / 100;
}

/**
 * Physiological Equivalent Temperature (PET, degC) following the original MEMI/PETBER routine
 * (translated from the PALM-4U / VDI 3787 Fortran code, GPL-3; see the file header)
 * of Hoeppe as given in VDI 3787 Part 2. Standard person: male, 35 years, 75 kg, 1.75 m,
 * 80 W of activity on top of basal metabolism, 0.9 clo, standing. Results are comparable with
 * RayMan and most of the PET literature.
 *
 * References:
 *   - Hoeppe P. (1999). The physiological equivalent temperature - a universal index for the
 *     biometeorological assessment of the thermal environment. Int. J. Biometeorol. 43: 71-75.
 *     doi:10.1007/s004840050118
 *   - Mayer H., Hoeppe P. (1987). Thermal comfort of man in different urban environments.
 *     Theor. Appl. Climatol. 38: 43-49.
 *   - VDI 3787 Part 2 (2008, rev. 2022). Environmental meteorology - Methods for the
 *     human-biometeorological evaluation of the thermal component of the climate. Beuth, Berlin.
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} wind wind speed (m/s)
 * @param {number} tmrt mean radiant temperature (degC)
 * @param {number} [pair=1013.25] air pressure (hPa)
 * @return {number} PET (degC), rounded to 2 decimals; NaN for missing inputs
 */
function PET_Hoppe(t, rh, wind, tmrt, pair) {
  if (pair === undefined) {
    pair = 1013.25;
  }
  if (isNaN(t) || isNaN(rh) || isNaN(wind) || isNaN(tmrt) || isNaN(pair)) {
    return NaN;
  }

  // constants
  var po = 1013.25; // reference air pressure (hPa)
  var rob = 1.06;
  var cb = 3640.0;
  var food = 0.0; // heat gain by food (W)
  var emsk = 0.99; // longwave emissivity of skin
  var emcl = 0.95; // longwave emissivity of clothing
  var evap = 2.42e6; // latent heat of evaporation (J/kg)
  var sigm = 5.67e-8; // Stefan-Boltzmann constant
  var cair = 1010.0;

  // standard person (MEMI configuration)
  var age = 35.0;
  var mbody = 75.0;
  var ht = 1.75;
  var work = 80.0;
  var eta = 0.0;
  var icl = 0.9;
  var fcl = 1.15;
  var pos = 1; // 1 = standing, 2 = sitting
  var sex = 1; // 1 = male, 2 = female

  var vpa = (rh * es(t)) / 100.0; // vapour pressure (hPa)

  // ---- internal body energy balance (in_body)
  var met =
    3.45 *
    Math.pow(mbody, 0.75) *
    (1 + 0.004 * (30 - age) + 0.01 * ((ht * 100) / Math.pow(mbody, 1 / 3) - 43.4));
  met = work + met;
  var h = met * (1 - eta);
  var tex = 0.47 * t + 21.0; // expired air temperature
  var rtv = 1.44e-6 * met; // respiratory volume
  var eres = cair * (t - tex) * rtv; // sensible respiration
  var vpex = 6.11 * Math.pow(10, (7.45 * tex) / (235 + tex));
  var erel = ((0.623 * evap) / pair) * (vpa - vpex) * rtv; // latent respiration
  var ere = eres + erel;

  // ---- heat exchange in the actual environment (heat_exch)
  var adu = 0.203 * Math.pow(mbody, 0.425) * Math.pow(ht, 0.725);
  var hc = (2.67 + 6.5 * Math.pow(wind, 0.67)) * Math.pow(pair / po, 0.55);
  var feff = pos == 2 ? 0.696 : 0.725;
  var facl = (-2.36 + 173.51 * icl - 100.76 * icl * icl + 19.28 * Math.pow(icl, 3)) / 100;
  if (facl > 1) {
    facl = 1;
  }
  var rcl = icl / 6.45 / facl;
  var y;
  if (icl >= 2) y = 1;
  if (icl > 0.6 && icl < 2) y = (ht - 0.2) / ht;
  if (icl <= 0.6 && icl > 0.3) y = 0.5;
  if (icl <= 0.3 && icl > 0) y = 0.1;
  var r2 = (adu * (fcl - 1 + facl)) / (2 * 3.14 * ht * y);
  var r1 = (facl * adu) / (2 * 3.14 * ht * y);
  var di = r2 - r1;

  var c = new Array(11);
  var tcore = [0, 0, 0, 0, 0, 0, 0, 0]; // index 1..7 used
  var tsk, tcl, acl, esw, wetsk, vpts, vb, sw, ed;
  var rdsk = 0.79e7;
  var rdcl = 0.0;

  for (var j = 1; j <= 7; j++) {
    tsk = 34.0;
    var count1 = 0;
    tcl = (t + tmrt + tsk) / 3;
    var count3 = 1;
    var enbal2 = 0.0;
    wetsk = 0;

    while (true) {
      acl = adu * facl + adu * (fcl - 1);
      var rclo2 = emcl * sigm * (Math.pow(tcl + 273.2, 4) - Math.pow(tmrt + 273.2, 4)) * feff;
      var htcl = (6.28 * ht * y * di) / (rcl * Math.log(r2 / r1) * acl);
      tsk = (1 / htcl) * (hc * (tcl - t) + rclo2) + tcl;

      // radiation
      var aeff = adu * feff;
      var rbare = aeff * (1 - facl) * emsk * sigm * (Math.pow(tmrt + 273.2, 4) - Math.pow(tsk + 273.2, 4));
      var rclo = feff * acl * emcl * sigm * (Math.pow(tmrt + 273.2, 4) - Math.pow(tcl + 273.2, 4));
      var rsum = rbare + rclo;

      // convection
      var cbare = hc * (t - tsk) * adu * (1 - facl);
      var cclo = hc * (t - tcl) * acl;
      var csum = cbare + cclo;

      // core temperature
      c[0] = h + ere;
      c[1] = adu * rob * cb;
      c[2] = 18 - 0.5 * tsk;
      c[3] = 5.28 * adu * c[2];
      c[4] = 0.0208 * c[1];
      c[5] = 0.76075 * c[1];
      c[6] = c[3] - c[5] - tsk * c[4];
      c[7] = -c[0] * c[2] - tsk * c[3] + tsk * c[5];
      c[8] = c[6] * c[6] - 4 * c[4] * c[7];
      c[9] = 5.28 * adu - c[5] - c[4] * tsk;
      c[10] = c[9] * c[9] - 4 * c[4] * (c[5] * tsk - c[0] - 5.28 * adu * tsk);

      if (tsk == 36) tsk = 36.01;
      tcore[7] = c[0] / (5.28 * adu + (c[1] * 6.3) / 3600) + tsk;
      tcore[3] = c[0] / (5.28 * adu + (c[1] * 6.3) / 3600 / (1 + 0.5 * (34 - tsk))) + tsk;
      if (c[10] >= 0) {
        tcore[6] = (-c[9] - Math.sqrt(c[10])) / (2 * c[4]);
        tcore[1] = (-c[9] + Math.sqrt(c[10])) / (2 * c[4]);
      }
      if (c[8] >= 0) {
        tcore[2] = (-c[6] + Math.sqrt(Math.abs(c[8]))) / (2 * c[4]);
        tcore[5] = (-c[6] - Math.sqrt(Math.abs(c[8]))) / (2 * c[4]);
        tcore[4] = c[0] / (5.28 * adu + (c[1] * 1) / 40) + tsk;
      }

      // transpiration
      var tbody = 0.1 * tsk + 0.9 * tcore[j];
      var swm = (304.94 * (tbody - 36.6) * adu) / 3600000;
      vpts = 6.11 * Math.pow(10, (7.45 * tsk) / (235 + tsk));
      if (tbody <= 36.6) swm = 0;
      sw = sex == 2 ? 0.7 * swm : swm;
      var eswphy = -sw * evap;
      var he = (0.633 * hc) / (pair * cair);
      var fec = 1 / (1 + 0.92 * hc * rcl);
      var eswpot = he * (vpa - vpts) * adu * evap * fec;
      wetsk = eswphy / eswpot;
      if (wetsk > 1) wetsk = 1;
      var eswdif = eswphy - eswpot;
      if (eswdif <= 0) esw = eswpot;
      if (eswdif > 0) esw = eswphy;
      if (esw > 0) esw = 0;

      // diffusion
      ed = (evap / (rdsk + rdcl)) * adu * (1 - wetsk) * (vpa - vpts);

      // skin blood flow
      var vb1 = 34 - tsk;
      var vb2 = tcore[j] - 36.6;
      if (vb2 < 0) vb2 = 0;
      if (vb1 < 0) vb1 = 0;
      vb = (6.3 + 75 * vb2) / (1 + 0.5 * vb1);

      // energy balance
      var enbal = h + ed + ere + esw + csum + rsum + food;

      // clothing temperature: stepwise search with decreasing step
      var xx = 0.001;
      if (count1 == 0) xx = 1;
      if (count1 == 1) xx = 0.1;
      if (count1 == 2) xx = 0.01;
      if (count1 == 3) xx = 0.001;
      if (enbal > 0) tcl = tcl + xx;
      if (enbal < 0) tcl = tcl - xx;

      var skip = false;
      if ((enbal <= 0 && enbal2 > 0) || (enbal >= 0 && enbal2 < 0)) {
        skip = true;
      } else {
        enbal2 = enbal;
        count3 = count3 + 1;
      }
      if (count3 > 200 || skip) {
        if (count1 < 3) {
          count1 = count1 + 1;
          enbal2 = 0;
        } else {
          break;
        }
      }
    }

    // choice of the physiologically consistent core temperature solution
    if (count1 == 3) {
      if (j == 2 || j == 5) {
        if (!(tcore[j] >= 36.6 && tsk <= 34.05)) continue;
      } else if (j == 6 || j == 1) {
        if (c[10] < 0) continue;
        if (!(tcore[j] >= 36.6 && tsk > 33.85)) continue;
      } else if (j == 3) {
        if (!(tcore[j] < 36.6 && tsk <= 34.0)) continue;
      } else if (j == 7) {
        if (!(tcore[j] < 36.6 && tsk > 34.0)) continue;
      }
    }
    if (j != 4 && vb >= 91) continue;
    if (j == 4 && vb < 89) continue;

    break;
  }
  // as in the original routine, the last computed state is used even if no branch was accepted

  // ---- PET: air temperature of the reference room giving the same energy balance (pet_iteration)
  var tx = t;
  var enbal2b = 0.0;
  var hcr = (2.67 + 6.5 * Math.pow(0.1, 0.67)) * Math.pow(pair / po, 0.55);
  var aeffr = adu * feff;
  for (var k = 0; k <= 3; k++) {
    var step = [1, 0.1, 0.01, 0.001][k];
    for (var it = 0; it < 100000; it++) {
      var rbare2 = aeffr * (1 - facl) * emsk * sigm * (Math.pow(tx + 273.2, 4) - Math.pow(tsk + 273.2, 4));
      var rclo3 = feff * acl * emcl * sigm * (Math.pow(tx + 273.2, 4) - Math.pow(tcl + 273.2, 4));
      var cbare2 = hcr * (tx - tsk) * adu * (1 - facl);
      var cclo2 = hcr * (tx - tcl) * acl;
      var ed2 = (evap / (rdsk + rdcl)) * adu * (1 - wetsk) * (12 - vpts);
      var tex2 = 0.47 * tx + 21;
      var eres2 = cair * (tx - tex2) * rtv;
      var vpex2 = 6.11 * Math.pow(10, (7.45 * tex2) / (235 + tex2));
      var erel2 = ((0.623 * evap) / pair) * (12 - vpex2) * rtv;
      var enbalr = h + ed2 + (eres2 + erel2) + esw + (cbare2 + cclo2) + (rbare2 + rclo3);
      if (enbalr > 0) tx = tx - step;
      if (enbalr < 0) tx = tx + step;
      if (enbalr <= 0 && enbal2b > 0) break;
      if (enbalr >= 0 && enbal2b < 0) break;
      enbal2b = enbalr;
    }
  }
  return Math.round(tx * 100) / 100;
}

/**
 * References:
 *   - ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of
 *     thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria. ISO,
 *     Geneva.
 *   - Fanger P.O. (1970). Thermal Comfort: Analysis and Applications in Environmental Engineering. Danish
 *     Technical Press, Copenhagen.
 */

function pmv_iso7730_raw(t, rh, wind, trad, M, W, clo) {
  var pa,
    icl,
    mw,
    fcl,
    hcf,
    taa,
    tra,
    tcla,
    p1,
    p2,
    p3,
    p4,
    p5,
    xn,
    xf,
    eps,
    hcn,
    hc,
    tcl,
    hl1,
    hl2,
    hl3,
    hl4,
    hl5,
    hl6,
    ts,
    pmv,
    ppd,
    n;

  pa = rh * 10 * Math.exp(16.6536 - 4030.183 / (t + 235));

  icl = 0.155 * clo; //thermal insulation of the clothing in M2K/W
  mw = M - W; //internal heat production in the human body

  if (icl <= 0.078) {
    fcl = 1 + 1.29 * icl;
  } else {
    fcl = 1.05 + 0.645 * icl;
  }

  //heat transf. coeff. by forced convection

  hcf = 12.1 * Math.sqrt(wind);
  taa = t + 273;
  tra = trad + 273;
  tcla = taa + (35.5 - t) / (3.5 * icl + 0.1);

  p1 = icl * fcl;
  p2 = p1 * 3.96;
  p3 = p1 * 100;
  p4 = p1 * taa;
  p5 = 308.7 - 0.028 * mw + p2 * Math.pow(tra / 100, 4);
  xn = tcla / 100;
  xf = tcla / 50;
  eps = 0.00015;

  n = 0;

  while (Math.abs(xn - xf) > eps) {
    xf = (xf + xn) / 2;
    hcn = 2.38 * Math.pow(Math.abs(100.0 * xf - taa), 0.25);
    if (hcf > hcn) hc = hcf;
    else hc = hcn;
    xn = (p5 + p4 * hc - p2 * Math.pow(xf, 4)) / (100 + p3 * hc);
    ++n;
    if (n > 150) {
      return NaN; // no convergence
    }
  }

  tcl = 100 * xn - 273;

  // heat loss diff. through skin
  hl1 = 3.05 * 0.001 * (5733 - 6.99 * mw - pa);
  // heat loss by sweating

  if (mw > 58.15) {
    hl2 = 0.42 * (mw - 58.15);
  } else {
    hl2 = 0;
  }

  // latent respiration heat loss
  hl3 = 1.7 * 0.00001 * M * (5867 - pa);
  // dry respiration heat loss
  hl4 = 0.0014 * M * (34 - t);
  // heat loss by radiation  R
  hl5 = 3.96 * fcl * (Math.pow(xn, 4) - Math.pow(tra / 100, 4));
  // heat loss by convection C
  hl6 = fcl * hc * (tcl - t);

  ts = 0.303 * Math.exp(-0.036 * M) + 0.028;

  pmv = ts * (mw - hl1 - hl2 - hl3 - hl4 - hl5 - hl6);

  return pmv;
}

/**
 * Given a temperature t (Celsius), relative humidity rh (%), wind ( m/sec), mean radiant temperature trad (degC
 *  M metabolism (met) , W external work ( generally 0),
 * and clothing insulation (clo) gives perceived HSI (Heat Strain Index) or AET or Sweat rate indexes.
 * Reference Introduction to Human Factors and Ergonomics for Engineers ,
 * Authors Mark R. Lehto, Steven J. Landry and Jim Buck
 * @param {number} ta
 * @return {number}
 */

/**
 * Given a temperature t (Celsius), relative humidity rh (%), wind ( m/sec), mean radiant temperature trad (degC),
 * M metabolic rate (W/m2, 58.15 = 1 met), W external work (W/m2, generally 0) and clothing insulation (clo)
 * gives PMV (Predicted Mean Vote) for moderate thermal environments following ISO 7730.
 *
 * References:
 *   - ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of
 *     thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria. ISO,
 *     Geneva.
 *   - Fanger P.O. (1970). Thermal Comfort: Analysis and Applications in Environmental Engineering. Danish
 *     Technical Press, Copenhagen.
 * @param {number} t,rh,wind,trad,M,W,clo
 * @return {number} PMV rounded to 2 decimals, or "Max iterations exceeded" if the clothing temperature does not converge
 */

function PMV_ISO7730(t, rh, wind, trad, M, W, clo) {
  var pmv = pmv_iso7730_raw(t, rh, wind, trad, M, W, clo);
  if (
    isNaN(pmv) &&
    !isNaN(t) &&
    !isNaN(rh) &&
    !isNaN(wind) &&
    !isNaN(trad) &&
    !isNaN(M) &&
    !isNaN(W) &&
    !isNaN(clo)
  ) {
    return "Max iterations exceeded";
  }
  return TwoDec(pmv);
}

/**
 * References:
 *   - Belding H.S., Hatch T.F. (1955). Index for evaluating heat stress in terms of resulting physiological
 *     strains. Heat. Pip. Air Cond. 27: 129-136.
 *   - Lehto M.R., Landry S.J., Buck J. (2012). Introduction to Human Factors and Ergonomics for Engineers, 2nd
 *     ed. CRC Press.
 */

function HSI_index(t, rh, wind, trad, M, W, clo, param) {
  if (param === undefined) {
    param = "HSI";
  }
  var pa,
    icl,
    mw,
    fcl,
    hcf,
    taa,
    tra,
    tcla,
    p1,
    p2,
    p3,
    p4,
    p5,
    xn,
    xf,
    eps,
    hcn,
    hc,
    tcl,
    hl1,
    hl2,
    hl3,
    hl4,
    hl5,
    hl6,
    ts,
    pmv,
    ppd,
    n;

  pa = rh * 10 * Math.exp(16.6536 - 4030.183 / (t + 235));

  icl = 0.155 * clo; //thermal insulation of the clothing in M2K/W
  mw = M - W; //internal heat production in the human body

  if (icl <= 0.078) {
    fcl = 1 + 1.29 * icl;
  } else {
    fcl = 1.05 + 0.645 * icl;
  }

  //heat transf. coeff. by forced convection

  hcf = 12.1 * Math.sqrt(wind);
  taa = t + 273.15;
  tra = trad + 273.15;
  tcla = taa + (35.5 - t) / (3.5 * icl + 0.1);

  p1 = icl * fcl;
  p2 = p1 * 3.96;
  p3 = p1 * 100;
  p4 = p1 * taa;
  p5 = 308.7 - 0.028 * mw + p2 * Math.pow(tra / 100, 4);
  xn = tcla / 100;
  xf = tcla / 50;
  eps = 0.00015;

  n = 0;

  while (Math.abs(xn - xf) > eps) {
    xf = (xf + xn) / 2;
    hcn = 2.38 * Math.pow(Math.abs(100.0 * xf - taa), 0.25);
    if (hcf > hcn) hc = hcf;
    else hc = hcn;
    xn = (p5 + p4 * hc - p2 * Math.pow(xf, 4)) / (100 + p3 * hc);
    ++n;
    if (n > 150) {
      return -9999;
    }
  }

  tcl = 100 * xn - 273.15;
  // heat loss diff. through skin
  hl1 = 3.05 * 0.001 * (5733 - 6.99 * mw - pa);
  // heat loss by sweating
  if (mw > 58.15) {
    hl2 = 0.42 * (mw - 58.15);
  } else {
    hl2 = 0;
  }

  // latent respiration heat loss
  hl3 = 1.7 * 0.00001 * M * (5867 - pa);
  // dry respiration heat loss
  hl4 = 0.0014 * M * (34 - t);
  // heat loss by radiation  R
  hl5 = 3.96 * fcl * (Math.pow(xn, 4) - Math.pow(tra / 100, 4));
  // heat loss by convection C
  hl6 = fcl * hc * (tcl - t);

  var eres = mw - hl3 - hl4 - hl5 - hl6;
  var sweat = 1;
  if (eres < 0) {
    sweat = 0;
  }

  var emax = 2.0 * Math.pow(wind, 0.6) * (42 - (rh / 100) * mbtommHG(es(t)));

  if (param == "HSI") {
    return TwoDec((eres / emax) * 100);
  } else if (param == "AET") {
    return Math.abs(2440 * (eres - emax));
  } else if (param == "Sweat") {
    return sweat;
  } else {
    return -9999;
  }
}

/**
 * Maximal clothing level by using ISO 7730 PMV given temperature t (degC), relative humidity rh (%),
 * wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work (generally 0),
 *
 * References:
 *   - ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of
 *     thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria. ISO,
 *     Geneva.
 * @param {number} t, rh, wind, trad, M, W
 * @return {number}
 */

function clomax_7730(t, rh, wind, trad, M, W) {
  if (M === undefined) {
    M = 58.15;
  }
  if (W === undefined) {
    W = 0;
  }
  var PMV_GOOD_sup = 0.5;
  var pmv;
  var clo = 5;

  do {
    pmv = PMV_ISO7730(t, rh, wind, trad, M, W, clo);
    clo = clo - 0.1;
  } while (pmv > PMV_GOOD_sup);

  return OneDec(clo);
}

/**
 * Minimal clothing level by using ISO 7730 PMV given temperature t (degC), relative humidity rh (%),
 * wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work (generally 0),
 *
 * References:
 *   - ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of
 *     thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria. ISO,
 *     Geneva.
 * @param {number} t,rh,wind,trad,M,W
 * @return {number}
 */

function clomin_7730(t, rh, wind, trad, M, W) {
  if (M === undefined) {
    M = 58.15;
  }
  if (W === undefined) {
    W = 0;
  }

  var PMV_GOOD_inf = -0.5;
  var pmv, clomin;
  var clo = 0.1;

  do {
    pmv = PMV_ISO7730(t, rh, wind, trad, M, W, clo);
    clo = clo + 0.1;
  } while (pmv < PMV_GOOD_inf);

  return OneDec(clo);
}

/**
 * Maximal clothing level by using ISO 7730 PMV given temperature t (degC), relative humidity rh (%),
 * wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work (generally 0)
 * imposing customized parameter as mbody body weight in kg, heigth in meters and gender ( "male" or "female").
 *
 * References:
 *   - Fanger P.O. (1970). Thermal Comfort: Analysis and Applications in Environmental Engineering. Danish
 *     Technical Press, Copenhagen.
 *   - Harris J.A., Benedict F.G. (1918). A biometric study of human basal metabolism. PNAS 4(12): 370-373.
 * @param {number} t,rh,wind,trad,M,W
 * @return {number}
 */

function clomax_custom(t, rh, wind, mtrad, age, mbody, ht, gender) {
  var PMV_GOOD_sup = 0.5;
  var pmv;
  var clo = 5;

  do {
    pmv = PMV_custom(t, rh, wind, mtrad, clo, age, mbody, ht, gender);
    clo = clo - 0.1;
  } while (pmv > PMV_GOOD_sup);

  return OneDec(clo);
}

/**
 * Minimal clothing level by using ISO 7730 PMV given temperature t (degC), relative humidity rh (%),
 * wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work (generally 0)
 * imposing customized parameter as mbody body weight in kg, heigth in meters and gender ( "male" or "female").
 *
 * References:
 *   - Fanger P.O. (1970). Thermal Comfort: Analysis and Applications in Environmental Engineering. Danish
 *     Technical Press, Copenhagen.
 *   - Harris J.A., Benedict F.G. (1918). A biometric study of human basal metabolism. PNAS 4(12): 370-373.
 * @param {number} t, rh, wind, trad, M, W
 * @return {number}
 */

function clomin_custom(t, rh, wind, mtrad, age, mbody, ht, gender) {
  var PMV_GOOD_inf = -0.5;
  var pmv, clomin;
  var clo = 0.1;

  do {
    pmv = PMV_custom(t, rh, wind, mtrad, clo, age, mbody, ht, gender);
    clo = clo + 0.1;
  } while (pmv < PMV_GOOD_inf);

  return OneDec(clo);
}

/**
 * Standard Effective Temperature SET (degC) with the Gagge two-node model in the version of
 * ANSI/ASHRAE Standard 55 (2020-2023). JavaScript port of two_nodes_gagge()/set_tmp() from
 * pythermalcomfort v4.8 (MIT License, Copyright (c) 2019 Federico Tartarini). Results agree with
 * ASHRAE 55 / CBE Thermal Comfort Tool.
 *
 * References:
 *   - Gagge A.P., Fobelets A.P., Berglund L.G. (1986). A standard predictive index of human response to the
 *     thermal environment. ASHRAE Trans. 92(2B): 709-731.
 *   - ANSI/ASHRAE Standard 55-2023. Thermal Environmental Conditions for Human Occupancy, Normative
 *     Appendix D. ASHRAE, Atlanta.
 *   - Tartarini F., Schiavon S. (2020). pythermalcomfort: A Python package for thermal comfort research.
 *     SoftwareX 12: 100578. doi:10.1016/j.softx.2020.100578
 * @param {number} t     air temperature (degC)
 * @param {number} rh    relative humidity (%)
 * @param {number} wind  relative air speed (m/s)
 * @param {number} tmrt  mean radiant temperature (degC)
 * @param {number} met   metabolic rate (met)
 * @param {number} clo   clothing insulation (clo)
 * @param {number} [wme=0] external work (met)
 * @param {number} [pair=1013.25] air pressure (hPa)
 * @param {string} [position="standing"] "standing" or "sitting"
 * @param {number} [bsa=1.8258] body surface area (m2)
 * @return {number} SET (degC), rounded to 1 decimal as in ASHRAE 55 / pythermalcomfort
 */
function SET_ASHRAE(t, rh, wind, tmrt, met, clo, wme, pair, position, bsa) {
  if (wme === undefined) wme = 0;
  if (pair === undefined) pair = 1013.25;
  if (position === undefined) position = "standing";
  if (bsa === undefined) bsa = 1.8258;
  if (isNaN(t) || isNaN(rh) || isNaN(wind) || isNaN(tmrt) || isNaN(met) || isNaN(clo)) {
    return NaN;
  }
  function psat_torr(x) {
    return Math.exp(18.6686 - 4030.183 / (x + 235.0));
  }
  var vapor_pressure = (rh * psat_torr(t)) / 100;
  var air_speed = Math.max(wind, 0.1);
  var k_clo = 0.25;
  var body_weight = 70;
  var met_factor = 58.2;
  var sbc = 0.000000056697;
  var c_sw = 170,
    c_dil = 120,
    c_str = 0.5;
  var temp_skin_neutral = 33.7;
  var temp_core_neutral = 36.8;
  var alfa = 0.1;
  var temp_body_neutral = alfa * temp_skin_neutral + (1 - alfa) * temp_core_neutral;
  var skin_blood_flow_neutral = 6.3;
  var t_skin = temp_skin_neutral;
  var t_core = temp_core_neutral;
  var m_bl = skin_blood_flow_neutral;
  var e_skin = 0.1 * met;
  var q_sensible = 0,
    w = 0,
    e_rsw = 0,
    e_diff = 0,
    e_max = 0,
    m_rsw = 0,
    r_ea = 0,
    r_ecl = 0;
  var pressure_in_atmospheres = (pair * 100) / 101325;
  var r_clo = 0.155 * clo;
  var f_a_cl = 1.0 + 0.15 * clo;
  var lr = 2.2 / pressure_in_atmospheres;
  var rm = (met - wme) * met_factor;
  var m = met * met_factor;
  var i_cl = clo > 0 ? 0.45 : 1.0;
  var w_max = clo > 0 ? 0.59 * Math.pow(air_speed, -0.08) : 0.38 * Math.pow(air_speed, -0.29);
  var h_cc = Math.max(
    3.0 * Math.pow(pressure_in_atmospheres, 0.53),
    8.600001 * Math.pow(air_speed * pressure_in_atmospheres, 0.53)
  );
  if (met > 0.85) {
    h_cc = Math.max(h_cc, 5.66 * Math.pow(met - 0.85, 0.39));
  }
  var h_r = 4.7;
  var h_t = h_r + h_cc;
  var r_a = 1.0 / (f_a_cl * h_t);
  var t_op = (h_r * tmrt + h_cc * t) / h_t;
  var t_body;
  var q_res = 0.0023 * m * (44.0 - vapor_pressure);
  var c_res = 0.0014 * m * (34.0 - t);
  var area_factor = position == "sitting" ? 0.7 : 0.73;

  for (var n_sim = 2; n_sim <= 60; n_sim++) {
    var t_cl = (r_a * t_skin + r_clo * t_op) / (r_a + r_clo);
    for (var it = 0; it <= 150; it++) {
      h_r = 4.0 * 0.95 * sbc * Math.pow((t_cl + tmrt) / 2.0 + 273.15, 3.0) * area_factor;
      h_t = h_r + h_cc;
      r_a = 1.0 / (f_a_cl * h_t);
      t_op = (h_r * tmrt + h_cc * t) / h_t;
      var t_cl_new = (r_a * t_skin + r_clo * t_op) / (r_a + r_clo);
      var conv = Math.abs(t_cl_new - t_cl) <= 0.01;
      t_cl = t_cl_new;
      if (conv) break;
      if (it == 150) return NaN; // max iterations exceeded
    }
    q_sensible = (t_skin - t_op) / (r_a + r_clo);
    var hf_cs = (t_core - t_skin) * (5.28 + 1.163 * m_bl);
    var s_core = m - hf_cs - q_res - c_res - wme;
    var s_skin = hf_cs - q_sensible - e_skin;
    var tc_sk = 0.97 * alfa * body_weight;
    var tc_cr = 0.97 * (1 - alfa) * body_weight;
    t_skin = t_skin + (s_skin * bsa) / (tc_sk * 60.0);
    t_core = t_core + (s_core * bsa) / (tc_cr * 60.0);
    t_body = alfa * t_skin + (1 - alfa) * t_core;
    var sk_sig = t_skin - temp_skin_neutral;
    var warm_sk = sk_sig > 0 ? sk_sig : 0;
    var colds = -sk_sig > 0 ? -sk_sig : 0;
    var c_reg_sig = t_core - temp_core_neutral;
    var c_warm = c_reg_sig > 0 ? c_reg_sig : 0;
    var c_cold = -c_reg_sig > 0 ? -c_reg_sig : 0;
    var bd_sig = t_body - temp_body_neutral;
    var warm_b = bd_sig > 0 ? bd_sig : 0;
    m_bl = (skin_blood_flow_neutral + c_dil * c_warm) / (1 + c_str * colds);
    m_bl = Math.max(Math.min(m_bl, 90), 0.5);
    m_rsw = Math.min(c_sw * warm_b * Math.exp(warm_sk / 10.7), 500);
    e_rsw = 0.68 * m_rsw;
    r_ea = 1.0 / (lr * f_a_cl * h_cc);
    r_ecl = r_clo / (lr * i_cl);
    e_max = (psat_torr(t_skin) - vapor_pressure) / (r_ea + r_ecl);
    if (e_max == 0) e_max = 0.001;
    var p_rsw = e_rsw / e_max;
    w = 0.06 + 0.94 * p_rsw;
    e_diff = w * e_max - e_rsw;
    if (w > w_max) {
      w = w_max;
      p_rsw = (w_max - 0.06) / 0.94;
      e_rsw = p_rsw * e_max;
      e_diff = 0.06 * (1.0 - p_rsw) * e_max;
    }
    if (e_max < 0) {
      e_diff = 0;
      e_rsw = 0;
      w = w_max;
    }
    e_skin = e_rsw + e_diff;
    m = rm + 19.4 * colds * c_cold; // shivering
    alfa = 0.0417737 + 0.7451833 / (m_bl + 0.585417);
  }

  var q_skin = q_sensible + e_skin;
  var p_s_sk = psat_torr(t_skin);
  // standard environment
  var h_r_s = h_r;
  var h_c_s = 3.0 * Math.pow(pressure_in_atmospheres, 0.53);
  if (met > 0.85) {
    h_c_s = Math.max(h_c_s, 5.66 * Math.pow(met - 0.85, 0.39));
  }
  h_c_s = Math.max(h_c_s, 3.0);
  var h_t_s = h_c_s + h_r_s;
  var r_clo_s = 1.52 / (met - wme / met_factor + 0.6944) - 0.1835;
  var r_cl_s = 0.155 * r_clo_s;
  var f_a_cl_s = 1.0 + k_clo * r_clo_s;
  var f_cl_s = 1.0 / (1.0 + 0.155 * f_a_cl_s * h_t_s * r_clo_s);
  var i_m_s = 0.45;
  var i_cl_s = (((i_m_s * h_c_s) / h_t_s) * (1 - f_cl_s)) / (h_c_s / h_t_s - f_cl_s * i_m_s);
  var r_a_s = 1.0 / (f_a_cl_s * h_t_s);
  var r_ea_s = 1.0 / (lr * f_a_cl_s * h_c_s);
  var r_ecl_s = r_cl_s / (lr * i_cl_s);
  var h_d_s = 1.0 / (r_a_s + r_cl_s);
  var h_e_s = 1.0 / (r_ea_s + r_ecl_s);
  var delta = 0.0001;
  var dx = 100.0;
  var set_old = Math.round((t_skin - q_skin / h_d_s) * 100) / 100;
  var set = set_old;
  for (var k = 0; k < 1000 && Math.abs(dx) > 0.01; k++) {
    var err_1 = q_skin - h_d_s * (t_skin - set_old) - w * h_e_s * (p_s_sk - 0.5 * psat_torr(set_old));
    var err_2 =
      q_skin - h_d_s * (t_skin - (set_old + delta)) - w * h_e_s * (p_s_sk - 0.5 * psat_torr(set_old + delta));
    set = set_old - (delta * err_1) / (err_2 - err_1);
    dx = set - set_old;
    set_old = set;
  }
  return Math.round(set * 10) / 10;
}

/**
 * Given rh relative humidity (%), wind windspeed (m/s) , MA as Metabolism ( W/mq), clo as mean
 * clothing insulation value in clo and the timing in hours H  gives the optimal temperature of thermal comfort.
 *
 * References:
 *   - ISO 11079:2007. Ergonomics of the thermal environment - Determination and interpretation of cold stress
 *     when using required clothing insulation (IREQ) and local cooling effects. ISO, Geneva.
 *   - ISO 9920:2007. Ergonomics of the thermal environment - Estimation of thermal insulation and water vapour
 *     resistance of a clothing ensemble. ISO, Geneva.
 * @param {number} t,rh
 * @return {number}
 */

function ta_comfort(rh, wind, M, clo, H) {
  var t = 40.0;
  var balance, i, C, hr, hc, Rst, WS, Rdyn, Fcl, Psk, Pa, Im, Retdyn, w, E, mres, Tex, Cres, R;
  var Ra = 1 / 9;
  var fcl = 1 + 0.31 * clo;
  var Tsk = 35.7 - 0.0285 * M - 3;
  if (H == -999.0) {
    Tsk = 35.7 - 0.0285 * M;
  }

  Rst = clo * 0.155 + Ra / fcl;
  WS = 0.0052 * (M - 58);
  if (WS > 0.7) {
    WS = 0.7;
  }
  var corr = Math.exp(0.043 - 0.398 * wind + 0.066 * wind * wind - 0.378 * WS + 0.094 * WS * WS);
  Rdyn = Rst * corr;
  for (i = 1; i < 1000; i++) {
    t = t - 0.1;

    // Calculation of Convective heat loss from the skin

    C = (Tsk - t) / Rdyn;

    // Calculation of radiation heat exchange

    hr =
      (5.67e-8 * 0.97 * 0.77 * (Math.exp(4 * Math.log(Tsk + 273.15)) - Math.exp(4 * Math.log(t + 273.15)))) /
      (Tsk - t);
    hc = 8.7 * Math.exp(0.6 * Math.log(wind));
    if (wind < 1) {
      hc = 3.5 + 5.2 * wind;
    }
    Fcl = 1 / ((hc + hr) * clo * 0.155 + 1 / fcl);
    R = hr * Fcl * (Tsk - t);

    // Calculation of Evaporative Heat Loss from the Skin

    Psk = 0.1333 * Math.exp(18.6686 - 4030.183 / (Tsk + 235));
    Pa = (rh * 0.1333 * Math.exp(18.6686 - 4030.183 / (t + 235))) / 100;
    Im = 0.38 * (4.9 - 6.5 * corr + 2.6 * corr * corr);
    if (Im > 0.9) {
      Im = 0.9;
    }
    Retdyn = Rdyn / Im / 16.65;
    w = 0.001 * M;
    E = (w * (Psk - Pa)) / Retdyn;

    // Calculation of Convective Heat Loss from Respiration

    mres = 2.58 * 0.000001 * M;
    Tex = 29 + 0.2 * t;
    Cres = (1007 * mres * (Tex - t)) / 1.8;

    // Calculation of Evaporative Heat Loss from Respiration

    var Wa = (0.622 * Pa) / (101.325 - Pa);
    var Pex = 0.1333 * Math.exp(18.6686 - 4030.183 / (Tex + 235));
    var Wex = (0.622 * Pex) / (101.325 - Pex);
    var Eres = (2423000 * mres * (Wex - Wa)) / 1.8;

    // Calculation of heat debt or heat storage
    var S = 1;
    if (H == -999.0) {
      S = 0;
    } else {
      S = 40 / H;
    }
    balance = M - C - R - E - Cres - Eres - S;
    if (balance < 0) break;
    i = i + 1;
  }

  return t - 0.1;
}

/**   Given calculate IREQ  ISO/CD 11079 given the t (C), Ambient air temperature (< +10 C) , rh (%), Relative humidity
 *   wind (m/s), Relative air velocity (0.4 to 18 m/s), trad (C), trad as the mean radiant temperature,
 *   M (W/m2), Metabolic energy production (58 to 400 W/,m2) , W (W/m2), Rate of mechanical work, (normally 0) and
 *   clo (clo), AVAILABLE basic clothing insulation (1 clo = 0.155 W/m2e K)
 *   The param ("IREQ_neutral","IREQ_min","ICLneutral","ICL_min","DLE_neutral","DLE_min","ICL_ISO11079"
 *   p (l/m2s), Air permeability (low < 5, medium 50, high > 100 l/m2s)
 *   w (m/s), Walking speed (or calculated work created air movements)
 * 	Developed by Ingvar Holmer and Hakan O. Nilsson, 1990.
 *   Al tered by Hakan O. Nilsson and Ingvar Holmer, 1992.
 *   Javascript original by Tomas Morales & Pilar Armenderiz, 1998.
 *   Modified content and code by Hakan O. Nilsson and Ingvar Holmer, 2000-2002.
 *
 * References:
 *   - ISO 11079:2007. Ergonomics of the thermal environment - Determination and interpretation of cold stress
 *     when using required clothing insulation (IREQ) and local cooling effects. ISO, Geneva.
 */

function IREQ(t, rh, wind, trad, M, W, clo, param, p, w) {
  if (typeof p === undefined) {
    p == 50;
  }
  if (typeof w === undefined) {
    w == 0;
  }

  var Tsk,
    wetness,
    Tex,
    Pex,
    Ta,
    v,
    Tr,
    Icl,
    Psks,
    fcl,
    vp,
    Icl,
    Iclr,
    Pa,
    Tcl,
    hc,
    hr,
    IREQ,
    Ia,
    Rt,
    factor,
    Balance,
    R,
    C,
    Hres,
    calculation,
    ICL_ISO11079,
    E,
    S,
    DLE,
    ArAdu,
    IclCorr,
    slask,
    worktype,
    ICLminimal,
    ICLneutral,
    IREQneutral,
    IREQminimal,
    DLEneutral,
    DLEminimal = 1;

  // Parameter adjustements to induce stationarity.

  Ta = t;
  v = wind;
  Tr = trad;
  Icl = clo;

  if (M <= 58) {
    M = 58;
  } // minimum metabolic rate 1 met

  if (M >= 400) {
    M = 400;
  }

  if (Ta > 10) {
    return -9999;
  }

  if (w <= 0.0052 * (M - 58)) {
    w = 0.0052 * (M - 58);
  }

  if (w >= 1.2) {
    w = 1.2;
  }

  if (v <= 0.4) {
    v = 0.4;
  }

  if (v >= 18) {
    v = 18;
  }

  // Calculation clothing insulation parameters.

  Icl = Icl * 0.155;

  Ia = 0.092 * Math.exp(-0.15 * v - 0.22 * w) - 0.0045;

  calculation = 0;

  do {
    calculation = calculation + 1;

    if (calculation == 1) {
      Tsk = 33.34 - 0.0354 * M;
      wetness = 0.06;
    } else {
      Tsk = 35.7 - 0.0285 * M;
      wetness = 0.001 * M;
    }

    // Calculation of Tex (C) and Pex,Psks,Pa (Pa)

    Tex = 29 + 0.2 * Ta;
    Pex = 0.1333 * Math.exp(18.6686 - 4030.183 / (Tex + 235));
    Psks = 0.1333 * Math.exp(18.6686 - 4030.183 / (Tsk + 235));
    Pa = (rh / 100) * 0.1333 * Math.exp(18.6686 - 4030.183 / (Ta + 235));

    // Calculation of IREQ (m2C/W),Rt (m2kPa/W),fcl (n.d.),hr W/m2C with stepwise iteration
    IREQ = 1;
    hr = 3;
    ArAdu = 0.77;
    factor = 1; // Initial values !

    do {
      fcl = 1 + 1.197 * IREQ;
      Rt = (0.06 / 0.38) * (Ia + IREQ);
      E = (wetness * (Psks - Pa)) / Rt;
      Hres = 1.73e-2 * M * (Pex - Pa) + 1.4e-3 * M * (Tex - Ta);
      Tcl = Tsk - IREQ * (M - W - E - Hres);
      hr =
        (5.67e-8 * 0.95 * ArAdu * (Math.exp(4 * Math.log(273 + Tcl)) - Math.exp(4 * Math.log(273 + Tr)))) /
        (Tcl - Tr);
      hc = 1 / Ia - hr;
      R = fcl * hr * (Tcl - Tr);
      C = fcl * hc * (Tcl - Ta);
      Balance = M - W - E - Hres - R - C;
      if (Balance > 0) {
        IREQ = IREQ - factor;
        factor = factor / 2;
      } else {
        IREQ = IREQ + factor;
      }
    } while (Math.abs(Balance) > 0.01);

    IREQ = (Tsk - Tcl) / (R + C);

    Tcl = Ta;
    hr = 3;
    S = -40;
    ArAdu = 0.77;
    factor = 500;
    Iclr = Icl; // Initial values !

    do {
      fcl = 1 + 1.197 * Iclr;
      Iclr =
        (Icl + 0.085 / fcl) *
          (0.54 * Math.exp(-0.15 * v - 0.22 * w) * Math.pow(p, 0.075) - 0.06 * Math.log(p) + 0.5) -
        (0.092 * Math.exp(-0.15 * v - 0.22 * w) - 0.0045) / fcl;
      Rt = (0.06 / 0.38) * (Ia + Iclr);
      E = (wetness * (Psks - Pa)) / Rt;
      Hres = 1.73e-2 * M * (Pex - Pa) + 1.4e-3 * M * (Tex - Ta);
      Tcl = Tsk - Iclr * (M - W - E - Hres - S);
      hr =
        (5.67e-8 * 0.95 * ArAdu * (Math.exp(4 * Math.log(273 + Tcl)) - Math.exp(4 * Math.log(273 + Tr)))) /
        (Tcl - Tr);
      hc = 1 / Ia - hr;
      R = fcl * hr * (Tcl - Tr);
      C = fcl * hc * (Tcl - Ta);
      Balance = M - W - E - Hres - R - C - S;
      if (Balance > 0) {
        S = S + factor;
        factor = factor / 2;
      } else {
        S = S - factor;
      }
    } while (Math.abs(Balance) > 0.01);

    DLE = -40 / S;

    if (calculation == 1) {
      IREQminimal = Math.round((IREQ / 0.155) * 100) / 100;
      ICLminimal =
        Math.round(
          (((IREQ + Ia / fcl) /
            (0.54 * Math.exp(-0.15 * v - 0.22 * w) * Math.pow(p, 0.075) - 0.06 * Math.log(p) + 0.5) -
            0.085 / fcl) /
            0.155) *
            100
        ) / 100;
      if (param == "ICL_min") {
        return ICLminimal;
      }
      if (S > -8) {
        DLEminimal = 8 * 60;
      } else {
        DLEminimal = (Math.round(DLE * 100) / 100) * 60;
      }
    } else {
      IREQneutral = Math.round((IREQ / 0.155) * 100) / 100;
      ICLneutral =
        Math.round(
          (((IREQ + Ia / fcl) /
            (0.54 * Math.exp(-0.15 * v - 0.22 * w) * Math.pow(p, 0.075) - 0.06 * Math.log(p) + 0.5) -
            0.085 / fcl) /
            0.155) *
            100
        ) / 100;
      if (param == "ICL_neutral") {
        return ICLneutral;
      }
      if (param == "IREQ_neutral") {
        return IREQneutral;
      }
      if (S > -8) {
        DLEneutral = 8;
      } else {
        DLEneutral = (Math.round(DLE * 100) / 100) * 60;
      }

      if (Icl / 0.155 > ICLneutral) {
        ICL_ISO11079 = 1;
      } // "AVAILABLE > REQUIRED MINIMAL & NEUTRAL basic clothing insulation"
      else {
        ICL_ISO11079 = 0;
      } // "NOT AVAILABLE < REQUIRED MINIMAL & NEUTRAL basic clothing insulation"
    }
  } while (calculation < 2);

  if (param == "IREQ_neutral") {
    return IREQneutral;
  } else if (param == "IREQ_min") {
    return IREQminimal;
  } else if (param == "ICL_neutral") {
    return ICLneutral;
  } else if (param == "ICL_min") {
    return ICLminimal;
  } else if (param == "DLE_neutral") {
    return DLEneutral;
  } else if (param == "DLE_min") {
    return DLEminimal;
  } else if (param == "ICL_ISO11079") {
    return ICL_ISO11079;
  } else {
    return -9999;
  }
}

/**
 * Given Ambient Air Temperature (< +10 Celsius deg ), relative humidity rh (%), wind relative air velocity wind ( 0.4 to 18 m/s)
 * trad Mean radiant temperature (Celsius Deg), M as Metabolic energy production (58 to 400 W/m2), W rate of mechanical work W ( normally 0 W/m2),
 * AVAILABLE basic clothing insulation clo ( clo = 0.155 W/m2K), Air clothing ensemble permeability p (low < 5, medium 50, high > 100 l/m2s)
 * give a Recovery Time Index in minutes ISO 11079.
 *
 * References:
 *   - ISO 11079:2007. Ergonomics of the thermal environment - Determination and interpretation of cold stress
 *     when using required clothing insulation (IREQ) and local cooling effects. ISO, Geneva.
 * @param {number} t,rh,wind,trad,M,W,clo,p,w
 * @return {number}
 */

function recovery_time(t, rh, wind, trad, M, W, clo, p, w) {
  if (typeof p === undefined) {
    p == 50;
  }
  if (typeof w === undefined) {
    w == 0;
  }

  var Tsk,
    wetness,
    Tex,
    Pex,
    Ta,
    v,
    Tr,
    Icl,
    Psks,
    fcl,
    vp,
    Icl,
    Iclr,
    Pa,
    Tcl,
    hc,
    hr,
    IREQ,
    Ia,
    Rt,
    factor,
    Balance,
    R,
    C,
    Hres,
    calculation,
    RTneutral,
    E,
    S,
    DLE,
    ArAdu,
    IclCorr,
    slask,
    worktype,
    ICLneutral,
    IREQneutral,
    DLEneutral = 1;

  // Parameter adjustements to induce stationarity.
  Ta = t;
  v = wind;
  Tr = trad;
  Icl = clo;

  if (M <= 58) {
    M = 58;
  } // minimum metabolic rate 1 met

  if (M >= 400) {
    M = 400;
  }

  if (w <= 0.0052 * (M - 58)) {
    w = 0.0052 * (M - 58);
  }

  if (w >= 1.2) {
    w = 1.2;
  }

  if (v <= 0.4) {
    v = 0.4;
  }

  if (v >= 18) {
    v = 18;
  }

  // Calculation clothing insulation parameters.

  Icl = Icl * 0.155;

  Ia = 0.092 * Math.exp(-0.15 * v - 0.22 * w) - 0.0045;

  // Calculation of Tsk (C) and wetness (%) for RTneutral!

  Tsk = 35.7 - 0.0285 * M;
  wetness = 0.001 * M;

  // Calculation of Tex (C) and Pex,Psks,Pa (Pa)

  Tex = 29 + 0.2 * Ta;
  Pex = 0.1333 * Math.exp(18.6686 - 4030.183 / (Tex + 235));
  Psks = 0.1333 * Math.exp(18.6686 - 4030.183 / (Tsk + 235));
  Pa = (rh / 100) * 0.1333 * Math.exp(18.6686 - 4030.183 / (Ta + 235));

  // Calculation of S (W/m2), Rt (m2kPa/W), fcl (n.d.), hr W/m2C with stepwise iteration

  Tcl = Ta;
  hr = 3;
  S = -40;
  ArAdu = 0.77;
  factor = 100;
  Iclr = Icl; // Initial values !
  do {
    fcl = 1 + 1.97 * Iclr;
    Iclr =
      (Icl + 0.085 / fcl) *
        (0.54 * Math.exp(-0.15 * v - 0.22 * w) * Math.pow(p, 0.075) - 0.06 * Math.log(p) + 0.5) -
      (0.092 * Math.exp(-0.15 * v - 0.22 * w) - 0.0045) / fcl;
    Rt = (0.06 / 0.38) * (Ia + Iclr);
    E = (wetness * (Psks - Pa)) / Rt;
    Hres = 1.73e-2 * M * (Pex - Pa) + 1.4e-3 * M * (Tex - Ta);
    Tcl = Tsk - Iclr * (M - W - E - Hres - S);
    hr =
      (5.67e-8 * 0.95 * ArAdu * (Math.exp(4 * Math.log(273 + Tcl)) - Math.exp(4 * Math.log(273 + Tr)))) /
      (Tcl - Tr);
    hc = 1 / Ia - hr;
    R = fcl * hr * (Tcl - Tr);
    C = fcl * hc * (Tcl - Ta);
    Balance = M - W - E - Hres - R - C - S;
    if (Balance > 0) {
      S = S + factor;
      factor = factor / 2;
    } else {
      S = S - factor;
    }
  } while (Math.abs(Balance) > 0.01);

  DLE = -40 / S;

  // Negative body storage.

  if (DLE >= 0) {
    RTneutral = -1;
  } else {
    RTneutral = ((Math.abs(DLE) * 100) / 100) * 60;
  }

  return RTneutral;
}

/**
 *  Given air temperature (Celsius), relative humidity (%), wind speed (m/sec) and mean radiant temperature ( tmrt in degC)
 *  gives the Universal Thermal Climate Index in Celsius.
 *
 * References:
 *   - Broede P., Fiala D., Blazejczyk K., Holmer I., Jendritzky G., Kampmann B., Tinz B., Havenith G. (2012).
 *     Deriving the operational procedure for the Universal Thermal Climate Index (UTCI). Int. J. Biometeorol.
 *     56: 481-494. doi:10.1007/s00484-011-0454-1
 *  @param {number} t,rh,wind,tmrt
 *  @return {number}
 */

function UTCI(ta, rh, wind, tmrt) {
  var ta, pa, va, e, dtm, i, n;
  e = es(ta) / 10; // use vapour pressure in kPa
  pa = (e * rh) / 100.0;
  va = wind;
  if (va < 0.51) {
    va = 0.5;
  }
  if (va > 17) {
    va = 17;
  }

  dtm = tmrt - ta;

  var utci = new Array(210);

  utci[0] = ta;
  utci[1] = 6.07562052e-1;
  utci[2] = -2.27712343e-2 * ta;
  utci[3] = 8.06470249e-4 * ta * ta;
  utci[4] = -1.54271372e-4 * ta * ta * ta;
  utci[5] = -3.24651735e-6 * ta * ta * ta * ta;
  utci[6] = 7.32602852e-8 * ta * ta * ta * ta * ta;
  utci[7] = 1.35959073e-9 * ta * ta * ta * ta * ta * ta;
  utci[8] = -2.2583652 * va;
  utci[9] = 8.80326035e-2 * ta * va;
  utci[10] = 2.16844454e-3 * ta * ta * va;
  utci[11] = -1.53347087e-5 * ta * ta * ta * va;
  utci[12] = -5.72983704e-7 * ta * ta * ta * ta * va;
  utci[13] = -2.55090145e-9 * ta * ta * ta * ta * ta * va;
  utci[14] = -7.51269505e-1 * va * va;
  utci[15] = -4.08350271e-3 * ta * va * va;
  utci[16] = -5.21670675e-5 * ta * ta * va * va;
  utci[17] = 1.94544667e-6 * ta * ta * ta * va * va;
  utci[18] = 1.14099531e-8 * ta * ta * ta * ta * va * va;
  utci[19] = 1.58137256e-1 * va * va * va;
  utci[20] = -6.57263143e-5 * ta * va * va * va;
  utci[21] = 2.22697524e-7 * ta * ta * va * va * va;
  utci[22] = -4.16117031e-8 * ta * ta * ta * va * va * va;
  utci[23] = -1.27762753e-2 * va * va * va * va;
  utci[24] = 9.66891875e-6 * ta * va * va * va * va;
  utci[25] = 2.52785852e-9 * ta * ta * va * va * va * va;
  utci[26] = 4.56306672e-4 * va * va * va * va * va;
  utci[27] = -1.74202546e-7 * ta * va * va * va * va * va;
  utci[28] = -5.91491269e-6 * va * va * va * va * va * va;
  utci[29] = 3.98374029e-1 * dtm;
  utci[30] = 1.83945314e-4 * ta * dtm;
  utci[31] = -1.7375451e-4 * ta * ta * dtm;
  utci[32] = -7.60781159e-7 * ta * ta * ta * dtm;
  utci[33] = 3.77830287e-8 * ta * ta * ta * ta * dtm;
  utci[34] = 5.43079673e-10 * ta * ta * ta * ta * ta * dtm;
  utci[35] = -2.00518269e-2 * va * dtm;
  utci[36] = 8.92859837e-4 * ta * va * dtm;
  utci[37] = 3.45433048e-6 * ta * ta * va * dtm;
  utci[38] = -3.77925774e-7 * ta * ta * ta * va * dtm;
  utci[39] = -1.69699377e-9 * ta * ta * ta * ta * va * dtm;
  utci[40] = 1.69992415e-4 * va * va * dtm;
  utci[41] = -4.99204314e-5 * ta * va * va * dtm;
  utci[42] = 2.47417178e-7 * ta * ta * va * va * dtm;
  utci[43] = 1.07596466e-8 * ta * ta * ta * va * va * dtm;
  utci[44] = 8.49242932e-5 * va * va * va * dtm;
  utci[45] = 1.35191328e-6 * ta * va * va * va * dtm;
  utci[46] = -6.21531254e-9 * ta * ta * va * va * va * dtm;
  utci[47] = -4.99410301e-6 * va * va * va * va * dtm;
  utci[48] = -1.89489258e-8 * ta * va * va * va * va * dtm;
  utci[49] = 8.15300114e-8 * va * va * va * va * va * dtm;
  utci[50] = 7.5504309e-4 * dtm * dtm;
  utci[51] = -5.65095215e-5 * ta * dtm * dtm;
  utci[52] = -4.52166564e-7 * ta * ta * dtm * dtm;
  utci[53] = 2.46688878e-8 * ta * ta * ta * dtm * dtm;
  utci[54] = 2.42674348e-10 * ta * ta * ta * ta * dtm * dtm;
  utci[55] = 1.5454725e-4 * va * dtm * dtm;
  utci[56] = 5.2411097e-6 * ta * va * dtm * dtm;
  utci[57] = -8.75874982e-8 * ta * ta * va * dtm * dtm;
  utci[58] = -1.50743064e-9 * ta * ta * ta * va * dtm * dtm;
  utci[59] = -1.56236307e-5 * va * va * dtm * dtm;
  utci[60] = -1.33895614e-7 * ta * va * va * dtm * dtm;
  utci[61] = 2.49709824e-9 * ta * ta * va * va * dtm * dtm;
  utci[62] = 6.51711721e-7 * va * va * va * dtm * dtm;
  utci[63] = 1.94960053e-9 * ta * va * va * va * dtm * dtm;
  utci[64] = -1.00361113e-8 * va * va * va * va * dtm * dtm;
  utci[65] = -1.21206673e-5 * dtm * dtm * dtm;
  utci[66] = -2.1820366e-7 * ta * dtm * dtm * dtm;
  utci[67] = 7.51269482e-9 * ta * ta * dtm * dtm * dtm;
  utci[68] = 9.79063848e-11 * ta * ta * ta * dtm * dtm * dtm;
  utci[69] = 1.25006734e-6 * va * dtm * dtm * dtm;
  utci[70] = -1.81584736e-9 * ta * va * dtm * dtm * dtm;
  utci[71] = -3.52197671e-10 * ta * ta * va * dtm * dtm * dtm;
  utci[72] = -3.3651463e-8 * va * va * dtm * dtm * dtm;
  utci[73] = 1.35908359e-10 * ta * va * va * dtm * dtm * dtm;
  utci[74] = 4.1703262e-10 * va * va * va * dtm * dtm * dtm;
  utci[75] = -1.30369025e-9 * dtm * dtm * dtm * dtm;
  utci[76] = 4.13908461e-10 * ta * dtm * dtm * dtm * dtm;
  utci[77] = 9.22652254e-12 * ta * ta * dtm * dtm * dtm * dtm;
  utci[78] = -5.08220384e-9 * va * dtm * dtm * dtm * dtm;
  utci[79] = -2.24730961e-11 * ta * va * dtm * dtm * dtm * dtm;
  utci[80] = 1.17139133e-10 * va * va * dtm * dtm * dtm * dtm;
  utci[81] = 6.62154879e-10 * dtm * dtm * dtm * dtm * dtm;
  utci[82] = 4.0386326e-13 * ta * dtm * dtm * dtm * dtm * dtm;
  utci[83] = 1.95087203e-12 * va * dtm * dtm * dtm * dtm * dtm;
  utci[84] = -4.73602469e-12 * dtm * dtm * dtm * dtm * dtm * dtm;
  utci[85] = 5.12733497 * pa;
  utci[86] = -3.12788561e-1 * ta * pa;
  utci[87] = -1.96701861e-2 * ta * ta * pa;
  utci[88] = 9.9969087e-4 * ta * ta * ta * pa;
  utci[89] = 9.51738512e-6 * ta * ta * ta * ta * pa;
  utci[90] = -4.66426341e-7 * ta * ta * ta * ta * ta * pa;
  utci[91] = 5.48050612e-1 * va * pa;
  utci[92] = -3.30552823e-3 * ta * va * pa;
  utci[93] = -1.6411944e-3 * ta * ta * va * pa;
  utci[94] = -5.16670694e-6 * ta * ta * ta * va * pa;
  utci[95] = 9.52692432e-7 * ta * ta * ta * ta * va * pa;
  utci[96] = -4.29223622e-2 * va * va * pa;
  utci[97] = 5.00845667e-3 * ta * va * va * pa;
  utci[98] = 1.00601257e-6 * ta * ta * va * va * pa;
  utci[99] = -1.81748644e-6 * ta * ta * ta * va * va * pa;
  utci[100] = -1.25813502e-3 * va * va * va * pa;
  utci[101] = -1.79330391e-4 * ta * va * va * va * pa;
  utci[102] = 2.34994441e-6 * ta * ta * va * va * va * pa;
  utci[103] = 1.29735808e-4 * va * va * va * va * pa;
  utci[104] = 1.2906487e-6 * ta * va * va * va * va * pa;
  utci[105] = -2.28558686e-6 * va * va * va * va * va * pa;
  utci[106] = -3.69476348e-2 * dtm * pa;
  utci[107] = 1.62325322e-3 * ta * dtm * pa;
  utci[108] = -3.1427968e-5 * ta * ta * dtm * pa;
  utci[109] = 2.59835559e-6 * ta * ta * ta * dtm * pa;
  utci[110] = -4.77136523e-8 * ta * ta * ta * ta * dtm * pa;
  utci[111] = 8.6420339e-3 * va * dtm * pa;
  utci[112] = -6.87405181e-4 * ta * va * dtm * pa;
  utci[113] = -9.13863872e-6 * ta * ta * va * dtm * pa;
  utci[114] = 5.15916806e-7 * ta * ta * ta * va * dtm * pa;
  utci[115] = -3.59217476e-5 * va * va * dtm * pa;
  utci[116] = 3.28696511e-5 * ta * va * va * dtm * pa;
  utci[117] = -7.10542454e-7 * ta * ta * va * va * dtm * pa;
  utci[118] = -1.243823e-5 * va * va * va * dtm * pa;
  utci[119] = -7.385844e-9 * ta * va * va * va * dtm * pa;
  utci[120] = 2.20609296e-7 * va * va * va * va * dtm * pa;
  utci[121] = -7.3246918e-4 * dtm * dtm * pa;
  utci[122] = -1.87381964e-5 * ta * dtm * dtm * pa;
  utci[123] = 4.80925239e-6 * ta * ta * dtm * dtm * pa;
  utci[124] = -8.7549204e-8 * ta * ta * ta * dtm * dtm * pa;
  utci[125] = 2.7786293e-5 * va * dtm * dtm * pa;
  utci[126] = -5.06004592e-6 * ta * va * dtm * dtm * pa;
  utci[127] = 1.14325367e-7 * ta * ta * va * dtm * dtm * pa;
  utci[128] = 2.53016723e-6 * va * va * dtm * dtm * pa;
  utci[129] = -1.72857035e-8 * ta * va * va * dtm * dtm * pa;
  utci[130] = -3.95079398e-8 * va * va * va * dtm * dtm * pa;
  utci[131] = -3.59413173e-7 * dtm * dtm * dtm * pa;
  utci[132] = 7.04388046e-7 * ta * dtm * dtm * dtm * pa;
  utci[133] = -1.89309167e-8 * ta * ta * dtm * dtm * dtm * pa;
  utci[134] = -4.79768731e-7 * va * dtm * dtm * dtm * pa;
  utci[135] = 7.96079978e-9 * ta * va * dtm * dtm * dtm * pa;
  utci[136] = 1.62897058e-9 * va * va * dtm * dtm * dtm * pa;
  utci[137] = 3.94367674e-8 * dtm * dtm * dtm * dtm * pa;
  utci[138] = -1.18566247e-9 * ta * dtm * dtm * dtm * dtm * pa;
  utci[139] = 3.34678041e-10 * va * dtm * dtm * dtm * dtm * pa;
  utci[140] = -1.15606447e-10 * dtm * dtm * dtm * dtm * dtm * pa;
  utci[141] = -2.80626406 * pa * pa;
  utci[142] = 5.48712484e-1 * ta * pa * pa;
  utci[143] = -3.9942841e-3 * ta * ta * pa * pa;
  utci[144] = -9.54009191e-4 * ta * ta * ta * pa * pa;
  utci[145] = 1.93090978e-5 * ta * ta * ta * ta * pa * pa;
  utci[146] = -3.08806365e-1 * va * pa * pa;
  utci[147] = 1.16952364e-2 * ta * va * pa * pa;
  utci[148] = 4.95271903e-4 * ta * ta * va * pa * pa;
  utci[149] = -1.90710882e-5 * ta * ta * ta * va * pa * pa;
  utci[150] = 2.10787756e-3 * va * va * pa * pa;
  utci[151] = -6.98445738e-4 * ta * va * va * pa * pa;
  utci[152] = 2.30109073e-5 * ta * ta * va * va * pa * pa;
  utci[153] = 4.1785659e-4 * va * va * va * pa * pa;
  utci[154] = -1.27043871e-5 * ta * va * va * va * pa * pa;
  utci[155] = -3.04620472e-6 * va * va * va * va * pa * pa;
  utci[156] = 5.14507424e-2 * dtm * pa * pa;
  utci[157] = -4.32510997e-3 * ta * dtm * pa * pa;
  utci[158] = 8.99281156e-5 * ta * ta * dtm * pa * pa;
  utci[159] = -7.14663943e-7 * ta * ta * ta * dtm * pa * pa;
  utci[160] = -2.66016305e-4 * va * dtm * pa * pa;
  utci[161] = 2.63789586e-4 * ta * va * dtm * pa * pa;
  utci[162] = -7.01199003e-6 * ta * ta * va * dtm * pa * pa;
  utci[163] = -1.06823306e-4 * va * va * dtm * pa * pa;
  utci[164] = 3.61341136e-6 * ta * va * va * dtm * pa * pa;
  utci[165] = 2.29748967e-7 * va * va * va * dtm * pa * pa;
  utci[166] = 3.04788893e-4 * dtm * dtm * pa * pa;
  utci[167] = -6.42070836e-5 * ta * dtm * dtm * pa * pa;
  utci[168] = 1.16257971e-6 * ta * ta * dtm * dtm * pa * pa;
  utci[169] = 7.68023384e-6 * va * dtm * dtm * pa * pa;
  utci[170] = -5.47446896e-7 * ta * va * dtm * dtm * pa * pa;
  utci[171] = -3.5993791e-8 * va * va * dtm * dtm * pa * pa;
  utci[172] = -4.36497725e-6 * dtm * dtm * dtm * pa * pa;
  utci[173] = 1.68737969e-7 * ta * dtm * dtm * dtm * pa * pa;
  utci[174] = 2.67489271e-8 * va * dtm * dtm * dtm * pa * pa;
  utci[175] = 3.23926897e-9 * dtm * dtm * dtm * dtm * pa * pa;
  utci[176] = -3.53874123e-2 * pa * pa * pa;
  utci[177] = -2.2120119e-1 * ta * pa * pa * pa;
  utci[178] = 1.55126038e-2 * ta * ta * pa * pa * pa;
  utci[179] = -2.63917279e-4 * ta * ta * ta * pa * pa * pa;
  utci[180] = 4.53433455e-2 * va * pa * pa * pa;
  utci[181] = -4.32943862e-3 * ta * va * pa * pa * pa;
  utci[182] = 1.45389826e-4 * ta * ta * va * pa * pa * pa;
  utci[183] = 2.1750861e-4 * va * va * pa * pa * pa;
  utci[184] = -6.66724702e-5 * ta * va * va * pa * pa * pa;
  utci[185] = 3.3321714e-5 * va * va * va * pa * pa * pa;
  utci[186] = -2.26921615e-3 * dtm * pa * pa * pa;
  utci[187] = 3.80261982e-4 * ta * dtm * pa * pa * pa;
  utci[188] = -5.45314314e-9 * ta * ta * dtm * pa * pa * pa;
  utci[189] = -7.96355448e-4 * va * dtm * pa * pa * pa;
  utci[190] = 2.53458034e-5 * ta * va * dtm * pa * pa * pa;
  utci[191] = -6.31223658e-6 * va * va * dtm * pa * pa * pa;
  utci[192] = 3.02122035e-4 * dtm * dtm * pa * pa * pa;
  utci[193] = -4.77403547e-6 * ta * dtm * dtm * pa * pa * pa;
  utci[194] = 1.73825715e-6 * va * dtm * dtm * pa * pa * pa;
  utci[195] = -4.09087898e-7 * dtm * dtm * dtm * pa * pa * pa;
  utci[196] = 6.14155345e-1 * pa * pa * pa * pa;
  utci[197] = -6.16755931e-2 * ta * pa * pa * pa * pa;
  utci[198] = 1.33374846e-3 * ta * ta * pa * pa * pa * pa;
  utci[199] = 3.55375387e-3 * va * pa * pa * pa * pa;
  utci[200] = -5.13027851e-4 * ta * va * pa * pa * pa * pa;
  utci[201] = 1.02449757e-4 * va * va * pa * pa * pa * pa;
  utci[202] = -1.48526421e-3 * dtm * pa * pa * pa * pa;
  utci[203] = -4.11469183e-5 * ta * dtm * pa * pa * pa * pa;
  utci[204] = -6.80434415e-6 * va * dtm * pa * pa * pa * pa;
  utci[205] = -9.77675906e-6 * dtm * dtm * pa * pa * pa * pa;
  utci[206] = 8.82773108e-2 * pa * pa * pa * pa * pa;
  utci[207] = -3.01859306e-3 * ta * pa * pa * pa * pa * pa;
  utci[208] = 1.04452989e-3 * va * pa * pa * pa * pa * pa;
  utci[209] = 2.47090539e-4 * dtm * pa * pa * pa * pa * pa;
  utci[210] = 1.48348065e-3 * pa * pa * pa * pa * pa * pa;

  var total = 0;

  for (i = 0, n = utci.length; i < n; ++i) {
    total = total + utci[i];
  }

  if (ta < -50.0 || ta > 60.0) {
    total = 9999;
  }
  if (tmrt < ta - 30.0 || tmrt > ta + 70.0) {
    total = 9999;
  }
  if (rh < 0.0 || rh > 100.0) {
    total = 9999;
  }
  return TwoDec(total);
}

/**
 * Given air temperature (degC), relative humidity (%) give a heat index in degC
 * References:
 * [1] http://www.wpc.ncep.noaa.gov/html/heatindex.shtml
 * [2] https://en.wikipedia.org/wiki/Heat_index
 * [3] http://www.srh.noaa.gov/images/ffc/pdf/ta_htindx.PDF
 *
 *
 * References:
 *   - Rothfusz L.P. (1990). The heat index 'equation' (or, more than you ever wanted to know about heat
 *     index). NWS Southern Region Technical Attachment SR 90-23.
 *   - Steadman R.G. (1979). The assessment of sultriness. Part I: A temperature-humidity index based on human
 *     physiology and clothing science. J. Appl. Meteor. 18: 861-873.
 * @param {number} t,rh
 * @return {number}
 */

function heatindex(t, rh) {
  var tf, tf2, ur2, hif;
  tf = C2F(t);
  tf2 = Math.pow(tf, 2.0);
  ur2 = Math.pow(rh, 2.0);
  hif =
    -42.379 +
    2.04901523 * tf +
    10.1433127 * rh -
    0.22475541 * tf * rh -
    6.83783 * 0.001 * tf2 -
    5.481717 * 0.01 * ur2 +
    1.22874 * 0.001 * tf2 * rh +
    8.5282 * 0.0001 * tf * ur2 -
    1.99 * 0.000001 * tf2 * ur2;

  if ((t < 44) & (t > 27) & (rh < 13)) {
    return TwoDec(F2C(hif - ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tf - 95)) / 17)));
  } else if ((t < 31) & (t > 27) & (rh > 85)) {
    return TwoDec(F2C(hif - ((rh - 85) / 10) * ((87 - tf) / 5)));
  }

  if (t > 27) {
    return TwoDec(F2C(hif));
  } else {
    return TwoDec(F2C(0.5 * (tf + 61.0 + (tf - 68.0) * 1.2 + rh * 0.094)));
  }
}

/**
 * Given air temperature (degC), relative humidity (%), wind velocity (m/sec), direct
 * beam short-wavelength radiation (W/mq) and sunelev sun elevation angle (degrees)
 * gives Steadman outdoor sun index.
 *
 *
 * References:
 *   - Steadman R.G. (1994). Norms of apparent temperature in Australia. Aust. Meteor. Mag. 43: 1-16.
 * @param {number} t,rh,wind,rshort,sunelev
 * @return {number}
 */

function steadman_outdoor(t, rh, wind, solar, sunelev) {
  var steadman_outdoor_sun = 9999;
  if (rh > 100.1 || rh < 0.0) {
    return 9999;
  }
  if (t > 100.0 || t < -100.0) {
    return 9999;
  }
  if (solar < 50) {
    return steadman_outdoor_shade(t, rh, wind);
  } else {
    var ee = (rh / 1000.0) * (6.105 * Math.exp((t * 17.27) / (237.7 + t)));
    var q_glob =
      0.56 * (0.386 - 0.0032 * sunelev) * solar +
      0.224 * (0.1 * solar) +
      0.028 * solar -
      150.0 * (0.38 - 0.16 * Math.pow(ee, 0.5));
    if (q_glob > 0.0) {
      steadman_outdoor_sun = t + 3.48 * ee - 0.7 * wind + (0.7 * q_glob) / (wind + 10.0) - 4.25;
    }
  }
  return TwoDec(steadman_outdoor_sun);
}

/**
 * Given air temperature (Celsius), rh relative humidity (%), wind velocity (m/sec)
 * gives Steadman outdoor shade index.
 *
 *
 * References:
 *   - Steadman R.G. (1994). Norms of apparent temperature in Australia. Aust. Meteor. Mag. 43: 1-16.
 * @param {number} t, rh,wind
 * @return {number}
 */

function steadman_outdoor_shade(t, rh, wind) {
  var steadman_outdoor_shade, e;

  steadman_outdoor_shade = 9999;

  if (rh > 100.1 || rh < 0.0) {
    return 9999;
  } else if (wind > 130.0 || wind < 0.0) {
    return 9999;
  } else if (t > 100.0 || t < -100.0) {
    return 9999;
  } else {
    e = (rh / 100.0) * (6.105 * Math.exp((t * 17.27) / (237.7 + t)));
    steadman_outdoor_shade = t + 0.33 * e - 0.7 * wind - 4.0;
  }

  return TwoDec(steadman_outdoor_shade);
}

/**
 * Given air temperature (Celsius), relative humidity (%)  gives Steadman indoor index.
 *
 *
 * References:
 *   - Steadman R.G. (1994). Norms of apparent temperature in Australia. Aust. Meteor. Mag. 43: 1-16.
 * @param {number} t, rh
 * @return {number}
 */

function steadman_indoor(t, rh) {
  var steadman_indoor, e;

  steadman_indoor = -9999;

  if (rh > 100.1 || rh < 0.0) {
    return -9999;
  } else if (t > 100.0 || t < -100.0) {
    return -9999;
  } else {
    e = (rh / 100.0) * (6.105 * Math.exp((t * 17.27) / (237.7 + t)));
    steadman_indoor = -2.56 + 0.89 * t + 0.382 * e;
  }

  return TwoDec(steadman_indoor);
}

/**
 * UTCI assessment class (1-10): 1 extreme cold stress (<= -40), 2 very strong cold (-40,-27],
 * 3 strong cold (-27,-13], 4 moderate cold (-13,0], 5 slight cold (0,9], 6 no thermal stress (9,26],
 * 7 moderate heat (26,32], 8 strong heat (32,38], 9 very strong heat (38,46], 10 extreme heat stress (> 46).
 * Labels: utci_class_text.
 *
 * References:
 *   - Blazejczyk K., Jendritzky G., Broede P., Fiala D., Havenith G., Epstein Y., Psikuta A., Kampmann B.
 *     (2013). An introduction to the Universal Thermal Climate Index (UTCI). Geographia Polonica 86(1): 5-10.
 *     doi:10.7163/GPol.2013.1
 * @param {number} t,rh,wind,trad air temperature (degC), relative humidity (%), wind at 10 m (m/s), Tmrt (degC)
 * @return {number} class 1-10; 9999 if UTCI is out of its validity range
 */

function utci_class(t, rh, wind, trad) {
  var u = UTCI(t, rh, wind, trad);
  if (isNaN(u) || u == 9999) return 9999; // out of the validity range of UTCI
  if (u > 46.0) return 10;
  if (u > 38.0) return 9;
  if (u > 32.0) return 8;
  if (u > 26.0) return 7;
  if (u > 9.0) return 6;
  if (u > 0.0) return 5;
  if (u > -13.0) return 4;
  if (u > -27.0) return 3;
  if (u > -40.0) return 2;
  return 1;
}

/**
 * Reduced 7-class UTCI scale (merges the official classes, see utci_class7_text): 1 <= -40, 2 (-40,-27],
 * 3 (-27,-13], 4 (-13,0], 5 (0,16], 6 (16,32], 7 > 32 degC.
 *
 * References:
 *   - Blazejczyk K., Jendritzky G., Broede P., Fiala D., Havenith G., Epstein Y., Psikuta A., Kampmann B.
 *     (2013). An introduction to the Universal Thermal Climate Index (UTCI). Geographia Polonica 86(1): 5-10.
 *     doi:10.7163/GPol.2013.1
 * @param {number} t,rh,wind,trad air temperature (degC), relative humidity (%), wind at 10 m (m/s), Tmrt (degC)
 * @return {number} class 1-7; 9999 if UTCI is out of its validity range
 */

function utci_class7(t, rh, wind, trad) {
  var u = UTCI(t, rh, wind, trad);
  if (isNaN(u) || u == 9999) return 9999; // out of the validity range of UTCI
  if (u > 32.0) return 7;
  if (u > 16.0) return 6;
  if (u > 0.0) return 5;
  if (u > -13.0) return 4;
  if (u > -27.0) return 3;
  if (u > -40.0) return 2;
  return 1;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%) gives the Scharlau sultriness state as text
 * (see sharlau_class); lang = "en" (default, as in previous versions) or "it".
 *
 *
 * References:
 *   - Scharlau K. (1950). Einfuehrung eines Schwuelemassstabes und Abgrenzung von Schwuelezonen durch
 *     Isohygrothermen. Erdkunde 4: 188-201.
 * @param {number} t,rh,lang
 * @return {string}
 */

function sharlau_index_state(t, rh, lang) {
  lang = lang === "it" ? "it" : "en"; // English unless Italian is requested, as in previous versions
  var labels = {
    it: ["comfort", "lieve disagio da afa", "disagio da afa", "forte disagio da afa"],
    en: ["Comfort", "Slight unpleasant", "Unpleasant", "Heavy Unpleasant"]
  };
  return class_label(labels, sharlau_class(t, rh), lang);
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives sharlau index delta in celsius degrees.
 *
 *
 * References:
 *   - Scharlau K. (1950). Einfuehrung eines Schwuelemassstabes und Abgrenzung von Schwuelezonen durch
 *     Isohygrothermen. Erdkunde 4: 188-201.
 * @param {number} t,rh
 * @return {number}
 */

function sharlau_index_delta(t, rh) {
  var sharlau;
  var tcrit;

  if (t < 5.1) {
    tcrit = -0.0003 * Math.pow(rh, 2) + 0.1497 * rh - 7.7133;
  } else if (t > 15.1) {
    tcrit = -17.089 * Math.log(rh) + 94.979;
  } else {
    tcrit = t;
  }
  var deltatcrit = t - tcrit;

  return deltatcrit;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  RSI Relative strain index  (RSI).
 *
 *
 * References:
 *   - Lee D.H.K., Henschel A. (1963). Evaluation of thermal environment in shelters. Rep. TR-8, Div. Occup.
 *     Health, US Dept. Health, Education and Welfare.
 * @param {number} t,rh
 * @return {number}
 */

function RSI_index(t, rh) {
  var vap = pvap(t, rh);
  var RSI = (t - 21) / (58 - vap * 10);
  return TwoDec(RSI);
}

/**
 * Given air temperature (degC), relative humidity (%), wind velocity (m/sec) give humidex index.
 *
 *
 * References:
 *   - Masterton J.M., Richardson F.A. (1979). Humidex: a method of quantifying human discomfort due to
 *     excessive heat and humidity. CLI 1-79, Environment Canada, Downsview, Ontario.
 * @param {number} t,rh
 * @return {number}
 */

function humidex(t, rh) {
  var humidex, e;
  humidex = -9999;

  if (rh > 100.1 || rh < 0.0) {
    return -9999;
  } else if (t > 100.0 || t < -100.0) {
    return 9999;
  } else {
    e = (rh / 100.0) * (6.105 * Math.exp((t * 17.27) / (237.7 + t)));
    humidex = t + 0.5555 * (e - 10.0);
  }

  return TwoDec(humidex);
}

/**
 * Thom's discomfort index in the Celsius and relative humidity form of Giles et al. (1990), also called
 * temperature-humidity index (THI): DI = t - 0.55 (1 - 0.01 rh) (t - 14.5). Classes: thi_class.
 * Note: up to this version the function used 0.8 t - 0.55 (0.01 rh)(t - 14.4) + 46.4, a mixture of the
 * livestock THI and Thom's index that decreased with humidity; for the livestock THI use THI_kibler.
 *
 * References:
 *   - Thom E.C. (1959). The discomfort index. Weatherwise 12(2): 57-61. doi:10.1080/00431672.1959.9926960
 *   - Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and
 *     1988. Int. J. Biometeorol. 34: 98-104.
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @return {number} DI (degC)
 */
function THI(t, rh) {
  return t - 0.55 * (1 - 0.01 * rh) * (t - 14.5);
}

/**
 * Given air temperature (degC), relative humidity (%)  gives Temperature Humidity
 * Index discomfort index. kliber (1964) Kibler H. H., 1964. Environmental physiology
 * and shelter engineering. LXVII.
 * Thermal effects of various temperature-humidity combinations on Holstein cattle
 * as measured by physiological responses. Res. Bull. Missouri Agric. Exp. Station: 862
 *
 * References:
 *   - Kibler H.H. (1964). Environmental physiology and shelter engineering LXVII. Thermal effects of various
 *     temperature-humidity combinations on Holstein cattle. Res. Bull. Missouri Agric. Exp. Stn. 862: 1-42.
 * @param {number} t,rh
 * @return {number}
 */

function THI_kibler(t, rh) {
  var thi;
  thi = 1.8 * t - (1 - 0.01 * rh) * (t - 14.3) + 32;
  return thi;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%), wind velocity in m/s and pair air pessure in hPa  gives    * Oxford index (WD).
 *
 * References:
 *   - Lind A.R., Hellon R.F. (1957). Assessment of physiological severity of hot climates. J. Appl. Physiol.
 *     11: 35-40.
 *   - Epstein Y., Moran D.S. (2006). Thermal comfort and the heat stress indices. Ind. Health 44: 388-398.
 * @param {number} t,rh,wind,pair
 * @return {number}
 */

function oxford_index(t, rh, wind, pair) {
  var ox;
  if (pair === undefined) {
    pair = 1010;
  }
  if (wind === undefined) {
    wind = 0.13;
  }

  var tw = natural_wetbulb(t, rh, wind, 0, 0, pair);

  ox = 0.85 * tw + 0.15 * t;
  return ox;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%), wind velocity
 * in m/s and pair air pessure in hPa  gives  Discomfort index (DI).
 *
 * References:
 *   - Epstein Y., Moran D.S. (2006). Thermal comfort and the heat stress indices. Ind. Health 44: 388-398.
 *   - Thom E.C. (1959). The discomfort index. Weatherwise 12(2): 57-61.
 * @param {number} t,rh,wind,pair
 * @return {number}
 */

function discomfort_index(t, rh, wind, pair) {
  var disc;
  if (pair === undefined) {
    pair = 1010;
  }
  if (wind === undefined) {
    wind = 0.13;
  }
  var tw = natural_wetbulb(t, rh, wind, 0, 0, pair);
  disc = 0.5 * tw + 0.5 * t;
  return disc;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%), wind velocity in m/s and pair air pessure in hPa  gives
 * Fighter index of thermal stress (FITS).
 *
 * References:
 *   - Nunneley S.A., Stribley R.F. (1979). Fighter index of thermal stress (FITS): guidance for hot-weather
 *     aircraft operations. Aviat. Space Environ. Med. 50: 639-642.
 * @param {number} t, rh, wind, pair
 * @return {number}
 */

function fits_index(t, rh, wind, pair) {
  var fits;
  if (pair === undefined) {
    pair = 1010;
  }
  if (wind === undefined) {
    wind = 0.13;
  }

  var tw = natural_wetbulb(t, rh, wind, 0, 0, pair);

  fits = 0.83 * tw + 0.35 * t + 5.08;
  return fits;
}

/**
 * lost_productivity is a function to estimate population heat exposure and impacts on working people
 *
 * References:
 *   - Kjellstrom T., Freyberg C., Lemke B., Otto M., Briggs D. (2018). Estimating population heat exposure and
 *     impacts on working people in conjunction with climate change. Int. J. Biometeorol. 62: 291-306.
 *     doi:10.1007/s00484-017-1407-0
 * @param {number} wbgt,tresh
 * @return {number}
 * Estimating population heat exposure and impacts on working people in conjunction with climate change
 * Tord Kjellstrom  & Chris Freyberg & Bruno Lemke & Matthias Otto & David Briggs
 * Int J Biometeorol (2018) 62:291-306 DOI 10.1007/s00484-017-1407-0
 */

function lost_productivity(wbgt, tresh) {
  if (tresh === undefined) {
    tresh = 33.5;
  }
  return 0.5 * (1 + erf((wbgt - tresh) / (3.75 * Math.sqrt(2)))) * 100;
}

/**
 * Given body mass index  by using antropometric features.
 * @param {number} h,w
 * @return {number}
 */

function BMW(h, w) {
  return w / Math.pow(h / 100, 2);
}

/**
 * Given body surface area by using antropometric features height and weigth.
 *
 * References:
 *   - DuBois D., DuBois E.F. (1916). A formula to estimate the approximate surface area if height and weight
 *     be known. Arch. Intern. Med. 17: 863-871.
 * @param {number} h,w
 * @return {number}
 */

function BSA(h, w) {
  return Math.pow(h / 100, 0.725) * (0.20247 * Math.pow(w, 0.425));
}

/**
 * Given met rate level by using clothing iso level and BSA.
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 *   - ISO 8996:2021. Ergonomics of the thermal environment - Determination of metabolic rate. ISO, Geneva.
 * @param {number} BSA, isolevel
 * @return {number}
 */

function met_rate(BSA, isolevel) {
  if (isolevel === undefined) {
    isolevel = 1;
  }

  return BSA * (isolevel * 50);
}

/**
 * Given met gives acclimated threshold of risk by using wbgt index.
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 *   - NIOSH (2016). Criteria for a recommended standard: occupational exposure to heat and hot environments.
 *     DHHS (NIOSH) Publication 2016-106.
 * @param {number} met
 * @return {number}
 */

function rel_acclimatized(met) {
  return 56.7 - 11.5 * getBaseLog(10, met);
}

/**
 * Given met gives unacclimated threshold of risk by using wbgt index.
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 *   - NIOSH (2016). Criteria for a recommended standard: occupational exposure to heat and hot environments.
 *     DHHS (NIOSH) Publication 2016-106.
 * @param {number} met
 * @return {number}
 */

function ral_unacclimatized(met) {
  return 59.9 - 14.1 * getBaseLog(10, met);
}

/**
 * Given  WBGT returns heat risk level in italian language by using a treshshold.
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 * @param {number} wbgt,tresh
 * @return {number}
 */

function heat_risk_text_level(wbgt, cav, tresh) {
  if (tresh === undefined) {
    tresh = 28.5;
  }
  var risk = (wbgt + cav) / tresh;
  var level_list = ["NON SIGNIFICATIVO", "BASSO", "MODERATO", "ALTO"];
  var classes;
  if (risk <= 0.8) {
    classes = 0;
  } else if (risk < 1) {
    classes = 1;
  } else if (risk < 1.2) {
    classes = 2;
  } else {
    classes = 3;
  }

  return level_list[classes];
}
/**
 * Given  WBGT returns heat risk level in four classes.
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 * @param {number} wbgt,tresh
 * @return {number}
 */

function heat_risk_level(wbgt, cav, tresh) {
  if (tresh === undefined) {
    tresh = 28.5;
  }
  var risk = (wbgt + cav) / tresh;
  var level_list = ["NON SIGNIFICATIVO", "BASSO", "MODERATO", "ALTO"];
  var classes;
  if (risk <= 0.8) {
    classes = 1;
  } else if (risk < 1) {
    classes = 2;
  } else if (risk < 1.2) {
    classes = 3;
  } else {
    classes = 4;
  }

  return classes;
}
/**
 * Given  WBGT returns heat risk level in english language by using a treshshold.
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 * @param {number} wbgt,tresh
 * @return {number}
 */

function heat_risk_text_level_eng(wbgt, cav, tresh) {
  if (tresh === undefined) {
    tresh = 28.5;
  }
  var risk = (wbgt + cav) / tresh;
  var level_list = ["NOT SIGNIFICANT", "LOW", "MODERATE", "HIGH"];
  var classes;
  if (risk <= 0.8) {
    classes = 0;
  } else if (risk < 1) {
    classes = 1;
  } else if (risk < 1.2) {
    classes = 2;
  } else {
    classes = 3;
  }

  return level_list[classes];
}

/**
 * Given  WBGT returns heat risk level as color code.
 * https://www.rapidtables.com/convert/color/hex-to-rgb.html
 * RISCHIO = 80% NESSUN RISCHIO (GREEN) rgb(0,255,0)
 * 80% < RISCHIO = 100% ATTENZIONE (YELLOW) rgb(255,255,0)
 * 100% < RISCHIO = 120% ALLARME (ORANGE) rgb(255,165,0)
 * RISCHIO > 120% EMERGENZA (RED) rgb(255,0,0)
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 * @param {number} wbgt,tresh
 * @return {text}
 */

function heat_risk_color_level(wbgt, cav, tresh) {
  if (tresh === undefined) {
    tresh = 28.5;
  }
  var risk = (wbgt + cav) / tresh;
  var colorcode_list = ["green", "yellow", "orange", "red"];
  var classes;
  if (risk <= 0.8) {
    classes = 0;
  } else if (risk < 1) {
    classes = 1;
  } else if (risk < 1.2) {
    classes = 2;
  } else {
    classes = 3;
  }
  return colorcode_list[classes];
}

/**
 *  Given  WBGT and CAV returns heat risk level as color code in hex format.
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 *  @param {number} wbgt,tresh
 *  RISCHIO = 80% NESSUN RISCHIO (GREEN) rgb(0,255,0) level 1
 *  80% < RISCHIO = 100% ATTENZIONE (YELLOW) rgb(255,255,0) level 2
 *  100% < RISCHIO = 120% ALLARME (ORANGE) rgb(255,165,0) level 3
 *  RISCHIO > 120% EMERGENZA (RED) rgb(255,0,0) level 4
 *  @return {text}
 */

function heat_risk_hexrgb_level(wbgt, cav, tresh) {
  if (tresh === undefined) {
    tresh = 28.5;
  }
  var risk = (wbgt + cav) / tresh;
  var colorcode_hex = ["#00ff00", "#ffff00", "#ffa500", "#ff0000"];
  var classes;
  var classes;
  if (risk <= 0.8) {
    classes = 0;
  } else if (risk < 1) {
    classes = 1;
  } else if (risk < 1.2) {
    classes = 2;
  } else {
    classes = 3;
  }
  return colorcode_hex[classes];
}

/**
 *  Given WBGT returns heat risk level value.
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 *  @param {number} wbgt,cav,tresh
 *  @return {number}
 */

function heat_risk_index_value(wbgt, cav, tresh) {
  if (tresh === undefined) {
    tresh = 28.5;
  }
  var risk = (wbgt + cav) / tresh;
  return risk;
}
/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  Wet-Bulb Dry Temperature (WBDT).
 *
 * WBDT = 0.4*Tw + 0.6*Ta, with Tw the natural wet-bulb temperature in shade and still air.
 *
 * References:
 *   - Epstein Y., Moran D.S. (2006). Thermal comfort and the heat stress indices. Ind. Health 44: 388-398.
 * @param {number} t, rh
 * @return {number}
 */

function wbdt(t, rh, pair) {
  if (pair === undefined) {
    pair = 1010;
  }
  var wbdt;
  var tw = natural_wetbulb(t, rh, 0, 0, 0, pair);
  wbdt = 0.4 * tw + 0.6 * t;
  return wbdt;
}

/**
 *  Given t air temperature (Celsius degrees), rh relative humidity (%) , wind speed in m per second,
 *  solar global radiation in  Watt/mq, tg globometric temperature gives, solar zenith in radians,  
 *  pair Air Pressure in millibar (hPa),alb_sfc mean albedo surface, fdir is the ratio between diffuse  
 *  and directed radiation, irad is 1 if the radiation is computed, diam is the diameter of heat globe,
 *  maxair and minair are  *  the range respect to air temperature
 *  to search solution and prec is the precision the function gives Wet-bulb globe temperature (WBGT)
 *  index following the Liljegren scheme .
 *
 * References:
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 *  @param {number} t,rh,wind,solar,zenith,pair,alb_sfc,fdir,irad,diam,maxair,minair,prec
 *  @return {number}
 */

function wbgt_sun(t, rh, wind, solar, zenith, pair, alb_sfc, fdir, irad, diam, maxair, minair, prec) {
  var wbgt;
  if (pair === undefined) {
    pair = 1010;
  }
  if (alb_sfc === undefined) {
    alb_sfc = 0.4;
  }
  if (fdir === undefined) {
    fdir = 0.8;
  }
  if (irad === undefined) {
    irad = 1;
  }
  if (diam === undefined) {
    diam = 0.05;
  }
  if (maxair === undefined) {
    maxair = 10;
  }
  if (minair === undefined) {
    minair = 2;
  }
  if (prec === undefined) {
    prec = 0.01;
  }

  var tg = tglob_sphere(t, rh, wind, solar, zenith, pair, maxair, minair, alb_sfc, fdir, diam, prec);
  var tw = natural_wetbulb(t, rh, wind, solar, zenith, pair, alb_sfc, fdir, irad, prec);

  wbgt = 0.7 * tw + 0.2 * tg + 0.1 * t;

  if (solar === undefined && zenith === undefined) {
    wbgt = 0.7 * tw + 0.3 * t;
  }

  return wbgt;
}

/**
 *  Given t air temperature (Celsius degrees), rh relative humidity (%) , wind speed in m/s, 
 *  pair Air Pressure in millibar (hPa),alb_sfc mean albedo surface, fdir is the ratio between 
 *  diffuse and directed radiation, 
 *  irad is 1 if the radiation is computed, diam is the diameter of heat globe, maxair and  
 *  minair are the range, respect to air temperature, where solution was searched.
 *  and prec is the precision.
 *
 * References:
 *   - Liljegren J.C., Carhart R.A., Lawday P., Tschopp S., Sharp R. (2008). Modeling the wet bulb globe
 *     temperature using standard meteorological measurements. J. Occup. Environ. Hyg. 5(10): 645-655.
 *     doi:10.1080/15459620802310770
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 *  @param {number} t, rh, wind, pair, alb_sfc, fdir, diam, prec
 *  @return {number}

 */

function wbgt_shade(t, rh, wind, pair, alb_sfc, fdir, diam, prec) {
  var wbgt;
  if (pair === undefined) {
    pair = 1010;
  }
  if (alb_sfc === undefined) {
    alb_sfc = 0.4;
  }
  if (fdir === undefined) {
    fdir = 0.8;
  }
  if (diam === undefined) {
    diam = 0.05;
  }
  if (prec === undefined) {
    diam = 0.1;
  }
  var tw = natural_wetbulb(t, rh, wind, 0.001, 0.0001, pair, alb_sfc, fdir, 1, prec);
  wbgt = 0.7 * tw + 0.3 * t;
  return wbgt;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%) and Tg globometric temperature  
 * gives  Wet-bulb globe temperature  index (WBGT).
 *
 * References:
 *   - Stull R. (2011). Wet-bulb temperature from relative humidity and air temperature. J. Appl. Meteor.
 *     Climatol. 50: 2267-2269. doi:10.1175/JAMC-D-11-0143.1
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 * @param {number} t, rh, tg
 * @return {number}
 */

function wbgt_stull(t, rh, tg) {
  var wbgt;
  var tw = wetbulb_stull(t, rh);
  wbgt = 0.7 * tw + 0.2 * tg + 0.1 * t;
  return wbgt;
}

/**
 * Given t air temperature (degC), rh relative humidity (%) , wind in m/s and pair air pressure  (hPa) 
 * and elevation in meters gives   gives  Wet-bulb globe temperature (WBGT) index indoor.  * Bernard Integration for wind.  * Refernce: Bernard TE, Pourmoghani M (1999)  "Prediction of Workplace Wet Bulb Global Temperature" in    
 * Applied Occupational and Environmental Hygiene 14: 126-134
 * Ramsey JD, Bernard TE (2000) Heat Stress in R Harris (ed) Patty's Industrial Hygiene and Toxicology
 * vol 2 New York:John Wiley & Sons 
 *
 * References:
 *   - Bernard T.E., Pourmoghani M. (1999). Prediction of workplace wet bulb global temperature. Appl. Occup.
 *     Environ. Hyg. 14: 126-134.
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet
 *     bulb globe temperature) index. ISO, Geneva.
 * @param {number} t, rh, wind, pair, elev
 * @return {number} wbgt

 */

function wbgt_indoor(t, rh, wind, pair, elev) {
  if (wind === undefined) {
    wind = 0.13;
  }
  if (pair === undefined) {
    pair = 1010;
  }
  if (elev === undefined) {
    elev = 0;
  }

  var wbgt;
  var pair = pheight(pair, elev);
  var tw = natural_wetbulb(t, rh, wind, 0, 0, pair);
  wbgt = 0.67 * tw + 0.33 * t - 0.048 * Math.log(wind) * (t - tw);
  if (wind < 1.1) {
    wbgt = 0.04 * t + 0.96 * tw;
  }
  return wbgt;
}

/**
 * Given t air temperature (degC), rh relative humidity (%) , wind in m/s and pair air pressure  (hPa)
 * gives Modified discomfort index (MDI).
 *
 * MDI = 0.75*Tw + 0.38*Ta (Moran et al., 1998).
 *
 * References:
 *   - Moran D.S., Shapiro Y., Epstein Y., Matthew W., Pandolf K.B. (1998). A modified discomfort index (MDI)
 *     as an alternative to the wet bulb globe temperature (WBGT). In: Hodgdon J.A., Heaney J.H., Buono M.J.
 *     (eds) Environmental Ergonomics VIII, pp. 77-80.
 *   - Epstein Y., Moran D.S. (2006). Thermal comfort and the heat stress indices. Ind. Health 44: 388-398.
 * @param {number} t,rh,wind,pair
 * @return {number}
 */

function mdi_index(t, rh, wind, pair) {
  if (pair === undefined) {
    pair = 1010;
  }
  if (wind === undefined) {
    wind = 0.13;
  }
  var mdi;
  var tw = natural_wetbulb(t, rh, wind, 0, 0, pair);
  mdi = 0.75 * tw + 0.38 * t;
  return mdi;
}

/**
 * Given t air temperature (degC), rh relative humidity (%) , wind in m/s and pair air pressure  * (hPa) gives the thom discomfort index.
 *
 * References:
 *   - Thom E.C. (1959). The discomfort index. Weatherwise 12(2): 57-61.
 * @param {number} t,rh,pair,wind
 * @return {number}
 */

function thom(t, rh, pair, wind) {
  var thom;
  if (pair === undefined) {
    pair = 1010;
  }
  if (wind === undefined) {
    wind = 0.13;
  }
  var tw = natural_wetbulb(t, rh, wind, 0, 0, pair);
  thom = 0.4 * (t + tw) + 4.8;
  return thom;
}

var THOM_DI_LABELS = {
  it: [
    "nessun disagio",
    "meno del 50% della popolazione avverte disagio",
    "oltre il 50% della popolazione avverte disagio",
    "la maggior parte della popolazione avverte disagio",
    "tutti avvertono un forte stress",
    "stato di emergenza sanitaria"
  ],
  en: [
    "no discomfort",
    "less than 50% of the population feels discomfort",
    "more than 50% of the population feels discomfort",
    "most of the population feels discomfort",
    "everyone feels severe stress",
    "state of medical emergency"
  ]
};

/**
 * Class of Thom's discomfort index in degC (Giles et al., 1990) for a DI value: 1 < 21, 2 21-24, 3 24-27,
 * 4 27-29, 5 29-32, 6 >= 32 (each class includes its lower bound). Used by thi_class and thom_class.
 *
 * References:
 *   - Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and
 *     1988. Int. J. Biometeorol. 34: 98-104.
 * @param {number} di discomfort index (degC)
 * @return {number} class 1-6
 */
function thom_di_class(di) {
  if (isNaN(di)) return 9999;
  if (di < 21) return 1;
  if (di < 24) return 2;
  if (di < 27) return 3;
  if (di < 29) return 4;
  if (di < 32) return 5;
  return 6;
}

/**
 * Class (1-6) of THI, Thom's discomfort index from temperature and relative humidity (see thom_di_class).
 *
 * References:
 *   - Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and
 *     1988. Int. J. Biometeorol. 34: 98-104.
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @return {number} class 1-6
 */
function thi_class(t, rh) {
  return thom_di_class(THI(t, rh));
}

/**
 * Text label of the THI class (see thi_class).
 *
 * References:
 *   - Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and
 *     1988. Int. J. Biometeorol. 34: 98-104.
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function thi_class_text(t, rh, lang) {
  return class_label(THOM_DI_LABELS, thi_class(t, rh), lang);
}

/**
 * Class (1-6) of Thom's discomfort index computed from dry and natural wet-bulb temperature (thom),
 * with the same thresholds as thi_class (see thom_di_class).
 *
 * References:
 *   - Thom E.C. (1959). The discomfort index. Weatherwise 12(2): 57-61. doi:10.1080/00431672.1959.9926960
 *   - Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and
 *     1988. Int. J. Biometeorol. 34: 98-104.
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @param {number} [pair=1010] air pressure (hPa)
 * @param {number} [wind=0.13] wind speed (m/s)
 * @return {number} class 1-6
 */
function thom_class(t, rh, pair, wind) {
  return thom_di_class(thom(t, rh, pair, wind));
}

/**
 * Text label of the class of thom (see thom_class).
 *
 * References:
 *   - Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and
 *     1988. Int. J. Biometeorol. 34: 98-104.
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @param {number} [pair=1010] air pressure (hPa)
 * @param {number} [wind=0.13] wind speed (m/s)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function thom_class_text(t, rh, pair, wind, lang) {
  return class_label(THOM_DI_LABELS, thom_class(t, rh, pair, wind), lang);
}

/**
 * Livestock Weather Safety Index class for the cattle THI of THI_kibler (LCI, 1970): 1 normal (< 75),
 * 2 alert (75-78), 3 danger (79-83), 4 emergency (>= 84).
 *
 * References:
 *   - Livestock Conservation Institute (1970). Patterns of transit losses. LCI, Omaha, Nebraska.
 *   - Mader T.L., Davis M.S., Brown-Brandl T. (2006). Environmental factors influencing heat stress in feedlot
 *     cattle. J. Anim. Sci. 84: 712-719.
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @return {number} class 1-4
 */
function thi_kibler_class(t, rh) {
  var thi = THI_kibler(t, rh);
  if (isNaN(thi)) return 9999;
  if (thi < 75) return 1;
  if (thi < 79) return 2;
  if (thi < 84) return 3;
  return 4;
}

/**
 * Text label of the Livestock Weather Safety Index class (see thi_kibler_class).
 *
 * References:
 *   - Livestock Conservation Institute (1970). Patterns of transit losses. LCI, Omaha, Nebraska.
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function thi_kibler_class_text(t, rh, lang) {
  var labels = {
    it: ["normale", "allerta", "pericolo", "emergenza"],
    en: ["normal", "alert", "danger", "emergency"]
  };
  return class_label(labels, thi_kibler_class(t, rh), lang);
}

/**
 * Given Ambient Air Temperature (< +10 Celsius) and relative air velocity wind ( 0.4 to 18 m/s)
 * give a windchill index - ISO11079.
 *
 * References:
 *   - Osczevski R., Bluestein M. (2005). The new wind chill equivalent temperature chart. Bull. Amer. Meteor.
 *     Soc. 86: 1453-1458. doi:10.1175/BAMS-86-10-1453
 *   - ISO 11079:2007. Ergonomics of the thermal environment - Determination and interpretation of cold stress
 *     when using required clothing insulation (IREQ) and local cooling effects. ISO, Geneva.
 * @param {number} t,wind
 * @return {number}
 */

function windchill(t, wind) {
  if (wind === undefined) wind = 1.3;
  if (wind < 1.3) wind = 1.3;
  wind = 3.6 * wind;
  var twc = 13.12 + 0.6215 * t - 11.37 * Math.pow(wind, 0.16) + 0.3965 * t * Math.pow(wind, 0.16);
  return twc;
}

/**
 * Given Ambient Air Temperature t (<+10 degC) and relative air velocity wind (0.4 to 18 m/s)
 * give a windchill index - ISO11079 in watt on mq.
 *
 * References:
 *   - Siple P.A., Passel C.F. (1945). Measurements of dry atmospheric cooling in subfreezing temperatures.
 *     Proc. Am. Philos. Soc. 89: 177-199.
 *   - ISO 11079:2007. Ergonomics of the thermal environment - Determination and interpretation of cold stress
 *     when using required clothing insulation (IREQ) and local cooling effects. ISO, Geneva.
 * @param {number} t,wind
 * @return {number}
 */

function wc_watt2mq(t, wind) {
  if (wind < 0.4) wind = 0.4;
  var Watts = (12.1452 + 11.6222 * Math.sqrt(wind) - 1.16222 * wind) * (33 - t);
  return Watts;
}

/**
 * Wind chill risk class (Environment and Climate Change Canada) on the rounded wind chill temperature:
 * 1 no risk (>= 1), 2 low (0 to -9), 3 moderate (-10 to -27), 4 high (-28 to -39), 5 very high (-40 to -47),
 * 6 severe (-48 to -54), 7 extreme (<= -55). Labels: windchill_class_text.
 *
 * References:
 *   - Environment and Climate Change Canada. Wind chill index (wind chill categories and frostbite times).
 *     https://www.canada.ca/en/environment-climate-change/services/weather-health/wind-chill-cold-weather/wind-chill-index.html
 * @param {number} t, wind
 * @return {number}
 */

function windchill_cla(t, wind) {
  if (wind === undefined) wind = 1.3;
  if (wind < 1.3) wind = 1.3;
  var wc = Math.round(windchill(t, wind)); // ECCC classes refer to integer wind chill values
  if (isNaN(wc)) return 9999;
  if (wc >= 1) return 1;
  if (wc >= -9) return 2;
  if (wc >= -27) return 3;
  if (wc >= -39) return 4;
  if (wc >= -47) return 5;
  if (wc >= -54) return 6;
  return 7;
}

/**
 * Returns the label of class c (1-based) from a table {it: [...], en: [...]} in the language lang
 * ("it" default, or "en"). Returns "" for invalid classes (e.g. 9999). Helper of the *_class_text functions.
 * @param {object} table labels per language
 * @param {number} c class number (1-based)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function class_label(table, c, lang) {
  var l = table[lang] || table.it;
  if (isNaN(c) || c < 1 || c > l.length || Math.floor(c) != c) {
    return "";
  }
  return l[c - 1];
}

var UTCI_LABELS = {
  it: [
    "stress da freddo estremo",
    "stress da freddo molto forte",
    "stress da freddo forte",
    "stress da freddo moderato",
    "stress da freddo lieve",
    "nessuno stress termico",
    "stress da caldo moderato",
    "stress da caldo forte",
    "stress da caldo molto forte",
    "stress da caldo estremo"
  ],
  en: [
    "extreme cold stress",
    "very strong cold stress",
    "strong cold stress",
    "moderate cold stress",
    "slight cold stress",
    "no thermal stress",
    "moderate heat stress",
    "strong heat stress",
    "very strong heat stress",
    "extreme heat stress"
  ]
};

/**
 * Text label of the UTCI assessment class (see utci_class): 10 classes from extreme cold stress
 * (UTCI <= -40) to extreme heat stress (UTCI > 46).
 *
 * References:
 *   - Blazejczyk K., Jendritzky G., Broede P., Fiala D., Havenith G., Epstein Y., Psikuta A., Kampmann B.
 *     (2013). An introduction to the Universal Thermal Climate Index (UTCI). Geographia Polonica 86(1): 5-10.
 *     doi:10.7163/GPol.2013.1
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} wind wind speed at 10 m (m/s)
 * @param {number} trad mean radiant temperature (degC)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string} label; "" if UTCI is out of its validity range
 */
function utci_class_text(t, rh, wind, trad, lang) {
  return class_label(UTCI_LABELS, utci_class(t, rh, wind, trad), lang);
}

/**
 * Text label of the 7-class UTCI scale of utci_class7, which merges the official classes:
 * 1 extreme cold (<= -40), 2 very strong cold (-40,-27], 3 strong cold (-27,-13], 4 moderate cold (-13,0],
 * 5 slight cold stress or no stress (0,16], 6 no stress or moderate heat stress (16,32],
 * 7 strong to extreme heat stress (> 32 degC).
 *
 * References:
 *   - Blazejczyk K., Jendritzky G., Broede P., Fiala D., Havenith G., Epstein Y., Psikuta A., Kampmann B.
 *     (2013). An introduction to the Universal Thermal Climate Index (UTCI). Geographia Polonica 86(1): 5-10.
 *     doi:10.7163/GPol.2013.1
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} wind wind speed at 10 m (m/s)
 * @param {number} trad mean radiant temperature (degC)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string} label; "" if UTCI is out of its validity range
 */
function utci_class7_text(t, rh, wind, trad, lang) {
  var labels = {
    it: [
      "stress da freddo estremo",
      "stress da freddo molto forte",
      "stress da freddo forte",
      "stress da freddo moderato",
      "stress da freddo lieve o nessuno stress",
      "nessuno stress o stress da caldo moderato",
      "stress da caldo da forte a estremo"
    ],
    en: [
      "extreme cold stress",
      "very strong cold stress",
      "strong cold stress",
      "moderate cold stress",
      "slight cold stress or no thermal stress",
      "no thermal stress or moderate heat stress",
      "strong to extreme heat stress"
    ]
  };
  return class_label(labels, utci_class7(t, rh, wind, trad), lang);
}

/**
 * Text label of the wind chill risk class of windchill_cla (Environment and Climate Change Canada):
 * 1 no risk (WCT >= 1), 2 low (0 to -9), 3 moderate (-10 to -27), 4 high (-28 to -39, frostbite in 10-30 min),
 * 5 very high (-40 to -47, 5-10 min), 6 severe (-48 to -54, 2-5 min), 7 extreme (<= -55, under 2 min).
 *
 * References:
 *   - Environment and Climate Change Canada. Wind chill index (wind chill categories and frostbite times).
 *     https://www.canada.ca/en/environment-climate-change/services/weather-health/wind-chill-cold-weather/wind-chill-index.html
 * @param {number} t    air temperature (degC)
 * @param {number} wind wind speed (m/s)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function windchill_class_text(t, wind, lang) {
  var labels = {
    it: [
      "nessun rischio",
      "rischio basso",
      "rischio moderato",
      "rischio alto: congelamento in 10-30 minuti",
      "rischio molto alto: congelamento in 5-10 minuti",
      "rischio grave: congelamento in 2-5 minuti",
      "rischio estremo: congelamento in meno di 2 minuti"
    ],
    en: [
      "no risk",
      "low risk",
      "moderate risk",
      "high risk: frostbite in 10-30 minutes",
      "very high risk: frostbite in 5-10 minutes",
      "severe risk: frostbite in 2-5 minutes",
      "extreme risk: frostbite in less than 2 minutes"
    ]
  };
  return class_label(labels, windchill_cla(t, wind), lang);
}

/**
 * Scharlau sultriness class: 1 comfort (delta >= 0), 2 slightly unpleasant (-1 <= delta < 0),
 * 3 unpleasant (-3 <= delta < -1), 4 heavily unpleasant (delta < -3), with delta = sharlau_index_delta.
 *
 * References:
 *   - Scharlau K. (1950). Einfuehrung eines Schwuelemassstabes und Abgrenzung von Schwuelezonen durch
 *     Isohygrothermen. Erdkunde 4: 188-201.
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @return {number} class 1-4
 */
function sharlau_class(t, rh) {
  var d = sharlau_index_delta(t, rh);
  if (isNaN(d)) return 9999;
  if (d >= 0) return 1;
  if (d >= -1) return 2;
  if (d >= -3) return 3;
  return 4;
}

/**
 * Humidex class (Environment and Climate Change Canada): 1 little or no discomfort (< 30),
 * 2 some discomfort (30-39), 3 great discomfort, avoid exertion (40-45), 4 dangerous, heat stroke possible (> 45).
 *
 * References:
 *   - Masterton J.M., Richardson F.A. (1979). Humidex: a method of quantifying human discomfort due to excessive
 *     heat and humidity. CLI 1-79, Environment Canada, Downsview, Ontario.
 *   - Environment and Climate Change Canada. How to use the Humidex.
 *     https://www.canada.ca/en/services/environment/weather/severeweather/humidex.html
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @return {number} class 1-4; 9999 if humidex cannot be computed
 */
function humidex_class(t, rh) {
  var h = humidex(t, rh);
  if (isNaN(h) || Math.abs(h) == 9999) return 9999;
  if (h < 30) return 1;
  if (h < 40) return 2;
  if (h <= 45) return 3;
  return 4;
}

/**
 * Text label of the humidex class (see humidex_class).
 *
 * References:
 *   - Environment and Climate Change Canada. How to use the Humidex.
 *     https://www.canada.ca/en/services/environment/weather/severeweather/humidex.html
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function humidex_class_text(t, rh, lang) {
  var labels = {
    it: [
      "disagio lieve o nullo",
      "un certo disagio",
      "forte disagio: evitare sforzi",
      "pericoloso: possibile colpo di calore"
    ],
    en: [
      "little or no discomfort",
      "some discomfort",
      "great discomfort; avoid exertion",
      "dangerous; heat stroke possible"
    ]
  };
  return class_label(labels, humidex_class(t, rh), lang);
}

/**
 * Heat index class (US National Weather Service): 1 no warning (HI < 80 F, 26.7 C), 2 caution (80-90 F),
 * 3 extreme caution (90-103 F), 4 danger (103-125 F), 5 extreme danger (>= 125 F, 51.7 C).
 *
 * References:
 *   - Rothfusz L.P. (1990). The heat index 'equation' (or, more than you ever wanted to know about heat index).
 *     NWS Southern Region Technical Attachment SR 90-23.
 *   - US National Weather Service. Heat index. https://www.weather.gov/ama/heatindex
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @return {number} class 1-5
 */
function heatindex_class(t, rh) {
  var hi = heatindex(t, rh);
  if (isNaN(hi)) return 9999;
  var hif = (hi * 9) / 5 + 32;
  if (hif < 80) return 1;
  if (hif < 90) return 2;
  if (hif < 103) return 3;
  if (hif < 125) return 4;
  return 5;
}

/**
 * Text label of the heat index class (see heatindex_class).
 *
 * References:
 *   - US National Weather Service. Heat index. https://www.weather.gov/ama/heatindex
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function heatindex_class_text(t, rh, lang) {
  var labels = {
    it: ["nessun avviso", "attenzione", "estrema attenzione", "pericolo", "pericolo estremo"],
    en: ["no warning", "caution", "extreme caution", "danger", "extreme danger"]
  };
  return class_label(labels, heatindex_class(t, rh), lang);
}

/**
 * PET class of thermal perception and physiological stress (Matzarakis & Mayer, 1996; VDI 3787 Part 2),
 * for a PET value from PET_Hoppe or PET_Walther: 1 very cold (< 4), 2 cold (4-8), 3 cool (8-13),
 * 4 slightly cool (13-18), 5 comfortable (18-23), 6 slightly warm (23-29), 7 warm (29-35), 8 hot (35-41),
 * 9 very hot (>= 41 degC). Each class includes its lower bound.
 *
 * References:
 *   - Matzarakis A., Mayer H. (1996). Another kind of environmental stress: thermal stress.
 *     WHO Collaborating Centre for Air Quality Management and Air Pollution Control, Newsletter 18: 7-10.
 *   - Matzarakis A., Mayer H., Iziomon M.G. (1999). Applications of a universal thermal index: physiological
 *     equivalent temperature. Int. J. Biometeorol. 43: 76-84. doi:10.1007/s004840050119
 * @param {number} pet PET (degC)
 * @return {number} class 1-9
 */
function pet_class(pet) {
  if (isNaN(pet)) return 9999;
  var lim = [4, 8, 13, 18, 23, 29, 35, 41];
  for (var i = 0; i < lim.length; i++) {
    if (pet < lim[i]) return i + 1;
  }
  return 9;
}

/**
 * Text label of the PET class (see pet_class), as thermal perception and grade of physiological stress.
 *
 * References:
 *   - Matzarakis A., Mayer H., Iziomon M.G. (1999). Applications of a universal thermal index: physiological
 *     equivalent temperature. Int. J. Biometeorol. 43: 76-84. doi:10.1007/s004840050119
 * @param {number} pet PET (degC)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function pet_class_text(pet, lang) {
  var labels = {
    it: [
      "molto freddo - stress da freddo estremo",
      "freddo - stress da freddo forte",
      "fresco - stress da freddo moderato",
      "leggermente fresco - stress da freddo lieve",
      "confortevole - nessuno stress termico",
      "leggermente caldo - stress da caldo lieve",
      "caldo - stress da caldo moderato",
      "molto caldo - stress da caldo forte",
      "estremamente caldo - stress da caldo estremo"
    ],
    en: [
      "very cold - extreme cold stress",
      "cold - strong cold stress",
      "cool - moderate cold stress",
      "slightly cool - slight cold stress",
      "comfortable - no thermal stress",
      "slightly warm - slight heat stress",
      "warm - moderate heat stress",
      "hot - strong heat stress",
      "very hot - extreme heat stress"
    ]
  };
  return class_label(labels, pet_class(pet), lang);
}

/**
 * ISO 7730 seven-point thermal sensation class for a PMV value (e.g. from PMV_ISO7730): PMV is rounded
 * to the nearest integer and limited to -3..+3; class = rounded PMV + 4 (1 cold ... 4 neutral ... 7 hot).
 *
 * References:
 *   - ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of
 *     thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria.
 * @param {number} pmv PMV value
 * @return {number} class 1-7
 */
function pmv_class(pmv) {
  if (isNaN(pmv) || typeof pmv !== "number") return 9999;
  var r = Math.round(pmv);
  if (r > 3) r = 3;
  if (r < -3) r = -3;
  return r + 4;
}

/**
 * Text label of the ISO 7730 thermal sensation scale for a PMV value (see pmv_class).
 *
 * References:
 *   - ISO 7730:2005. Ergonomics of the thermal environment - Analytical determination and interpretation of
 *     thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria.
 * @param {number} pmv PMV value
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function pmv_class_text(pmv, lang) {
  var labels = {
    it: ["freddo", "fresco", "leggermente fresco", "neutro", "leggermente caldo", "caldo", "molto caldo"],
    en: ["cold", "cool", "slightly cool", "neutral", "slightly warm", "warm", "hot"]
  };
  return class_label(labels, pmv_class(pmv), lang);
}

/**
 * Discomfort index class (Sohar et al.; Epstein & Moran, 2006) for the DI of discomfort_index:
 * 1 no heat stress (DI < 22), 2 mild (22-24), 3 moderate (24-28), 4 severe heat stress (>= 28 degC).
 *
 * References:
 *   - Epstein Y., Moran D.S. (2006). Thermal comfort and the heat stress indices. Ind. Health 44: 388-398.
 *     doi:10.2486/indhealth.44.388
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} [wind=0.13] wind speed (m/s)
 * @param {number} [pair=1010] air pressure (hPa)
 * @return {number} class 1-4
 */
function discomfort_index_class(t, rh, wind, pair) {
  var di = discomfort_index(t, rh, wind, pair);
  if (isNaN(di)) return 9999;
  if (di < 22) return 1;
  if (di < 24) return 2;
  if (di < 28) return 3;
  return 4;
}

/**
 * Text label of the discomfort index class (see discomfort_index_class).
 *
 * References:
 *   - Epstein Y., Moran D.S. (2006). Thermal comfort and the heat stress indices. Ind. Health 44: 388-398.
 *     doi:10.2486/indhealth.44.388
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} [wind=0.13] wind speed (m/s)
 * @param {number} [pair=1010] air pressure (hPa)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function discomfort_index_class_text(t, rh, wind, pair, lang) {
  var labels = {
    it: [
      "nessuno stress da caldo",
      "stress da caldo lieve",
      "stress da caldo moderato",
      "stress da caldo grave"
    ],
    en: ["no heat stress", "mild heat stress", "moderate heat stress", "severe heat stress"]
  };
  return class_label(labels, discomfort_index_class(t, rh, wind, pair), lang);
}

/**
 * Text label of the WBGT heat risk level (see heat_risk_level) in Italian or English; it replaces
 * heat_risk_text_level (Italian) and heat_risk_text_level_eng (English), kept for compatibility.
 *
 * References:
 *   - ISO 7243:2017. Ergonomics of the thermal environment - Assessment of heat stress using the WBGT (wet bulb
 *     globe temperature) index. ISO, Geneva.
 * @param {number} wbgt WBGT (degC)
 * @param {number} cav clothing adjustment value (degC)
 * @param {number} [tresh=28.5] reference WBGT limit (degC)
 * @param {string} [lang="it"] "it" or "en"
 * @return {string}
 */
function heat_risk_text(wbgt, cav, tresh, lang) {
  var labels = {
    it: ["NON SIGNIFICATIVO", "BASSO", "MODERATO", "ALTO"],
    en: ["NOT SIGNIFICANT", "LOW", "MODERATE", "HIGH"]
  };
  if (isNaN(wbgt) || isNaN(cav)) return "";
  return class_label(labels, heat_risk_level(wbgt, cav, tresh), lang);
}

/**
 * Given a temperature t (degC ) and wind ( m/sec) frost time following Wind chill chart.
 *
 * Facial frostbite time (minutes), Tikuisis & Osczevski (2003); wind is converted from m/s to km/h,
 * the unit required by the original equation. Returns 9999 outside -60 <= t <= -10 degC.
 *
 * References:
 *   - Tikuisis P., Osczevski R.J. (2003). Facial cooling during cold air exposure. Bull. Amer. Meteor. Soc.
 *     84: 927-933.
 *   - Environment and Climate Change Canada. Wind chill index (wind chill categories and frostbite times).
 *     https://www.canada.ca/en/environment-climate-change/services/weather-health/wind-chill-cold-weather/wind-chill-index.html
 * @param {number} t    air temperature (degC)
 * @param {number} wind wind speed at 10 m (m/s)
 * @return {number}
 */

function frostime(t, wind) {
  var ft;
  var wind_kmh = wind * 3.6;

  if (wind > 100.1 || wind < 0.0) return 9999;
  else if (t > -10.0 || t < -60.0) return 9999;
  else {
    ft = (-24.5 * (0.667 * wind_kmh + 4.8) + 2111) * Math.pow(-t - 4.8, -1.668); // minutes
  }
  return OneDec(ft);
}

/**
 * Normal Effective Temperature NET (degC): the temperature felt by a normally clothed person, which
 * indicates the thermal exchange between the human body and the environment. It is Missenard's
 * formulation of the effective temperature, extended to moving air (Gregorczuk & Cena), as used
 * operationally by the Hong Kong Observatory (Li & Chan, 2000):
 *   NET = 37 - (37 - t) / (0.68 - 0.0014 rh + 1 / (1.76 + 1.4 v^0.75)) - 0.29 t (1 - rh/100)
 * Central European thresholds (Blazejczyk et al., 2012): < 1 very cold, 1-9 cold, 9-17 cool,
 * 17-21 fresh, 21-23 comfortable, 23-27 warm, > 27 degC hot.
 *
 * References:
 *   - Missenard A. (1933). Temperature effective d'une atmosphere. Temperature resultante d'un milieu.
 *     Chauffage et Industrie, Paris.
 *   - Gregorczuk M., Cena K. (1967). Distribution of effective temperature over the surface of the Earth. Int.
 *     J. Biometeorol. 11: 145-149.
 *   - Li P.W., Chan S.T. (2000). Application of a weather stress index for alerting the public to stressful
 *     weather in Hong Kong. Meteorol. Appl. 7(4): 369-375. doi:10.1017/S1350482700001602
 *   - Blazejczyk K., Epstein Y., Jendritzky G., Staiger H., Tinz B. (2012). Comparison of UTCI to selected
 *     thermal indices. Int. J. Biometeorol. 56: 515-535. doi:10.1007/s00484-011-0453-2
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} wind wind speed (m/s)
 * @return {number} NET (degC); 9999 for inputs out of range
 */

function net_index(t, rh, wind) {
  var net = 9999;
  if (rh > 100.1 || rh < 0.0) {
    return 9999;
  } else if (wind > 130.0 || wind < 0.0) {
    return 9999;
  } else if (t > 100.0 || t < -100.0) {
    return 9999;
  } else {
    net =
      37 -
      (37 - t) / (0.68 - 0.0014 * rh + 1 / (1.76 + 1.4 * Math.pow(wind, 0.75))) -
      0.29 * t * (1.0 - 0.01 * rh);
  }
  return TwoDec(net);
}

/**
 * Normal Effective Temperature class for Central Europe (Blazejczyk et al., 2012), computed from net_index:
 * 1 = very cold (< 1), 2 = cold (1-9), 3 = cool (9-17), 4 = fresh (17-21), 5 = comfortable (21-23),
 * 6 = warm (23-27), 7 = hot (>= 27 degC). Each class includes its lower bound.
 *
 * References:
 *   - Blazejczyk K., Epstein Y., Jendritzky G., Staiger H., Tinz B. (2012). Comparison of UTCI to selected
 *     thermal indices. Int. J. Biometeorol. 56: 515-535. doi:10.1007/s00484-011-0453-2
 *   - Li P.W., Chan S.T. (2000). Application of a weather stress index for alerting the public to stressful
 *     weather in Hong Kong. Meteorol. Appl. 7(4): 369-375. doi:10.1017/S1350482700001602
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} wind wind speed (m/s)
 * @return {number} class 1-7; 9999 if NET cannot be computed
 */
function net_class(t, rh, wind) {
  var net = net_index(t, rh, wind);
  if (net == 9999 || isNaN(net)) {
    return 9999;
  }
  if (net < 1) return 1;
  if (net < 9) return 2;
  if (net < 17) return 3;
  if (net < 21) return 4;
  if (net < 23) return 5;
  if (net < 27) return 6;
  return 7;
}

/**
 * Text label of the Normal Effective Temperature class for Central Europe (see net_class).
 *
 * References:
 *   - Blazejczyk K., Epstein Y., Jendritzky G., Staiger H., Tinz B. (2012). Comparison of UTCI to selected
 *     thermal indices. Int. J. Biometeorol. 56: 515-535. doi:10.1007/s00484-011-0453-2
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} wind wind speed (m/s)
 * @param {string} [lang="it"] "it" (Italian) or "en" (English)
 * @return {string} class label; "" if NET cannot be computed
 */
function net_class_text(t, rh, wind, lang) {
  var labels = {
    it: ["molto freddo", "freddo", "fresco", "gradevole", "confortevole", "caldo moderato", "caldo"],
    en: ["very cold", "cold", "cool", "fresh", "comfortable", "warm", "hot"]
  };
  var l = labels[lang] || labels.it;
  var c = net_class(t, rh, wind);
  if (c == 9999) {
    return "";
  }
  return l[c - 1];
}

/**
 * Effective temperature ET (degC) in still air: analytical approximation by Missenard of the
 * Houghten & Yaglou (1923) effective temperature scale, ET = t - 0.4 (t - 10) (1 - rh/100).
 * For moving air use net_index (Normal Effective Temperature, with wind).
 *
 * References:
 *   - Houghten F.C., Yaglou C.P. (1923). Determining lines of equal comfort. ASHVE Trans. 29: 163-176.
 *   - Missenard A. (1933). Temperature effective d'une atmosphere. Temperature resultante d'un milieu.
 *     Chauffage et Industrie, Paris.
 *   - Blazejczyk K., Epstein Y., Jendritzky G., Staiger H., Tinz B. (2012). Comparison of UTCI to selected
 *     thermal indices. Int. J. Biometeorol. 56: 515-535. doi:10.1007/s00484-011-0453-2
 * @param {number} t  air temperature (degC)
 * @param {number} rh relative humidity (%)
 * @return {number} ET (degC)
 */
function ET_Missenard(t, rh) {
  return TwoDec(t - 0.4 * (t - 10) * (1 - rh / 100));
}

/**
 * Corrected effective temperature CET (degC): the effective temperature computed with the globe
 * temperature in place of the air temperature (Vernon & Warner, 1932), keeping the actual water
 * vapour pressure. The original CET is read from a nomogram; here the Normal Effective Temperature
 * formula with wind (net_index, Gregorczuk & Cena / Li & Chan) is used as its analytical form, so the
 * result is an approximation of the CET "normal" (clothed) scale. CET equals NET when tg = t.
 *
 * References:
 *   - Vernon H.M., Warner C.G. (1932). The influence of the humidity of the air on capacity for work at
 *     high temperatures. J. Hyg. 32(3): 431-462.
 *   - Bedford T. (1946). Environmental warmth and its measurement. Medical Research Council War Memorandum
 *     No. 17. HMSO, London.
 *   - Gregorczuk M., Cena K. (1967). Distribution of effective temperature over the surface of the Earth.
 *     Int. J. Biometeorol. 11: 145-149.
 * @param {number} t    air temperature (degC)
 * @param {number} rh   relative humidity (%)
 * @param {number} wind air speed (m/s)
 * @param {number} tg   globe temperature (degC, 150 mm black globe)
 * @return {number} CET (degC); 9999 outside the validity range of net_index
 */
function CET(t, rh, wind, tg) {
  if (wind === undefined) {
    wind = 0.1;
  }
  var e = (rh / 100) * es(t); // actual vapour pressure (hPa)
  var rh_g = Math.min(100, (100 * e) / es(tg)); // relative humidity referred to the globe temperature
  return net_index(tg, rh_g, wind);
}

/**
 * Given air temperature (Celsius), relative humidity (%) give Summer Simmer Index  in degC.
 *
 *
 * References:
 *   - Pepi J.W. (1987). The Summer Simmer Index. Weatherwise 40(3): 143-145. doi:10.1080/00431672.1987.9933356
 * @param {number} t,rh
 * @return {number}
 */

function ssi_index(t, rh) {
  var ssi = 9999;
  if (rh > 100.1 || rh < 0.0) {
    return ssi;
  } else if (t > 100.0 || t < -100.0) {
    return ssi;
  } else {
    ssi =
      (1.98 * ((9.0 / 5.0) * t + 32.0 - (0.55 - 0.0055 * rh) * ((9.0 / 5.0) * t + 32.0 - 58.0)) -
        56.83 -
        32.0) /
      1.8;
  }
  return TwoDec(ssi);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Pressure

/**
 * Given press air pressure in millibar, elev is altitude in meters
 * and mean temperature of the air column calculate the local value of pressure
 * @param {number} press,topo,temp
 * @return {number}
 */

function p_local(press, elev, temp) {
  var T0;
  if (temp === undefined) {
    temp = 15.0;
  }
  var temp = temp + 273.15; // Formula isometrica di Laplace
  var L = -0.0065; // temperature lapse rate L = -0.0065 K/m
  var R_cost = 287.05; // gas constant for dry air, J/(kg*degK) = 287.05
  var T0 = temp - (L / 2) * elev; // sea level standard temperature T0 = 288.15 K
  var p_local = press * Math.exp((-elev * 9.81) / (R_cost * T0));
  return p_local;
}

/**
 * References:
 *   - ASHRAE (2005/2017). ASHRAE Handbook - Fundamentals, ch. 1 Psychrometrics. ASHRAE, Atlanta.
 */

function pheight(press, elev) {
  var pressalt = press * Math.pow(1 - 2.25577 * 0.00001 * elev, 5.25588);
  return pressalt;
}

/**
 * Given t air temperature, rh relative humidity (%), p local air pressure gives
 * partial pressure of oxygen.
 *
 *
 * References:
 *   - Ovcharova V.F., Butyeva I.V., Shveinova T.G., Aleshina T.P. (1974). Specialized weather forecast for
 *     medical purposes and prevention of meteopathic reactions. Vopr. Kurortol. Fizioter. Lech. Fiz. Kult. 2:
 *     109-119 (in Russian).
 * @param {number} t,rh,pair
 * @return {number}
 */

function poda(t, rh, pair) {
  var poda;
  var vpa = (rh / 100) * 6.105 * Math.pow(2.718281828, (17.27 * t) / (237.7 + t));
  poda = ((80.51 * pair) / (t + 273.15)) * (1.0 - vpa / pair);
  return poda;
}

/**
 * Given air temperature (degC) calculates Saturated Vapor Pressure (Torr)
 * @param {number} t
 * @return {number}
 */

function vpaTorr(t) {
  return Math.exp(18.6686 - 4030.183 / (t + 235.0));
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Conversion related functions.

function mbtommHG(mb) {
  var mmHG;
  mmHG = 0.750062 * mb;
  return mmHG;
}

function torr2p(vp, vpunits) {
  if (vpunits == "atm") {
    return vp / 760.0;
  } else if (vpunits == "bar") {
    return (vp / 760.0) * 1.01325;
  } else if (vpunits == "Pa") {
    return (vp / 760.0) * 101325.0;
  } else if (vpunits == "hPa") {
    return (vp / 760.0) * 1013.25;
  } else if (vpunits == "mbar") {
    return (vp / 760.0) * 1013.25;
  } else if (vpunits == "psi") {
    return (vp / 760.0) * 14.696;
  } else if (vpunits == "dyne/cm2") {
    return (vp / 760.0) * 10132.5;
  } else {
    return vp;
  }
}

function mbtoinHG(mb) {
  var inHG;
  inHG = 0.02953 * mb;
  return inHG;
}

function mbtokPA(mb) {
  var kPA;
  kPA = mb / 10;
  return kPA;
}

function mbtolbsinch(mb) {
  var lbsinch;
  lbsinch = 0.0145038 * mb;
  return lbsinch;
}

function mph2knots(mph) {
  var knots = 0.868391 * mph;
  return knots;
}

function mph2ms(mph) {
  var ms = 0.44704 * mph;
  return ms;
}

function mph2fts(mph) {
  var fts = 1.46667 * mph;
  return fts;
}

function mph2kmh(mph) {
  var kmh = 1.609344 * mph;
  return kmh;
}

function knots2mph(knots) {
  var mph = 1.15155 * knots;
  return mph;
}

function knots2ms(knots) {
  var ms = 0.514791 * knots;
  return ms;
}

function knots2fts(knots) {
  var fts = 1.68895 * knots;
  return fts;
}

function knots2kmh(knots) {
  var kmh = 1.85325 * knots;
  return kmh;
}

function ms2mph(ms) {
  var mph = 2.23694 * ms;
  return mph;
}

function ms2knots(ms) {
  var knots = 1.94254 * ms;
  return knots;
}

function ms2fts(ms) {
  var fts = 3.28084 * ms;
  return fts;
}

function ms2kmh(ms) {
  var kmh = 3.6 * ms;
  return kmh;
}

function fts2mph(fts) {
  var mph = 0.681818 * fts;
  return mph;
}

function fts2knots(fts) {
  var knots = 0.592085 * fts;
  return knots;
}

function fts2ms(fts) {
  var ms = 0.3048 * fts;
  return ms;
}

function fts2kmh(fts) {
  var kmh = 1.09728 * fts;
  return kmh;
}

function kmh2mph(kmh) {
  var mph = 0.621371 * kmh;
  return mph;
}

function kmh2knots(kmh) {
  var knots = 0.539593 * kmh;
  return knots;
}

function kmh2ms(kmh) {
  var ms = 0.277778 * kmh;
  return ms;
}

function kmh2fts(kmh) {
  var fts = 0.911344 * kmh;
  return fts;
}

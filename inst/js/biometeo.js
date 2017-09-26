//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////
// Define global constants for functions.

var    Patm = 101325.0; // pascal
var    CpAir= 1004.0;
var    CpWat= 4186.0;
var    CpVap= 1805.0;
var    Hfg= 2501000.0;
var    RAir= 287.055;
var    TKelConv= 273.15;
var    PI   = Math.PI,
       pi = Math.PI,
       twopi = 2 * pi,
       rad  = PI / 180,
       radians = PI / 180,
       degrees = 180 / PI,
       J1970 = 2440588,
       J2000 = 2451545;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Format  functions.

function OneDec(c) 
{
    return Math.round(10 * c) / 10;
}

function TwoDec(c) 
{
    return Math.round(100 * c) / 100;
}

function ThreeDec(c) 
{
    return Math.round(1000 * c) / 1000;
}

function FourDec(c) 
{
    return Math.round(10000 * c) / 10000;
}

function scientificNotation(c,e)
 {
    return c.toPrecision(e);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math & Trigonometric functions.

function radToDeg(angleRad) 
{
  return (180.0 * angleRad / Math.PI);
}

function degToRad(angleDeg) 
{
  return (Math.PI * angleDeg / 180.0);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Date related functions.

function ExcelDateToJSDate(serial) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);

   var fractional_day = serial - Math.floor(serial) + 0.0000001;

   var total_seconds = Math.floor(86400 * fractional_day);

   var seconds = total_seconds % 60;

   total_seconds -= seconds;

   var hours = Math.floor(total_seconds / (60 * 60));
   var minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

Date.prototype.getJulian = function() 
{
    return Math.floor((this / 86400000) - (this.getTimezoneOffset()/1440) + 2440587.5);
  
};


Date.prototype.isLeapYear = function() 
{
    var year = this.getFullYear();
    if((year & 3) !== 0) return false;
    return ((year % 100) !== 0 || (year % 400) === 0);
};


Date.prototype.getDOY = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

String.prototype.toDate = function(format)
{
  var normalized      = this.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  var formatItems     = normalizedFormat.split('-');
  var dateItems       = normalized.split('-');

  var monthIndex  = formatItems.indexOf("mm");
  var dayIndex    = formatItems.indexOf("dd");
  var yearIndex   = formatItems.indexOf("yyyy");
  var hourIndex     = formatItems.indexOf("hh");
  var minutesIndex  = formatItems.indexOf("ii");
  var secondsIndex  = formatItems.indexOf("ss");

  var today = new Date();

  var year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
  var month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
  var day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

  var hour    = hourIndex>-1      ? dateItems[hourIndex]    : today.getHours();
  var minute  = minutesIndex>-1   ? dateItems[minutesIndex] : today.getMinutes();
  var second  = secondsIndex>-1   ? dateItems[secondsIndex] : today.getSeconds();

  return new Date(year,month,day,hour,minute,second);
};

function getDOY(datetime) 
{

  return(datetime.getDOY());
}

function toJulian(date) 
{ return date.valueOf() / (1000 *60*60 * 24) -0.5 + J1970; }  // è il calcolo JD corretto.

function fromJulian(j)  
{ return new Date((j + 0.5 - J1970) * (1000 *60*60 * 24)); } 

function toDays(date)  
 { return toJulian(date) - J2000; }

function parseISO8601String(dateString) 
    {
    var timebits = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(?::([0-9]*)(\.[0-9]*)?)?(?:([+-])([0-9]{2})([0-9]{2}))?/;
    var m = timebits.exec(dateString);
    var resultDate;
    if (m) {
        var utcdate = Date.UTC(parseInt(m[1]),
                               parseInt(m[2])-1, // months are zero-offset (!)
                               parseInt(m[3]),
                               parseInt(m[4]), parseInt(m[5]), // hh:mm
                               (m[6] && parseInt(m[6]) || 0),  // optional seconds
                               (m[7] && parseFloat(m[7])*1000) || 0); // optional fraction
        // utcdate is milliseconds since the epoch
        if (m[9] && m[10]) {
            var offsetMinutes = parseInt(m[9]) * 60 + parseInt(m[10]);
            utcdate += (m[8] === '+' ? -1 : +1) * offsetMinutes * 60000;
        }
        resultDate = new Date(utcdate);
    } else {
        resultDate = null;
    }
    return resultDate;
}


/**
 * Given a year return if is a leap year.
 *
 * @param {number} yr
 * @return {String}
 * @customfunction
 */


function isLeapYear(yr) 
{
  return ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0);
}

/**
 * Given a date, return the name of the day for that date.
 *
 * @param {Date} date
 * @return {String}
 * @customfunction
 */

function dayname_IT(date) 
  {
  var dayNumberNameMap = {
    0: 'Domenica',
    1: 'Lunedi',
    2: 'Martedi',
    3: 'Mercoledi',
    4: 'Giovedi',
    5: 'Venerdi',
    6: 'Sabato'},
      dayName,
      dayNumber;
 
  if(! date.getDay ) {
    throw TypeError('TypeError: Argument is not of type "Date"!');
  }
  
  dayNumber = date.getDay();
  dayName = dayNumberNameMap[dayNumber];
  return dayName;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sun related  functions.


function sun_data(serial,lat,lon,parameter) 
   {
    var datetime=serial.toDate("yyyy-mm-dd hh:ii:ss"); 
    var udtTimedHours=datetime.getHours() - 0;
    var udtTimedMinutes =datetime.getMinutes() - 0;
    var udtTimedSeconds = datetime.getSeconds() - 0;
    var udtLocationdLongitude = lon - 0;
    var udtLocationdLatitude = lat - 0;
    var dEarthMeanRadius = 6371.01;
    var dAstronomicalUnit = 149597890;
    var dDecimalHours = udtTimedHours + (udtTimedMinutes + udtTimedSeconds / 60) / 60;
    var dJulianDate = datetime.valueOf() / (1000.0 *60.0*60.0 * 24.0) - 0.5  + J1970;
    var dElapsedJulianDays = dJulianDate - 2451545;
    var dOmega = 2.1429 - 0.0010394594 * dElapsedJulianDays;
    var dMeanLongitude = 4.895063 + 0.017202791698 * dElapsedJulianDays;
    var dMeanAnomaly = 6.24006 + 0.0172019699 * dElapsedJulianDays;
    var dEclipticLongitude = dMeanLongitude + 0.03341607 * Math.sin(dMeanAnomaly) + 3.4894E-4 * Math.sin(2 * dMeanAnomaly) - 1.134E-4 - 2.03E-5 * Math.sin(dOmega);
    var dEclipticObliquity = 0.4090928 - 6.214E-9 * dElapsedJulianDays + 3.96E-5 * Math.cos(dOmega);
    var dSin_EclipticLongitude = Math.sin(dEclipticLongitude);
    var dY = Math.cos(dEclipticObliquity) * dSin_EclipticLongitude;
    var dX = Math.cos(dEclipticLongitude);
    var dRightAscension = Math.atan2(dY, dX);
    0 > dRightAscension && (dRightAscension += twopi);
    var dDeclination = Math.asin(Math.sin(dEclipticObliquity) * dSin_EclipticLongitude);
    var dGreenwichMeanSiderealTime = 6.6974243242 + 0.0657098283 * dElapsedJulianDays + dDecimalHours;
    var dLocalMeanSiderealTime = (15 * dGreenwichMeanSiderealTime +udtLocationdLongitude) * rad;
    var dHourAngle = dLocalMeanSiderealTime - dRightAscension;
    var dLatitudeInRadians = udtLocationdLatitude * rad;
    var dCos_Latitude = Math.cos(dLatitudeInRadians);
    var dSin_Latitude = Math.sin(dLatitudeInRadians);
    var dCos_HourAngle = Math.cos(dHourAngle);
    var udtSunCoordinatesdZenithAngle = Math.acos(dCos_Latitude * dCos_HourAngle * Math.cos(dDeclination) + Math.sin(dDeclination) * dSin_Latitude);
    dY = -Math.sin(dHourAngle);
    dX = Math.tan(dDeclination) * dCos_Latitude - dSin_Latitude * dCos_HourAngle;
    var udtSunCoordinatesdAzimuth = Math.atan2(dY,dX);
    0 > udtSunCoordinatesdAzimuth && (udtSunCoordinatesdAzimuth += twopi);
    udtSunCoordinatesdAzimuth /= rad;
    var dParallax = dEarthMeanRadius / dAstronomicalUnit * Math.sin(udtSunCoordinatesdZenithAngle);
    udtSunCoordinatesdZenithAngle = (udtSunCoordinatesdZenithAngle + dParallax) / rad;
    var azimuth = udtSunCoordinatesdAzimuth;
    var zenith = udtSunCoordinatesdZenithAngle;
    var elevation = 90 - udtSunCoordinatesdZenithAngle;
    if (elevation > 85.0) {var refractionCorrection = 0.0;} 
        else {
        var te = Math.tan (degToRad(elevation));
        if (elevation > 5.0) 
            {var refractionCorrection = 58.1 / te - 0.07 / (te*te*te) + 0.000086 / (te*te*te*te*te);} 
        else if (elevation > -0.575) 
               {var refractionCorrection = 1735.0 + elevation * (-518.2 + elevation * (103.4 + elevation * (-12.79 + elevation * 0.711) ) );}  
        else {var refractionCorrection = -20.774 / te;}
        refractionCorrection = refractionCorrection / 3600.0;
    }

    var solarZen = zenith - refractionCorrection;
    if ( parameter == "azimuth") {return(FourDec(azimuth))}
    else if ( parameter == "zenith") {return(FourDec(zenith))}
    else if ( parameter == "solarZenith") {return(FourDec(solarZen))}
    else if ( parameter == "elevation") {return(FourDec(elevation))}
    else if ( parameter == "declination") {return(dDeclination*(180/PI))}
    else if ( parameter == "JD") {return(dJulianDate)}
    else { return("Parameter not indicated!")};
     
}


function radtheoric(jddate,elev,albedo,param)
{ 
  if( albedo === undefined ) { albedo = 0.3;};
  var radcalcteoric;
  var SC = 1.361; //  kW/m2   ET solar radition I0 kW/m2 Solar constant
  var I0 = SC*(1+0.034*Math.cos((jddate)*2*pi/365)); //  atmospheric effect
  var A = 1.160 + 0.075 * Math.sin((jddate-274)*2*pi/365);
  var opt_depth = 0.174 + 0.035 * Math.sin((jddate-100)*2*pi/365);
  var air_mass = 1/Math.sin(elev*2*pi/360); 
  var IB = I0*Math.exp(-opt_depth*air_mass); //  Direct Beam 
  var IDH = IB*(0.095 + 0.04*Math.sin((jddate-100)*2*pi/365)); // Diffuse radiation 
  var ID = IDH*(1+Math.cos(pi-elev*2*pi/360))/2; // Diffuse radiation
  var IBH = IB*Math.sin(elev*2*pi/360);
  var IR =  albedo*(IBH+IDH)*(1+Math.cos(pi-elev*2*pi/360))/2; // reflected
  var ITot = IB+ID+IR; //  total
  
  if ( ITot <0) {ITot=0;IB=0;IR=0;};
  
  if (param == "global") {return(ITot)}
  else if (param == "direct") {return(IB)}
  else if (param == "diffuse") {return(ID)}
  else if (param == "reflected") {return(IR)}
  else  {return(-9999)}    

}

function rad_direct_tilted  (jddate,az,elev,planezen,planeaz) 
{
                            planezen=planezen/rad;
                            planeaz=planeaz/rad;
                            elev=elev/rad;
                            az=az/rad;
                            var rad_dir=radtheoric(jddate,elev,"direct");
                            var radinc=rad_dir *(Math.cos(elev)*Math.sin(planezen)*Math.cos(planeaz-az)+Math.sin(elev)*Math.cos(planezen));
   return(rad_inc);
}


function proj(sunelev)
{
          if (sunelev < 0.0) {return 0.0};
          return 0.308 * Math.cos(rad * (sunelev* (0.998- (Math.pow(sunelev, 2.0) / 50000.0))));
}



/**
 * Given a temperature in Celsius, return Fahrenheit value.
 * @param {number} C
 * @return {number}
 * @customfunction
 */

function C2F(C) 
{
  if (typeof C !== 'number') {
                              throw TypeError('Celsius value must be a number');
                              }
  return (Math.round((C * 9) / 5 + 32,2));
}

/**
 * Given a temperature in Fahrenheit, return  Celsius value.
 * @param {number} F
 * @return {number}
 * @customfunction
 */

function F2C(F) 
{
  if (typeof F !== 'number') {
                             throw TypeError('Value must be a number');
                             }
 return(Math.round((5/9) * (F - 32),3));
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Wind functions




function compass_16(direction) 
 {
  var dir = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE",
             "SSE", "S", "SSW", "SW", "WSW", "W", "WNW",
            "NW", "NNW"];
  var dirint=(((direction+11.25)/22.5));							   
  return(dir[parseInt(dirint % 16)]);
}



function compass_8(direction) 
{ var dir = ["N",  "NE", "E",  "SE",
             "S",  "SW", "W", "NW"];
  var dirint=(((direction+22.5)/45));							   
  return(dir[parseInt(dirint % 8)]);
}
  

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Radiant temperature  functions.



/**
 * Given air temperature rh relative humidity, rshort direct beam short-wavelength radiation (W/mq), rdiffuse  isotropic short-wavelength radiation , the sun elevation,albedo gives and surface emissivity provides an assessment of Mean Radiant Temperature.
 *
 * @param {number} t,rh,wind,rshort,sunelev
 * @return {number}
 * @customfunction
 */

function mrt_solar_proj(t,rh,solar,sunelev,albedo,emis_sfc,fdir)
{
  if( albedo === undefined ) { albedo = 0.3;};
  if( emis_sfc === undefined ) { emis_sfc = 0.97;};
  if( fdir === undefined ) { fdir = 0.8;};
  if( sunelev === undefined ) { sunelev = 90;};
  
  var temprad;
  var emiair;
  var tsk;
  var rshort=solar*fdir;
  var rdiffuse=solar-rshort;

  var sig = 5.67e-8;
  emiair = emis_atm(t,rh);
  tsk = t + 273.12;
  var ratio=0.0429*Math.sin(sunelev*rad)+0.345*Math.cos(sunelev*rad);
  var proj=0.308 * Math.cos(rad * (sunelev* (0.998- (Math.pow(sunelev, 2.0) / 50000.0))));
  
  temprad= Math.pow((emiair * Math.pow(tsk, 4) + (1-albedo) * (rdiffuse) / (sig* emis_sfc)+(1-albedo) * proj * ratio* ((rshort-rdiffuse)/(sig*emis_sfc))),0.25)- 273.16;
  
  return temprad;
}

/**
 * Given mean radiant temperature t air temperature (Celsius), g Globe Temeperature, wind  wind speed in m/s and diameter.
 *
 * @param {number} t Air temperature ,tg Globe Temeperature, wind wind speed and diameter. 
 * @return {number}
 * @customfunction
 */


function mrt_thorsson(t,tg,wind,diam)
{        if ( diam === undefined) {diam=0.15;} ;
         var emis_globe = 0.97;
         var stefanb = 0.0000000567;
         return Math.pow(Math.pow(tg + 273.15, 4) + ((1.335 * Math.pow(10,8) * Math.pow(wind,0.71)) /(emis_globe*Math.pow(diam,0.4))) * (tg - t), 0.25) - 273.15;
}

/**
 * Given mean radiant temperature t air temperature (Celsius), tg Globe Temeperature, wind wind speed in m/s and diameter in millimeter .
 *
 * @param {number} Ta Air temperature ,Tg Globe Temeperature, ws wind speed in m/s . 
 * @return {number}
 * @customfunction
 */


function mrt_globe(t,tg,wind,diam)
{        if ( diam === undefined) {diam=0.05;} ;
         var emis_globe = 0.97;
         var stefanb = 0.0000000567;
         return Math.pow((Math.pow(tg + 273.15, 4) + ((1.1 * Math.pow(10,8) * Math.pow(wind,0.6)) /(emis_globe*Math.pow(diam,0.4))) * (tg - t)), 0.25)- 273.15;
}



//  Purpose: to calculate the convective heat tranfer coefficient for flow around a sphere.;
//  Reference : Bird, Stewart, && Lightfoot (BSL), page 409.;

                             
function h_sphere_in_air(t,pair,speed,speedmin,diam)
    {

                                    var Rair = 8314.34 / 28.97;
                                    var Pr = 1003.5 / (1003.5 + 1.25 * Rair);
                                    var thermal_con = (1003.5 + 1.25 * 8314.34 / 28.97) * viscosity(t);
                                    var density = (pair * 100) / (Rair * t)   // kg/m3;
                                    if(speed < speedmin ){speed = speedmin};
                                    var Re = (speed * density * diam)/ viscosity(t);
                                    var Nu = 2 + 0.6 * Math.pow(Re,0.5) * Math.pow(Pr, 0.3333);
                                    return (Nu * thermal_con) / diam; // W/(m2 K);
   }

//  Purpose: calculate the air emissivity in function to air temperature and relative humidity;
 

function emis_atm(ta,rh)
{
                  //  Reference; Oke (2nd edition), page 373.;
                  var e = (rh*0.01) * esat(ta+273.15);
                  return 0.575 * Math.pow(e,0.143);
}

function Tglob_sphere(t,rh,speed,solar,pair,diam,alb_sfc,fdir,zenith)
                        {
                        if( solar < 5 ) { return(t)};   
                        if(fdir === undefined ) { fdir = 0.8;}; 
                        if(zenith === undefined ) {zenith = 0;};
                        var converge,cza,dT,Tref,h,Tglobe;
                        var emis_air=emis_atm(t,rh);
                        var speedMin = 0.1;  
                        var alb_globe = 0.05;
                        var emis_globe = 0.95;
                        var emis_sfc = 0.999;
                        var stefanb = 0.0000000567;
                        var Tair = t + 273.15;
                        var Tsfc = t + 273.15;
                        var Tglobe_prev = t + 273.15;
                        zenith=zenith/(180/Math.PI);
                        converge = 0.05;
                          
                        if(zenith <= 0 ){ zenith = 0.0000000001;};
                        if(zenith > 1.57 ){ zenith = 1.57;};
                          
                        cza = Math.cos(zenith);

                        var fixfactor=solar/(2 * emis_globe * stefanb) *(1-alb_globe) *(fdir * (1 / (2 * cza) - 1) + 1 + alb_sfc);
                        var iter=1;
                          
                        do {
                           Tref = 0.5 * (Tglobe_prev + Tair);
                           h = h_sphere_in_air(Tref, pair, speed, speedMin, diam);
                           Tglobe = Math.pow(0.5*(emis_air*Math.pow(Tair,4)+emis_sfc*Math.pow(Tsfc,4))-h/(emis_globe*stefanb)*(Tglobe_prev - Tair) + fixfactor,0.25);
                           dT = Tglobe - Tglobe_prev;
                           if(Math.abs(dT) < converge) { Tglobe = Tglobe - 273.15;break;} else {Tglobe_prev = 0.9 * Tglobe_prev + 0.1 * Tglobe;}
                            iter=iter+1;
                           } while ( iter < 1000);
                          
                          if ( iter===1000) {Tglobe=9999}
                          
                          return Tglobe;
                         }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Psycrometrics related functions.

/**
 * Given air temperature (Celsius) calculates Saturated Vapor Pressure (Torr) at Temperature T  (C) .
 *
 * @param {number} T
 * @return {number}
 * @customfunction
 */
	
  
function vpaTorr(t) {
    
                     return Math.exp(18.6686 - 4030.183 / (t + 235.0));
}


/**
 * Given air temperature (Celsius), air pressure (p)  gives a empirical assessement of wet bulb temperature.
 *
 * @param {number} t,p 
 * @return {number}
 * @customfunction
 */

function twetbulb_j(t,p)
{
     var  tw = (t*(0.45+(0.006*t*Math.sqrt(p/1060.0))));  
     return TwoDec(tw);
}



/*
 * Saturation Vapor Pressure formula for range -100..0 Deg. C.
 * Hardy B, 1998,"ITS-90 Formulations for Vapor Pressure, Frostpoint Temperature,Dewpoint Temperature, and Enhancement Factors in the Range 100 to +100 C".
 * Proceedings of the Third International Symposium on Humidity & Moisture",Teddington, London, England, April 1998
*/

function pvsIce(T) 
{
			       var k0 = -5.8666426e3;
			       var k1 = 2.232870244e1;
			       var k2 = 1.39387003e-2;
			       var k3 = -3.4262402e-5;
			       var k4 = 2.7040955e-8;
			       var k5 = 6.7063522e-1;
                   var lnP = k0/T + k1 + (k2 + (k3 + (k4*T))*T)*T + k5*Math.log(T);
                   return Math.exp(lnP);
}


/**
 * Given air temperature T (Celsius)  function gives Saturation Vapor Pressure. Dimension of outcomes in Pascal (kPa)
 * Saturation Vapor Pressure formula for range 273..678 Deg. K. 
 * Equation (30) in Section 8.1 "The Saturation-Pressure Equation (Basic Equation),Erlangen, Germany, September 1997.
 * @param {number} T
 * @return {number}
 * @customfunction
 */

function pvsWater(T) 
{
  
                   var n1 = 0.11670521452767e4;
                   var n6 = 0.14915108613530e2;
                   var n2 = -0.72421316703206e6;
                   var n7 = -0.48232657361591e4;
                   var n3 = -0.17073846940092e2;
                   var n8 = 0.40511340542057e6;
                   var n4 = 0.12020824702470e5;
                   var n9 = -0.23855557567849;
                   var n5 = -0.32325550322333e7;
                   var n10 = 0.65017534844798e3;

                   var th = T+n9/(T-n10);
                   var A = (th+n1)*th+n2;
                   var B = (n3*th+n4)*th+n5;
                   var C = (n6*th+n7)*th+n8;

                   var p = 2*C/(-B+Math.sqrt(B*B-4*A*C));
                   p *= p;
                   p *= p;
                   return p*1e6;
}

/**
 * Given air temperature T (Celsius)  function gives Saturation Vapor Pressure. Dimension of outcomes in Pascal (hPa)
 *
 * @param {number} T
 * @return {number}
 * @customfunction
 */

function PVS(t)
{
  t=t+273.16;
  var minT = 173; // -100 Deg. C.
  var maxT = 678;
  var noresp = -9999;
  var pvsresp;
  
  if (t < minT || t> maxT) 
     {return noresp;}
  
  else if (t<273.15)
       {pvsresp=pvsIce(t)/100;}
  else
       {pvsresp=pvsWater(t)/100;}
  
  return(TwoDec(pvsresp));
}



/**
 * Given air temperature (Celsius), relative humidity (%) and pressure ( pa) give deficit of saturation in delta hPA
 *
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */

function deficitsat(t,rh) 
{
  var pws = PVS(t);
  var pae=rh/100*pws;
  return (pws-pae);
}

function es(t)
{
  var es_air, tk,i;
  g = new Array(8);
  g[0] =-2.8365744E3;
  g[1] =-6.028076559E3;
  g[2] =1.954263612E1;
  g[3] =-2.737830188E-2;
  g[4] =1.6261698E-5;
  g[5] =7.0229056E-10;
  g[6] =-1.8680009E-13;
  g[7] =2.7150305;
  

  tk = t+273.15; 
  
  es_air = g[7]*Math.log(tk);
  
  for ( var i = 0; i < 7; i ++ )
         {es_air = es_air+g[i]*Math.pow(tk,i-2)};
  
  var es = Math.exp(es_air)*0.01;
  
  return es;
}

function wetbulb(t,rh,pa)
			{  
              if (pa == undefined) {pa = 1013};
              var Ewguess,Eguess,wetbulb,cursign;
              var Twguess = 0;
			  var incr = 10;
			  var previoussign = 1;
			  var Edifference = 1;
		      var E2 = pvap(t,rh);

			  outerloop:
               
				while (Math.abs(Edifference) > 0.005) 
				{
					Ewguess = 6.112 * Math.exp((17.67 * Twguess) / (Twguess + 243.5));
					Eguess = Ewguess - (pa) * (t - Twguess) * 0.00066 * (1 + (0.00115 * Twguess));
					Edifference = E2 - Eguess;
					
					if (Edifference == 0)
					{
						break outerloop;Code.gs

					} else {
						if (Edifference < 0)
						{
							cursign = -1;
							if (cursign != previoussign)
							{
								previoussign = cursign;
								incr = incr/10;
							} else {
								incr = incr;
							}
						} else {
							cursign = 1;
							if (cursign != previoussign)
							{
								previoussign = cursign;
								incr = incr/10;
							} else {
								incr = incr;
							}
						}
					}
					
					Twguess = Twguess + incr * previoussign;
					
				}
				wetbulb = Twguess;
				return wetbulb;
			}	


function pvap(t,rh)
			{
				var E;
				E = es(t) * (rh/100);
				return E;
			}


//  Purpose: calculate the saturation vapor pressure (mb) over liquid water given the temperature (K).;
//  Reference Buck's (1981) approximation (eqn 3) of Wexler's (1976) formulae.;
//  over liquid water;
            
function esat (tk) 
{
                  var esat= 6.1121 * Math.exp(17.502 * (tk - 273.15) / (tk - 32.18));
                  return 1.004 * esat;  
}


//  Purpose: Compute the viscosity of air, kg/(m s) given temperature, K;
//  Reference; BSL, page 23.;
              
function viscosity(t)
{

                       var omega = (t / 97 - 2.9) / 0.4 * (-0.034) + 1.048;
                       return 0.0000026693 * Math.pow((28.97 * t),0.5) / (Math.pow(3.617,2) * omega);
}



/**
 * Given a air temperature t (Celsius) and air pressure hpa (hPa)  give Dew Point in Celsius degrees.
 *
 * @param {number} t,hpa
 * @return {number}
 * @customfunction
 */

function press_dewpoint(t,hpa) 
{
  var p, dpt;
  p= Math.log(100.0*hpa);
  if (t >= 0.0)
      {dpt=(-60.45)+7.0322*p+.37*p*p;}
  else
      {dpt=(-35.957)-1.8726*p+1.1689*p*p;}
  return (dpt);
}

/**
 * Given a air temperature t (Celsius) and air relative humidity  (RH)  and formula give the Dew point in Celsius degrees.
 *
 * @param {number} t,RH
 * @return {number}
 * @customfunction
 */

function dewpoint(t,rh,formula) {
  if (formula == undefined) {formula == "NOAA"}
         var RHD = rh / 100;
         if (formula == "Paroscientific") 
             {return 237.3 * (Math.log(RHD) / 17.27 + t / (237.3 + t)) / (1 - Math.log(RHD) / 17.27 - t / (237.3 + t));}
         else if  (formula == "Sonntag") 
             {return 243.12 * (Math.log(RHD) / 17.62 + t / (243.12 + t)) / (1 - Math.log(RHD) / 17.62 - t / (243.12 + t));}
         else if  (formula == "NOAA") 
             {return 243.5 * (Math.log(RHD) / 17.67 + t / (243.5 + t)) / (1 - Math.log(RHD) / 17.67 - t / (243.5 + t));}
   

}

/**
 * Calculates the humidity ratio of air/water vapor mixture.          
 * Based on formula in the ASHRAE Handbook of Fundamentals.           
 * Inputs is water vapor pressure [hPa]. Assume aipr=1013.25 [hPa]      
 * output : function = humidity ratio                                  
 * @param {number} p
 * @param {number} pa
 * @return {number} 
 * @customfunction
 */


function humrat(p,pa) 
{
	var y;
        pa=pa/10; // convert in hPa 
        p=p/10; // convert in hPa 
	y=0.62198*p/(pa-p);
	return (y);
}

/**
 * Calculates the enthalpy of air/water vapor mixture [kJ/kg]  
 * Inputs are dry-bulb temperature [C] and humidity ratio (unitless).                                     
 * @param {number} ta
 * @param {number} hum_ratio
 * @return {number} 
 * @customfunction
 */

function enthalpy(t, hum_ratio) 
{
	var y;
	y=1.006*t+hum_ratio*(2501.0+1.805*t);
	return (y);
}

/**
 * Gets the specific volume of air/water vapor mixture [m^3/kg] 
 * input: ta dry_bulb temperature [C], hum_ratio humidity ratio [unitless],pa air pressure  [hPa].                                   
 * @param {number} ta
 * @param {number} hum_ratio
 * @param {number} pa
 * @return {number} 
 * @customfunction
 */

function spvol(ta,hum_ratio,pa) 
{
	var t, y;
	t=ta+273.16;
	y=(287.055*t*(1+1.6078*hum_ratio))/(pa*100.0);
	return (y);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Metabolic section

/**
 * Given a temperature t (Celsius) and return the metabolism useful for pmv_hoppe_iso function.
 * @param {number} t
 * @return {number} 
 * @customfunction
 */

function metabolism(t)
{
  return (-3.0909 * t + 203.64); 
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Thermal Confort index section



/**
 * Given PMV value and Metabolic energy production M (58 to 400 W/m2) return the PPD Index ISO 7730. 
 * @param {number} PMW
 * @return {number}
 * @customfunction
 */

function PPD(PMV) 
            {
                   var PPD=100-95*Math.exp(-0.03353*Math.pow(PMV,4)-0.2179*Math.pow(PMV,2))
                   return(Math.round((PPD)*10)/10);
            }
  


/**
 * Given PMV and metabolic rate the heat body balance is done following ISO 7730 PMV's scheme.
 *
 * @param {number} pmv,m
 * @return {number}
 * @customfunction
 */

  
function balancePMV7730(pmv,M) 
                       {
                       var balance = pmv / (0.303 * Math.exp(-0.036 * M) + 0.028);
                       return(balance);
                       } 
  
// Person global metabolic request for a day Harris Benedict Equation (cal/day) -> kJ and divided for daily seconds Watt but already normalized for Adu.
  
function bmr_met(mbody,age,ht,gender) 
         { 
          var bmr; 
          var adu = 0.203 * Math.pow(mbody, 0.425) * Math.pow(ht, 0.725);
   
          if ( gender == 'female') {
 		          // Female
	              bmr = 655.0955+(9.5634*(mbody))+(1.8496*(ht*100))-(4.6756*(age));
 	              } 
              else {
 		         // Male
	              bmr = 66.4730+(13.7516*(mbody))+(5.0033*(ht*100))-(6.7550*(age));
 	               }
           var metb =((bmr* 4.1868 * 1000)/(24*60*60)); // in Watt
           return metb/adu;
         }





/**
 * Given a temperature t (Celsius), relative humidity rh (%), wind ( m/sec), mean radiant temperature mtrad ( Celsius) and clothing insulation (clo) 
 * gives PMV following Hoppe scheme for a customized person.
 * @param {number} ta
 * @return {number} 
 * @customfunction
 */


function PMV_custom(t,rh,wind,mtrad,iclo,age,mbody,ht,gender)
{
  var eta = 0.01; // Mechanical efficiency
  var tcl = 30.005;
  var MAX_LOOP = 200;
  var MAX_LOOP_HALF = MAX_LOOP / 2;
  var tcl_eps = 0.05;
  var eps = 0.97;
  var sigm = 5.67e-8;
  var vpa, fcl, metm, metf, metb, h, aef, p1, tcl1, tcl2;
  var hc, diff, abhc, abtcl, difhc, tsk, esw, rsum, csum;
  var erel, eres, ed, load, ts,bmr,icl;

  var adu = 0.203 * Math.pow(mbody, 0.425) * Math.pow(ht, 0.725);
  
  if ( gender == 'female') {
 		// Female
	   bmr = 655.0955+(9.5634*(mbody))+(1.8496*(ht*100))-(4.6756*(age));
 	} else {
 		// Male
	   bmr = 66.4730+(13.7516*(mbody))+(5.0033*(ht*100))-(6.7550*(age));
 	}
 
  var metb =((bmr* 4.1868 * 1000)/(24*60*60)); // Person global metabolic request for a day Harris Benedict Equation (cal/day) -> kJ and divided for daily seconds Watt but already normalized for Adu.
  
  vpa = (rh / 100) * 6.105 * Math.pow(2.718281828, ( 17.27*t / ( 237.7 + t ) ));
  
  icl = iclo * 0.155;
  
  if (icl <= 0.078) 
     {fcl = 1 + (1.29 * icl)}
  else {fcl = 1.05 + (0.645 * icl)};
  
  h = metb*adu ;
 
  aef = 0.71 * fcl * adu;

  var tcl_guess = 35.7 - 0.032 * (metb /adu); // Initial clothing temperature

  tcl1 = tcl;
  for (var i = 0; i < MAX_LOOP; i ++)
  {
    if (i < MAX_LOOP_HALF)
    {
      hc = 12.06 * Math.sqrt(wind);
      abhc = 0.0;
    }
    else
    {
      hc = 2.38 * Math.pow(Math.abs(tcl1 - t), 4.0);
      abhc = 0.6 * Math.abs(Math.pow((tcl1 - t), -0.75));
    }
    tcl2 = tcl_guess - 0.155 * iclo * (3.94 * 0.00000001* fcl *(Math.pow((tcl1 + 273.2),4.0)- Math.pow((mtrad + 273.2), 4.0))+fcl * hc* (tcl1 - t));
    diff = Math.abs(tcl1 - tcl2);
    if (diff < tcl_eps)
      break;
    abtcl = -0.155 * iclo * (4.0 * 3.94* 0.00000001* fcl *Math.pow((tcl1+ 273.2),3.0) + fcl * hc- fcl *(tcl1 - t)* abhc)- 1.0;
    tcl1 = tcl1 - (tcl2 - tcl1) / abtcl;
    difhc = (12.06 * Math.sqrt(wind)) - (2.38 * (Math.pow(Math.abs(t - tcl1), 0.25)));
    if (difhc > 0.0 && i == MAX_LOOP_HALF)
      break;
  }
  tsk = 35.7 - (0.028 * h/adu); // Initial tskin temperature
  esw = 0.42 * adu * (h / adu - 58.08);
  esw = esw < 0.0 ? 0.0 : esw;
  rsum = aef * eps * sigm * (Math.pow((tcl1 + 273.2), 4.0) - Math.pow((mtrad + 273.2),4.0));
  csum = adu * fcl * hc * (tcl1 - t);
  erel = 0.0023 * metb * (44.0 - 0.75 * vpa);
  eres = 0.0014 * metb * (34.0 - t);
  ed = 0.406 * adu * (1.92 * tsk - 25.3- 0.75 * vpa);
  load = (h - ed - erel - eres - esw - rsum - csum) / adu;
  ts = (0.303 * Math.exp(-0.036 * (h / adu)) + 0.028);
  var pmv=ts * load;
  return TwoDec(pmv);
  
  
}


function perceived_temperature(ta,rh,vel,tr,M,W,clo) 
{
  var age = 35.0; // Age
  var mbody = 75.0; // Weigth in kg
  var ht = 1.75; // Heigth in m
  var tcl = 30.005;
  var MAX_LOOP = 200;
  var MAX_LOOP_HALF = MAX_LOOP / 2;
  var tcl_eps = 0.05;
  var eps = 0.97;
  var sigm = 5.67e-8;
  var vpa, fcl, metm, metf, metb, h, aef, p1, tcl1, tcl2;
  var hc, diff, abhc, abtcl, difhc, tsk, esw, rsum, csum;
  var erel, eres, ed, load, ts,icl;

  var adu = 0.203 * Math.pow(mbody, 0.425) * Math.pow(ht, 0.725);
  vpa = (rh / 100) * 6.105 * Math.pow(2.718281828, ( 17.27*t / ( 237.7 + t ) ));
  icl = iclo * 0.155;
  if (icl <= 0.078) 
     {fcl = 1 + (1.29 * icl)}
  else {fcl = 1.05 + (0.645 * icl)};
  
   h = M*adu;
 
  aef = 0.71 * fcl * adu;

 var tcl_guess = 35.7 - 0.032 * (M); // Initial clothing temperature

  tcl1 = tcl;
   for (var i = 0; i < MAX_LOOP; i ++)
  {
    if (i < MAX_LOOP_HALF)
    {
      hc = 12.06 * Math.sqrt(wind);
      abhc = 0.0;
    }
    else
    {
      hc = 2.38 * Math.pow(Math.abs(tcl1 - t), 4.0);
      abhc = 0.6 * Math.abs(Math.pow((tcl1 - t), -0.75));
    }
    tcl2 = tcl_guess - 0.155 * iclo * (3.94 * 0.00000001* fcl *(Math.pow((tcl1 + 273.2),4.0)- Math.pow((mtrad + 273.2), 4.0))+fcl * hc* (tcl1 - t));
    diff = Math.abs(tcl1 - tcl2);
    if (diff < tcl_eps)
      break;
    abtcl = -0.155 * iclo * (4.0 * 3.94* 0.00000001* fcl *Math.pow((tcl1+ 273.2),3.0) + fcl * hc- fcl *(tcl1 - t)* abhc)- 1.0;
    tcl1 = tcl1 - (tcl2 - tcl1) / abtcl;
    difhc = (12.06 * Math.sqrt(wind)) - (2.38 * (Math.pow(Math.abs(t - tcl1), 0.25)));
    if (difhc > 0.0 && i == MAX_LOOP_HALF)
      break;
  }
  return TwoDec(tcl1);
  
  
}

    
  
function PMV_ISO7730(ta,rh,wind,trad,M,W,clo) 
    {
     // t, air temperature (Â°C)
    // rh, relative humidity (%) Used only this way to input humidity level
    // wind, relative air velocity (m/s)
    // trad, mean radiant temperature ( °C)
    // M, metabolic rate (met)
    // W, external work, normally around 0 (met)
    // clo, clothing (clo)

    var pa, icl, mw, fcl, hcf, taa, tra, tcla, p1, p2, p3, p4,
    p5, xn, xf, eps, hcn, hc, tcl, hl1, hl2, hl3, hl4, hl5, hl6,
    ts, pmv, ppd, n;

    pa = rh * 10 * Math.exp(16.6536 - 4030.183 / (ta + 235));

    icl = 0.155 * clo; //thermal insulation of the clothing in M2K/W
    mw = M - W; //internal heat production in the human body
    
    if (icl <= 0.078) {fcl = 1 + (1.29 * icl)}
    
    else {fcl = 1.05 + (0.645 * icl)};

    //heat transf. coeff. by forced convection
  
    hcf = 12.1 * Math.sqrt(wind);
    taa = ta + 273;
    tra = trad + 273;
    tcla = taa + (35.5 - ta) / (3.5 * icl + 0.1);

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
              return('Max iterations exceeded');
        }
    }

    tcl = 100 * xn - 273;

    // heat loss diff. through skin 
    hl1 = 3.05 * 0.001 * (5733 - (6.99 * mw) - pa);
    // heat loss by sweating
    
    if (mw > 58.15) {hl2 = 0.42 * (mw - 58.15)}
    
    else 
    {hl2 = 0};
    
    // latent respiration heat loss 
    hl3 = 1.7 * 0.00001 * M * (5867 - pa);
    // dry respiration heat loss
    hl4 = 0.0014 * M * (34 - ta);
    // heat loss by radiation  R
    hl5 = 3.96 * fcl * (Math.pow(xn, 4) - Math.pow(tra / 100, 4));
    // heat loss by convection C
    hl6 = fcl * hc * (tcl - ta);

    ts = 0.303 * Math.exp(-0.036 * M) + 0.028;
  
    pmv = ts * (mw - hl1 - hl2 - hl3 - hl4 - hl5 - hl6);
  
   
    return(TwoDec(pmv));
}


// Introduction to Human Factors and Ergonomics for EngineersDi Mark R. Lehto,Steven J. Landry,Jim Buck
   

function HSI_index(t,rh,wind,trad,M,W,clo,param) 
    {
    
    if( param === undefined ) { param = "HSI";};
 
    // t, air temperature ( °C)
    // trad, mean radiant temperature ( °C)
    // wind, relative air velocity (m/s)
    // rh, relative humidity (%) Used only this way to input humidity level
    // met, metabolic rate (met)
    // W, external work, normally around 0 (met)  
    // clo, clothing (clo)
    
    var pa, icl, mw, fcl, hcf, taa, tra, tcla, p1, p2, p3, p4,
    p5, xn, xf, eps, hcn, hc, tcl, hl1, hl2, hl3, hl4, hl5, hl6,
    ts, pmv, ppd, n;

    pa = rh * 10 * Math.exp(16.6536 - 4030.183 / (t + 235));

    icl = 0.155 * clo; //thermal insulation of the clothing in M2K/W
    mw = M - W; //internal heat production in the human body
    
    if (icl <= 0.078) {fcl = 1 + (1.29 * icl)}
    
    else {fcl = 1.05 + (0.645 * icl)};

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
              return(-9999);
        }
    }

    tcl = 100 * xn - 273.15;
    // heat loss diff. through skin 
    hl1 = 3.05 * 0.001 * (5733 - (6.99 * mw) - pa);
    // heat loss by sweating
    if (mw > 58.15) {hl2 = 0.42 * (mw - 58.15)}
     else 
    {hl2 = 0};
    
    // latent respiration heat loss 
    hl3 = 1.7 * 0.00001 * M * (5867 - pa);
    // dry respiration heat loss
    hl4 = 0.0014 * M * (34 - t);
    // heat loss by radiation  R
    hl5 = 3.96 * fcl * (Math.pow(xn, 4) - Math.pow(tra / 100, 4));
    // heat loss by convection C
    hl6 = fcl * hc * (tcl - t);

  
    var eres = mw  - hl3 - hl4 - hl5 - hl6;
    var sweat=1
    if (eres<0) { sweat=0}
  
    var emax = 2.0 * Math.pow(wind,0.6) *(42 -(rh/100)*mbtommHG(es(t)));; 
         
    if ( param  == "HSI") {return(TwoDec((eres/emax)*100))}
    else if ( param  == "AET") {return(Math.abs(2440*(eres-emax)))}
    else if ( param  == "Sweat") {return(sweat)}
    else { return(-9999)};
}

        



        
function clomax_7730(t,rh,wind,trad,M,W) 
{
 if( typeof M === undefined ) { M = 58.15;};
 if( typeof W === undefined ) { W = 0;};
 var PMV_GOOD_sup = 0.5;
 var pmv; 
 var clo=5;
    
    do {
      pmv = PMV_ISO7730(t,rh,wind,trad, M,W,clo);
      clo= clo-0.1;
    } while (pmv > PMV_GOOD_sup);

 return(OneDec(clo));
}

/**
 * Minimal clothing level for   air temperature t (Celsius), rh,rh,wind, tr,  M, W, clo, patm
 *
 * @param {number} t,td
 * @return {number}
 * @customfunction
 */

function clomin_7730(t,rh,wind,trad,M,W) 
{
 if( typeof M === undefined ) { M = 58.15;};
 if( typeof W === undefined ) { W = 0;};
  
 var PMV_GOOD_inf = -0.5;
 var pmv,clomin; 
 var clo=0.1;
  
   do {
      pmv=PMV_ISO7730(t,rh,wind,trad, M,W,clo);
      clo= clo+0.1;
    } while (pmv < PMV_GOOD_inf);

 return(OneDec(clo));
}

function clomax_custom(t,rh,wind,mtrad,age,mbody,ht,gender) 
{
 if( typeof M === undefined ) { M = 58.15;};
 if( typeof W === undefined ) { W = 0;};
 var PMV_GOOD_sup = 0.5;
 var pmv; 
 var clo=5;
    
    do {
      pmv = PMV_custom(t,rh,wind,mtrad,clo,age,mbody,ht,gender);
      clo= clo-0.1;
    } while (pmv > PMV_GOOD_sup);

 return(OneDec(clo));
}

/**
 * Minimal clothing level for   air temperature t (Celsius), rh,rh,wind, tr,  M, W, clo, patm
 *
 * @param {number} t,td
 * @return {number}
 * @customfunction
 */

function clomin_custom(t,rh,wind,mtrad,age,mbody,ht,gender) 
{
 if( typeof M === undefined ) { M = 58.15;};
 if( typeof W === undefined ) { W = 0;};
  
 var PMV_GOOD_inf = -0.5;
 var pmv,clomin; 
 var clo=0.1;
  
   do {
      pmv=PMV_custom(t,rh,wind,mtrad,clo,age,mbody,ht,gender) ;
      clo= clo+0.1;
    } while (pmv < PMV_GOOD_inf);

 return(OneDec(clo));
}


/**
 * Given Standard Effective Index  air temperature ta (Celsius) rh,rh,vel, tr,  M, W, clo, patm
 *
 * @param {number} t,td
 * @return {number}
 * @customfunction
 */


function pierceSET (t,rh,wind,trad,M,W,clo,patm) 
    {
  
     if( patm === undefined ) { patm = 1013.25;};
  
    var TempSkinNeutral, TempBodyNeutral, SkinBloodFlowNeutral, TempSkin, TempCore,TempCoreNeutral,
    SkinBloodFlow, MSHIV, ALFA, ESK, PressureInAtmospheres, TIMEH, LTIME, DELTA, RCL,
    FACL, LR, RM, M, WCRIT, ICL, CHC, CHCA, CHCV, CHR, CTC, TOP, TCL, DRY, HFCS, ERES,
    CRES, SCR, SSK, TCSK, TB, SKSIG, WARMS, COLDS, WARMC, COLDC, CRSIG, WARMB, COLDB,
    REGSW, BDSIG, REA, RECL, EMAX, PRSW, PWET, EDIF, RA, TCL_OLD, TCCR, DTSK, DTCR, ERSW,
    X, X_OLD, CHCS, TIM, STORE, HSK, RN, ECOMF, EREQ, HD, HE, W, PSSK, CHRS, CTCS,
    RCLOS, RCLS, FACLS, FCLS, IMS, ICLS, RAS, REAS, RECLS, HD_S, HE_S;

    var VaporPressure = rh * vpaTorr(t) / 100;
    var AirVelocity = Math.max(wind, 0.1);
    var KCLO = 0.25;
    var BODYWEIGHT = 75;
    var BODYSURFACEAREA = 1.8258;
    var METFACTOR = 58.2;
    var SBC = 0.000000056697; // Stefan-Boltzmann constant (W/m2K4)
    var CSW = 170;
    var CDIL = 120;
    var CSTR = 0.5;

    TempSkinNeutral = 33.7; //setpoint (neutral) value for Tsk
    TempCoreNeutral = 36.49; //setpoint value for Tcr
    TempBodyNeutral = 36.49; //setpoint for Tb (.1*TempSkinNeutral + .9*TempCoreNeutral)
    SkinBloodFlowNeutral = 6.3; //neutral value for SkinBloodFlow

    //INITIAL VALUES - start of 1st experiment
  
    TempSkin = TempSkinNeutral;
    TempCore = TempCoreNeutral;
    SkinBloodFlow = SkinBloodFlowNeutral;
    MSHIV = 0.0;
    ALFA = 0.1;
    ESK = 0.1 * M;

    //Start new experiment here (for graded experiments)
    //UNIT CONVERSIONS (from input variables)

    var p = patm / 10; // in hPa .. 1 atm = Pa= 1013 millibar 

    PressureInAtmospheres = p * 0.009869;
    LTIME = 60.0;
    TIMEH = LTIME / 60.0;
    RCL = 0.155 * clo;
    
  // AdjustICL(RCL, Conditions);  TH: I don't think this is used in the software

    FACL = 1.0 + 0.15 * clo; //% INCREASE IN BODY SURFACE AREA DUE TO CLOTHING
    LR = 2.2 / PressureInAtmospheres; //Lewis Relation is 2.2 at sea level
    RM = M;
   
    if (clo <= 0) {
        WCRIT = 0.38 * Math.pow(AirVelocity, -0.29);
        ICL = 1.0;
    } else {
        WCRIT = 0.59 * Math.pow(AirVelocity, -0.08);
        ICL = 0.45;
    }

    CHC = 3.0 * Math.pow(PressureInAtmospheres, 0.53);
    CHCV = 8.600001 * Math.pow((AirVelocity * PressureInAtmospheres), 0.53);
    CHC = Math.max(CHC, CHCV);

    //initial estimate of Tcl
  
    CHR = 4.7;
    CTC = CHR + CHC;
    RA = 1.0 / (FACL * CTC); //resistance of air layer to dry heat transfer
    TOP = (CHR * trad + CHC * t) / CTC;
    TCL = TOP + (TempSkin - TOP) / (CTC * (RA + RCL));

    // ========================  BEGIN ITERATION
    //
    // Tcl and CHR are solved iteratively using: H(Tsk - To) = CTC(Tcl - To),
    //  where H = 1/(Ra + Rcl) and Ra = 1/Facl*CTC
    //

    TCL_OLD = TCL;
    var flag = true;
    for (TIM = 1; TIM <= LTIME; TIM++) {
        do {
            if (flag) {
                TCL_OLD = TCL;
                CHR = 4.0 * SBC * Math.pow(((TCL + trad) / 2.0 + 273.15), 3.0) * 0.72;
                CTC = CHR + CHC;
                RA = 1.0 / (FACL * CTC); //resistance of air layer to dry heat transfer
                TOP = (CHR * trad + CHC * t) / CTC;
            }
            TCL = (RA * TempSkin + RCL * TOP) / (RA + RCL);
            flag = true;
        } while (Math.abs(TCL - TCL_OLD) > 0.01);
        flag = false;
        DRY = (TempSkin - TOP) / (RA + RCL);
        HFCS = (TempCore - TempSkin) * (5.28 + 1.163 * SkinBloodFlow);
        ERES = 0.0023 * M * (44.0 - VaporPressure);
        CRES = 0.0014 * M * (34.0 - t);
        SCR = M - HFCS - ERES - CRES - W;
        SSK = HFCS - DRY - ESK;
        TCSK = 0.97 * ALFA * BODYWEIGHT;
        TCCR = 0.97 * (1 - ALFA) * BODYWEIGHT;
        DTSK = (SSK * BODYSURFACEAREA) / (TCSK * 60.0); //deg C per minute
        DTCR = SCR * BODYSURFACEAREA / (TCCR * 60.0); //deg C per minute
        TempSkin = TempSkin + DTSK;
        TempCore = TempCore + DTCR;
        TB = ALFA * TempSkin + (1 - ALFA) * TempCore;
        SKSIG = TempSkin - TempSkinNeutral;
        WARMS = (SKSIG > 0) * SKSIG;
        COLDS = ((-1.0 * SKSIG) > 0) * (-1.0 * SKSIG);
        CRSIG = (TempCore - TempCoreNeutral);
        WARMC = (CRSIG > 0) * CRSIG;
        COLDC = ((-1.0 * CRSIG) > 0) * (-1.0 * CRSIG);
        BDSIG = TB - TempBodyNeutral;
        WARMB = (BDSIG > 0) * BDSIG;
        COLDB = ((-1.0 * BDSIG) > 0) * (-1.0 * BDSIG);
        SkinBloodFlow = (SkinBloodFlowNeutral + CDIL * WARMC) / (1 + CSTR * COLDS);
        
        if (SkinBloodFlow > 90.0) SkinBloodFlow = 90.0;
        if (SkinBloodFlow < 0.5) SkinBloodFlow = 0.5;
        
        REGSW = CSW * WARMB * Math.exp(WARMS / 10.7);
        
        if (REGSW > 500.0) {REGSW = 500.0};
        ERSW = 0.68 * REGSW;
        REA = 1.0 / (LR * FACL * CHC); // evaporative resistance of air layer
        RECL = RCL / (LR * ICL); // evaporative resistance of clothing (icl=.45)
        EMAX = (vpaTorr(TempSkin) - VaporPressure) / (REA + RECL);
        PRSW = ERSW / EMAX;
        PWET = 0.06 + 0.94 * PRSW;
        EDIF = PWET * EMAX - ERSW;
        ESK = ERSW + EDIF;
        if (PWET > WCRIT) {
            PWET = WCRIT;
            PRSW = WCRIT / 0.94;
            ERSW = PRSW * EMAX;
            EDIF = 0.06 * (1.0 - PRSW) * EMAX;
            ESK = ERSW + EDIF;
        } 
        if (EMAX < 0) {
            EDIF = 0;
            ERSW = 0;
            PWET = WCRIT;
            PRSW = WCRIT;
            ESK = EMAX;
        }
        ESK = ERSW + EDIF;
        MSHIV = 19.4 * COLDS * COLDC;
        M = RM + MSHIV;
        ALFA = 0.0417737 + 0.7451833 / (SkinBloodFlow + .585417);
    }

    //Define new heat flow terms, coeffs, and abbreviations
    
    STORE = M -W - CRES - ERES - DRY - ESK; //rate of body heat storage

    HSK = DRY + ESK; //total heat loss from skin
    RN = M -W; //net metabolic heat production
  
    ECOMF = 0.42 * (RN - METFACTOR);
  
    if (ECOMF < 0.0) ECOMF = 0.0; //from Fanger
   
    EREQ = RN - ERES - CRES - DRY;
    EMAX = EMAX * WCRIT;
    HD = 1.0 / (RA + RCL);
    HE = 1.0 / (REA + RECL);
    W = PWET;
    
    PSSK = vpaTorr(TempSkin);
    
    // Definition of ASHRAE standard environment... denoted "S"
    
    CHRS = CHR;
  
    if (M/METFACTOR < 0.85) {
        CHCS = 3.0;
    } else {
        CHCS = 5.66 * Math.pow(((M/METFACTOR - 0.85)), 0.39);
        if (CHCS < 3.0) CHCS = 3.0;
    }
    CTCS = CHCS + CHRS;
    RCLOS = 1.52 / ((M/METFACTOR - W/METFACTOR) + 0.6944) - 0.1835;
    RCLS = 0.155 * RCLOS;
    FACLS = 1.0 + KCLO * RCLOS;
    FCLS = 1.0 / (1.0 + 0.155 * FACLS * CTCS * RCLOS);
    IMS = 0.45;
    ICLS = IMS * CHCS / CTCS * (1 - FCLS) / (CHCS / CTCS - FCLS * IMS);
    RAS = 1.0 / (FACLS * CTCS);
    REAS = 1.0 / (LR * FACLS * CHCS);
    RECLS = RCLS / (LR * ICLS);
    HD_S = 1.0 / (RAS + RCLS);
    HE_S = 1.0 / (REAS + RECLS);

    // SET* (standardized humidity, clo, Pb, and CHC)
    // determined using Newton//s iterative solution
    // FNERRS is defined in the GENERAL SETUP section above

    DELTA = .0001;
    var ERR1, ERR2;
    var dx = 100.0;
    X_OLD = TempSkin - HSK / HD_S; //lower bound for SET
    
    while (Math.abs(dx) > .01) {
        ERR1 = (HSK - HD_S * (TempSkin - X_OLD) - W * HE_S * (PSSK - 0.5 * vpaTorr(X_OLD)));
        ERR2 = (HSK - HD_S * (TempSkin - (X_OLD + DELTA)) - W * HE_S * (PSSK - 0.5 * vpaTorr((X_OLD + DELTA))));
        X = X_OLD - DELTA * ERR1 / (ERR2 - ERR1);
        dx = X - X_OLD;
        X_OLD = X;
    }
    return (TwoDec(X));
}

/**
 * Given rh relative humidity (%), wind speed (m/s) , Metabolism ( W/mq), iclo mean clothing value and timing H  gives environemnt temperature of comfort.
 *
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */


function ta_comfort(rh, wind, M,clo,H)
{
           var  t = 40.0;
           var balance,i,C,hr,hc,Rst,WS,Rdyn,Fcl,Psk,Pa,Im,Retdyn,w,E,mres,Tex,Cres,R;
           var  Ra = 1/9;
           var fcl = 1+0.31 * iclo;
           var Tsk =35.7 - .0285 * M - 3;
           if (H == -999.0) {Tsk = 35.7 - 0.0285 * M};

           Rst = clo * .155 + Ra / fcl;
           WS = .0052 * (M - 58);
           if  (WS > 0.7) { WS = 0.7};
           var corr = Math.exp(0.043 - 0.398 * wind + 0.066 * wind * wind- 0.378 * WS +0.094 * WS * WS);
           Rdyn = Rst * corr;
           for(i=1; i<1000; i++)
              {
              t=t-0.1;
 
              // Calculation of Convective heat loss from the skin
              
              C = (Tsk - t) / Rdyn;

              // Calculation of radiation heat exchange

              hr = 5.67E-08 * 0.97 * 0.77 * (Math.exp(4 * Math.log(Tsk +273.15)) - Math.exp(4 * Math.log(t + 273.15))) / (Tsk - t);
              hc = 8.7 * Math.exp (0.6 * Math.log(wind));
              if (wind < 1 ){ hc = 3.5+5.2 * wind};
              Fcl = 1 /((hc + hr) * iclo * 0.155 + 1/fcl);
              R = hr * Fcl * (Tsk - t);

              // Calculation of Evaporative Heat Loss from the Skin

              Psk = .1333 * Math.exp(18.6686 - 4030.183 / (Tsk + 235));
              Pa = rh * .1333 * Math.exp(18.6686 - 4030.183 / (t +235)) / 100;
              Im = .38 * (4.9 - 6.5 * corr + 2.6 * corr * corr);
              if (Im > 0.9){Im = 0.9};  
              Retdyn = (Rdyn / Im )/ 16.65;
              w = .001 * M;
              E = w * (Psk - Pa) / Retdyn;

              // Calculation of Convective Heat Loss from Respiration

              mres = 2.58 * .000001 * M;
              Tex = 29 +.2 * t;
              Cres = 1007 * mres * (Tex - t) / 1.8;

              // Calculation of Evaporative Heat Loss from Respiration

              var Wa = .622 * Pa / (101.325 - Pa);
              var Pex = .1333 * Math.exp(18.6686 - 4030.183 / (Tex + 235));
              var Wex = .622 * Pex / (101.325 - Pex);
              var Eres = 2423000 * mres * (Wex - Wa) / 1.8;

              // Calculation of heat debt or heat storage
              var S =1;
              if (H == -999.0) { S = 0;} else {S = 40 / H;};
              balance = M - C - R - E - Cres - Eres - S;
              if( balance < 0)
              break;
              i=i+1;
           }

           return t-0.1;

}
           
/**   Given calculate IREQ  ISO/CD 11079
    * t (C), Ambient air temperature (< +10 C)
    * rh (%), Relative humidity
    * wind (m/s), Relative air velocity (0.4 to 18 m/s)
    * trad (C), Mean radiant temperature (often close to ambient air temperature)
    * M (W/m2), Metabolic energy production (58 to 400 W/m2)
    * W (W/m2), Rate of mechanical work, (normally 0)
    * clo (clo), AVAILABLE basic clothing insulation (1 clo = 0.155 W/m2K) 
    * param 
    * p (l/m2s), Air permeability (low < 5, medium 50, high > 100 l/m2s)
    * w (m/s), Walking speed (or calculated work created air movements)
    * 	Developed by Ingvar Holmer and Hakan O. Nilsson, 1990.
    * Altered by Hakan O. Nilsson and Ingvar Holmer, 1992.
    * Javascript original by Tomas Morales & Pilar Armenderiz, 1998.
    * Modified content and code by Hakan O. Nilsson and Ingvar Holmer, 2000-2002.
  */  


function IREQ(t,rh,wind,trad,M,W,clo,param,p,w) 
   {
    
   if (typeof p === undefined) {p == 50};
   if (typeof w === undefined) {w == 0};
    
   var Tsk,wetness,Tex,Pex,Ta,v,Tr,Icl,
	Psks,fcl,vp,Icl,Iclr,Pa,Tcl,hc,hr,
	IREQ,Ia,Rt,factor,Balance,R,C,Hres,calculation,ICL_ISO11079,
	E,S,DLE,ArAdu,IclCorr,slask,worktype,ICLminimal,ICLneutral,
	IREQneutral,IREQminimal,DLEneutral,DLEminimal = 1;
     
   
   // Parameter adjustements to induce stationarity.
     
   Ta=t;v=wind;Tr=trad;Icl=clo;
   
	if (M <= 58)  { M = 58 };  // minimum metabolic rate 1 met
  
	if (M >= 400) { M = 400};
  
	if (Ta>10) {return(-9999)};
 
	if (w <=0.0052*(M-58)) { w=0.0052*(M-58)};	
	
    if (w>=1.2) {w=1.2};
	
    if (v<=0.4) {v=0.4};
	
    if (v>=18){v=18}; 

    // Calculation clothing insulation parameters.
  
	Icl=Icl*0.155;
	
    Ia=0.092*Math.exp(-0.15*v-0.22*w)-0.0045;
	
    calculation=0;
    
	do {  calculation=calculation+1;
		
        if (calculation==1) 
           {
	       
			Tsk=33.34-0.0354*M;
			wetness=0.06;
		}
         	else	{
			
    		Tsk=35.7-0.0285*M;
			wetness=0.001*M;
	 	}
		
        // Calculation of Tex (C) and Pex,Psks,Pa (Pa) 
      
		Tex=29+0.2*Ta;                     
		Pex=0.1333*Math.exp(18.6686-4030.183/(Tex+235));
		Psks=0.1333*Math.exp(18.6686-4030.183/(Tsk+235)); 
		Pa=(rh/100)*0.1333*Math.exp(18.6686-4030.183/(Ta+235));
      
		// Calculation of IREQ (m2C/W),Rt (m2kPa/W),fcl (n.d.),hr W/m2C with stepwise iteration 
     	IREQ=1; hr=3; ArAdu=0.77; factor=1; // Initial values ! 
        
        do {
			fcl=1+1.197*IREQ;        
			Rt=(0.06/0.38)*(Ia+IREQ);
			E=wetness*(Psks-Pa)/Rt;
			Hres=1.73E-2*M*(Pex-Pa)+1.4E-3*M*(Tex-Ta);      
			Tcl=Tsk-IREQ*(M-W-E-Hres);
			hr=5.67E-8*0.95*ArAdu*(Math.exp(4*Math.log(273+Tcl))-Math.exp(4*Math.log(273+Tr)))/(Tcl-Tr);
			hc=1/Ia-hr;
			R=fcl*hr*(Tcl-Tr);
			C=fcl*hc*(Tcl-Ta);
			Balance=M-W-E-Hres-R-C;
			if (Balance>0) 
               {
				IREQ=IREQ-factor;
				factor=factor/2;
			    }
			else 
                {
				IREQ=IREQ+factor;         
			    }

		} while (Math.abs(Balance) > 0.01); 
		
         IREQ=(Tsk-Tcl)/(R+C);

		Tcl=Ta; hr=3; S=-40; ArAdu=0.77; factor=500; Iclr=Icl; // Initial values !
		
        do {
			fcl=1+1.197*Iclr;
			Iclr=((Icl+0.085/fcl)*(0.54*Math.exp(-0.15*v-0.22*w)*Math.pow(p,0.075)-0.06*Math.log(p)+0.5)-(0.092*Math.exp(-0.15*v-0.22*w)-0.0045)/fcl);
			Rt=(0.06/0.38)*(Ia+Iclr);
			E=wetness*(Psks-Pa)/Rt;
			Hres=1.73E-2*M*(Pex-Pa)+1.4E-3*M*(Tex-Ta);
			Tcl=Tsk-Iclr*(M-W-E-Hres-S);      
			hr=5.67E-8*0.95*ArAdu*(Math.exp(4*Math.log(273+Tcl))-Math.exp(4*Math.log(273+Tr)))/(Tcl-Tr);
			hc=1/Ia-hr;
			R=fcl*hr*(Tcl-Tr);
			C=fcl*hc*(Tcl-Ta);
			Balance=M-W-E-Hres-R-C-S;  
			if (Balance>0)  {
				S=S+factor;
				factor=factor/2;
			}
			else {
				S=S-factor;
			}     
		} while (Math.abs(Balance) > 0.01);
		
        DLE=-40/S;
		
        
        if (calculation==1) 
            {
			
            IREQminimal =Math.round((IREQ/0.155)*100)/100;
		    ICLminimal =Math.round((((IREQ+Ia/fcl)/(0.54*Math.exp(-0.15*v-0.22*w)*Math.pow(p,0.075)-0.06*Math.log(p)+0.5))-0.085/fcl)/0.155*100)/100;
		    if (param == "ICL_min") {return(ICLminimal)}
            if (S>-8)
             
              { DLEminimal=8*60}
			
            else
              {
                DLEminimal=Math.round(DLE*100)/100*60;
		      }
            }
		 
        else	
            {
			    IREQneutral=Math.round((IREQ/0.155)*100)/100;
			    ICLneutral=Math.round((((IREQ+Ia/fcl)/(0.54*Math.exp(-0.15*v-0.22*w)*Math.pow(p,0.075)-0.06*Math.log(p)+0.5))-0.085/fcl)/0.155*100)/100;
			    if (param == "ICL_neutral") {return(ICLneutral)}
                if (param == "IREQ_neutral") {return(IREQneutral)}
                if (S>-8)
                    { DLEneutral=8}
			    
                else
                    { DLEneutral=Math.round(DLE*100)/100*60}
			
           if (Icl/0.155 > ICLneutral)
             
              {ICL_ISO11079=1} // "AVAILABLE > REQUIRED MINIMAL & NEUTRAL basic clothing insulation"
           
           else  
			   {ICL_ISO11079=0}	// "NOT AVAILABLE < REQUIRED MINIMAL & NEUTRAL basic clothing insulation"
		    }
	} while (calculation < 2);
    
    if (param == "IREQ_neutral") {return(IREQneutral)}
    else if (param == "IREQ_min") {return(IREQminimal)}
    else if (param == "ICL_neutral") {return(ICLneutral)}
    else if (param == "ICL_min") {return(ICLminimal)}
    else if (param == "DLE_neutral") {return(DLEneutral)}
    else if (param == "DLE_min") {return(DLEminimal)}
    else if (param == "ICL_ISO11079") {return(ICL_ISO11079)}
    else  {return(-9999)}    
}


/**
 * Given Ambient Air Temperature (< +10 Celsius deg ), relative humidity rh (%), Relative air velocity wind ( 0.4 to 18 m/s)
 * Mean radiant temperature (Celsius Deg), Metabolic energy production M (58 to 400 W/m2), Rate of mechanical work W ( normally 0 W/m2),
 * AVAILABLE basic clothing insulation clo ( clo = 0.155 W/m2K), Air clothing ensemble permeability p (low < 5, medium 50, high > 100 l/m2s) 
 * give a Recovery Time Index in mimutes ISO 11079. 
 * Reference: http://www.eat.lth.se/fileadmin/eat/Termisk_miljoe/IREQ2009ver4_2.html
 * @param {number} t,rh,wind,trad,M,W,clo,p,w
 * @return {number}
 * @customfunction
 */


function recovery_time(t,rh,wind,trad,M,W,clo,p,w) 
   {
    
    if (typeof p === undefined) {p == 50};
    if (typeof w === undefined) {w == 0};
    
    var Tsk,wetness,Tex,Pex,Ta,v,Tr,Icl,
	Psks,fcl,vp,Icl,Iclr,Pa,Tcl,hc,hr,
	IREQ,Ia,Rt,factor,Balance,R,C,Hres,calculation,RTneutral,
	E,S,DLE,ArAdu,IclCorr,slask,worktype,ICLneutral,
	IREQneutral,DLEneutral = 1;
     
   
    // Parameter adjustements to induce stationarity.
    Ta=t;v=wind;Tr=trad;Icl=clo;
   
	if (M <= 58)  { M = 58 };  // minimum metabolic rate 1 met
  
	if (M >= 400) { M = 400};
 
	if (w <=0.0052*(M-58)) { w=0.0052*(M-58)};	
	
    if (w>=1.2) {w=1.2};
	
    if (v<=0.4) {v=0.4};
	
    if (v>=18){v=18}; 

    // Calculation clothing insulation parameters.
  
	Icl=Icl*0.155;
	
    Ia=0.092*Math.exp(-0.15*v-0.22*w)-0.0045;
  
    // Calculation of Tsk (C) and wetness (%) for RTneutral! 
		
    Tsk=35.7-0.0285*M;
	wetness=0.001*M;
		
     // Calculation of Tex (C) and Pex,Psks,Pa (Pa) 
		
     Tex=29+0.2*Ta;                     
	 Pex=0.1333*Math.exp(18.6686-4030.183/(Tex+235));
	 Psks=0.1333*Math.exp(18.6686-4030.183/(Tsk+235)); 
	 Pa=(rh/100)*0.1333*Math.exp(18.6686-4030.183/(Ta+235));  
		
        // Calculation of S (W/m2), Rt (m2kPa/W), fcl (n.d.), hr W/m2C with stepwise iteration 
		
     Tcl=Ta; hr=3; S=-40; ArAdu=0.77; factor=100; Iclr=Icl; // Initial values !          
	 do {
			fcl=1+1.97*Iclr;
			Iclr=((Icl+0.085/fcl)*(0.54*Math.exp(-0.15*v-0.22*w)*Math.pow(p,0.075)-0.06*Math.log(p)+0.5)-
			(0.092*Math.exp(-0.15*v-0.22*w)-0.0045)/fcl);
			Rt=(0.06/0.38)*(Ia+Iclr);
			E=wetness*(Psks-Pa)/Rt;
			Hres=1.73E-2*M*(Pex-Pa)+1.4E-3*M*(Tex-Ta);
			Tcl=Tsk-Iclr*(M-W-E-Hres-S);      
			hr=5.67E-8*0.95*ArAdu*(Math.exp(4*Math.log(273+Tcl))-Math.exp(4*Math.log(273+Tr)))/(Tcl-Tr);
			hc=1/Ia-hr;
			R=fcl*hr*(Tcl-Tr);
			C=fcl*hc*(Tcl-Ta);
			Balance=M-W-E-Hres-R-C-S;  
			if (Balance>0)  {
				S=S+factor;
				factor=factor/2;
			}
			else {
				S=S-factor;         
			}     
		} while (Math.abs(Balance) > 0.01);
		
        DLE=-40/S;
        
        // Negative body storage.
     
        if (DLE>=0)
          
            {RTneutral=-1} 
        
        else
        
            {RTneutral=(Math.abs(DLE)*100)/100*60};
  
         
       return(RTneutral);
  
}


/**
 * Given air temperature (Celsius), relative humidity (%), wind velocity (m/sec) and mean radiant temperature ( tmrt in Celsius degree) gives the Universal Thermal Climate Index in Celsius.
 *
 * @param {number} t,rh,wind,tmrt
 * @return {number}
 * @customfunction
 */

function UTCI(ta,rh,wind,tmrt)  
                 {    
                  
                  var ta,pa,va, e, dtm,i;
                  e = es(ta)/10; // use vapour pressure in kPa 
                  pa = (e*rh/100.0); 
                  va = wind;
	          if (  va < 0.51) {va=0.5;};
	          if (  va > 17) {va=17;};
				 
                  dtm = tmrt - ta;
    
                  utci = new Array(210);
                  
                  utci[0]=ta;
                  utci[1]=6.07562052E-01;
                  utci[2]=-2.27712343E-02*ta;
                  utci[3]=8.06470249E-04*ta*ta;
                  utci[4]=-1.54271372E-04*ta*ta*ta;
                  utci[5]=-3.24651735E-06*ta*ta*ta*ta;
                  utci[6]=7.32602852E-08*ta*ta*ta*ta*ta;
                  utci[7]=1.35959073E-09*ta*ta*ta*ta*ta*ta;
                  utci[8]=-2.25836520E-00*va;
                  utci[9]=8.80326035E-02*ta*va;
                  utci[10]=2.16844454E-03*ta*ta*va;
                  utci[11]=-1.53347087E-05*ta*ta*ta*va;
                  utci[12]=-5.72983704E-07*ta*ta*ta*ta*va;
                  utci[13]=-2.55090145E-09*ta*ta*ta*ta*ta*va;
                  utci[14]=-7.51269505E-01*va*va;
                  utci[15]=-4.08350271E-03*ta*va*va;
                  utci[16]=-5.21670675E-05*ta*ta*va*va;
                  utci[17]=1.94544667E-06*ta*ta*ta*va*va;
                  utci[18]=1.14099531E-08*ta*ta*ta*ta*va*va;
                  utci[19]=1.58137256E-01*va*va*va;
                  utci[20]=-6.57263143E-05*ta*va*va*va;
                  utci[21]=2.22697524E-07*ta*ta*va*va*va;
                  utci[22]=-4.16117031E-08*ta*ta*ta*va*va*va;
                  utci[23]=-1.27762753E-02*va*va*va*va;
                  utci[24]=9.66891875E-06*ta*va*va*va*va;
                  utci[25]=2.52785852E-09*ta*ta*va*va*va*va;
                  utci[26]=4.56306672E-04*va*va*va*va*va;
                  utci[27]=-1.74202546E-07*ta*va*va*va*va*va;
                  utci[28]=-5.91491269E-06*va*va*va*va*va*va;
                  utci[29]=3.98374029E-01*dtm;
                  utci[30]=1.83945314E-04*ta*dtm;
                  utci[31]=-1.73754510E-04*ta*ta*dtm;
                  utci[32]=-7.60781159E-07*ta*ta*ta*dtm;
                  utci[33]=3.77830287E-08*ta*ta*ta*ta*dtm;
                  utci[34]=5.43079673E-10*ta*ta*ta*ta*ta*dtm;
                  utci[35]=-2.00518269E-02*va*dtm;
                  utci[36]=8.92859837E-04*ta*va*dtm;
                  utci[37]=3.45433048E-06*ta*ta*va*dtm;
                  utci[38]=-3.77925774E-07*ta*ta*ta*va*dtm;
                  utci[39]=-1.69699377E-09*ta*ta*ta*ta*va*dtm;
                  utci[40]=1.69992415E-04*va*va*dtm;
                  utci[41]=-4.99204314E-05*ta*va*va*dtm;
                  utci[42]=2.47417178E-07*ta*ta*va*va*dtm;
                  utci[43]=1.07596466E-08*ta*ta*ta*va*va*dtm;
                  utci[44]=8.49242932E-05*va*va*va*dtm;
                  utci[45]=1.35191328E-06*ta*va*va*va*dtm;
                  utci[46]=-6.21531254E-09*ta*ta*va*va*va*dtm;
                  utci[47]=-4.99410301E-06*va*va*va*va*dtm;
                  utci[48]=-1.89489258E-08*ta*va*va*va*va*dtm;
                  utci[49]=8.15300114E-08*va*va*va*va*va*dtm;
                  utci[50]=7.55043090E-04*dtm*dtm;
                  utci[51]=-5.65095215E-05*ta*dtm*dtm;
                  utci[52]=-4.52166564E-07*ta*ta*dtm*dtm;
                  utci[53]=2.46688878E-08*ta*ta*ta*dtm*dtm;
                  utci[54]=2.42674348E-10*ta*ta*ta*ta*dtm*dtm;
                  utci[55]=1.54547250E-04*va*dtm*dtm;
                  utci[56]=5.24110970E-06*ta*va*dtm*dtm;
                  utci[57]=-8.75874982E-08*ta*ta*va*dtm*dtm;
                  utci[58]=-1.50743064E-09*ta*ta*ta*va*dtm*dtm;
                  utci[59]=-1.56236307E-05*va*va*dtm*dtm;
                  utci[60]=-1.33895614E-07*ta*va*va*dtm*dtm;
                  utci[61]=2.49709824E-09*ta*ta*va*va*dtm*dtm;
                  utci[62]=6.51711721E-07*va*va*va*dtm*dtm;
                  utci[63]=1.94960053E-09*ta*va*va*va*dtm*dtm;
                  utci[64]=-1.00361113E-08*va*va*va*va*dtm*dtm;
                  utci[65]=-1.21206673E-05*dtm*dtm*dtm;
                  utci[66]=-2.18203660E-07*ta*dtm*dtm*dtm;
                  utci[67]=7.51269482E-09*ta*ta*dtm*dtm*dtm;
                  utci[68]=9.79063848E-11*ta*ta*ta*dtm*dtm*dtm;
                  utci[69]=1.25006734E-06*va*dtm*dtm*dtm;
                  utci[70]=-1.81584736E-09*ta*va*dtm*dtm*dtm;
                  utci[71]=-3.52197671E-10*ta*ta*va*dtm*dtm*dtm;
                  utci[72]=-3.36514630E-08*va*va*dtm*dtm*dtm;
                  utci[73]=1.35908359E-10*ta*va*va*dtm*dtm*dtm;
                  utci[74]=4.17032620E-10*va*va*va*dtm*dtm*dtm;
                  utci[75]=-1.30369025E-09*dtm*dtm*dtm*dtm;
                  utci[76]=4.13908461E-10*ta*dtm*dtm*dtm*dtm;
                  utci[77]=9.22652254E-12*ta*ta*dtm*dtm*dtm*dtm;
                  utci[78]=-5.08220384E-09*va*dtm*dtm*dtm*dtm;
                  utci[79]=-2.24730961E-11*ta*va*dtm*dtm*dtm*dtm;
                  utci[80]=1.17139133E-10*va*va*dtm*dtm*dtm*dtm;
                  utci[81]=6.62154879E-10*dtm*dtm*dtm*dtm*dtm;
                  utci[82]=4.03863260E-13*ta*dtm*dtm*dtm*dtm*dtm;
                  utci[83]=1.95087203E-12*va*dtm*dtm*dtm*dtm*dtm;
                  utci[84]=-4.73602469E-12*dtm*dtm*dtm*dtm*dtm*dtm;
                  utci[85]=5.12733497E-00*pa;
                  utci[86]=-3.12788561E-01*ta*pa;
                  utci[87]=-1.96701861E-02*ta*ta*pa;
                  utci[88]=9.99690870E-04*ta*ta*ta*pa;
                  utci[89]=9.51738512E-06*ta*ta*ta*ta*pa;
                  utci[90]=-4.66426341E-07*ta*ta*ta*ta*ta*pa;
                  utci[91]=5.48050612E-01*va*pa;
                  utci[92]=-3.30552823E-03*ta*va*pa;
                  utci[93]=-1.64119440E-03*ta*ta*va*pa;
                  utci[94]=-5.16670694E-06*ta*ta*ta*va*pa;
                  utci[95]=9.52692432E-07*ta*ta*ta*ta*va*pa;
                  utci[96]=-4.29223622E-02*va*va*pa;
                  utci[97]=5.00845667E-03*ta*va*va*pa;
                  utci[98]=1.00601257E-06*ta*ta*va*va*pa;
                  utci[99]=-1.81748644E-06*ta*ta*ta*va*va*pa;
                  utci[100]=-1.25813502E-03*va*va*va*pa;
                  utci[101]=-1.79330391E-04*ta*va*va*va*pa;
                  utci[102]=2.34994441E-06*ta*ta*va*va*va*pa;
                  utci[103]=1.29735808E-04*va*va*va*va*pa;
                  utci[104]=1.29064870E-06*ta*va*va*va*va*pa;
                  utci[105]=-2.28558686E-06*va*va*va*va*va*pa;
                  utci[106]=-3.69476348E-02*dtm*pa;
                  utci[107]=1.62325322E-03*ta*dtm*pa;
                  utci[108]=-3.14279680E-05*ta*ta*dtm*pa;
                  utci[109]=2.59835559E-06*ta*ta*ta*dtm*pa;
                  utci[110]=-4.77136523E-08*ta*ta*ta*ta*dtm*pa;
                  utci[111]=8.64203390E-03*va*dtm*pa;
                  utci[112]=-6.87405181E-04*ta*va*dtm*pa;
                  utci[113]=-9.13863872E-06*ta*ta*va*dtm*pa;
                  utci[114]=5.15916806E-07*ta*ta*ta*va*dtm*pa;
                  utci[115]=-3.59217476E-05*va*va*dtm*pa;
                  utci[116]=3.28696511E-05*ta*va*va*dtm*pa;
                  utci[117]=-7.10542454E-07*ta*ta*va*va*dtm*pa;
                  utci[118]=-1.24382300E-05*va*va*va*dtm*pa;
                  utci[119]=-7.38584400E-09*ta*va*va*va*dtm*pa;
                  utci[120]=2.20609296E-07*va*va*va*va*dtm*pa;
                  utci[121]=-7.32469180E-04*dtm*dtm*pa;
                  utci[122]=-1.87381964E-05*ta*dtm*dtm*pa;
                  utci[123]=4.80925239E-06*ta*ta*dtm*dtm*pa;
                  utci[124]=-8.75492040E-08*ta*ta*ta*dtm*dtm*pa;
                  utci[125]=2.77862930E-05*va*dtm*dtm*pa;
                  utci[126]=-5.06004592E-06*ta*va*dtm*dtm*pa;
                  utci[127]=1.14325367E-07*ta*ta*va*dtm*dtm*pa;
                  utci[128]=2.53016723E-06*va*va*dtm*dtm*pa;
                  utci[129]=-1.72857035E-08*ta*va*va*dtm*dtm*pa;
                  utci[130]=-3.95079398E-08*va*va*va*dtm*dtm*pa;
                  utci[131]=-3.59413173E-07*dtm*dtm*dtm*pa;
                  utci[132]=7.04388046E-07*ta*dtm*dtm*dtm*pa;
                  utci[133]=-1.89309167E-08*ta*ta*dtm*dtm*dtm*pa;
                  utci[134]=-4.79768731E-07*va*dtm*dtm*dtm*pa;
                  utci[135]=7.96079978E-09*ta*va*dtm*dtm*dtm*pa;
                  utci[136]=1.62897058E-09*va*va*dtm*dtm*dtm*pa;
                  utci[137]=3.94367674E-08*dtm*dtm*dtm*dtm*pa;
                  utci[138]=-1.18566247E-09*ta*dtm*dtm*dtm*dtm*pa;
                  utci[139]=3.34678041E-10*va*dtm*dtm*dtm*dtm*pa;
                  utci[140]=-1.15606447E-10*dtm*dtm*dtm*dtm*dtm*pa;
                  utci[141]=-2.80626406E-00*pa*pa;
                  utci[142]=5.48712484E-01*ta*pa*pa;
                  utci[143]=-3.99428410E-03*ta*ta*pa*pa;
                  utci[144]=-9.54009191E-04*ta*ta*ta*pa*pa;
                  utci[145]=1.93090978E-05*ta*ta*ta*ta*pa*pa;
                  utci[146]=-3.08806365E-01*va*pa*pa;
                  utci[147]=1.16952364E-02*ta*va*pa*pa;
                  utci[148]=4.95271903E-04*ta*ta*va*pa*pa;
                  utci[149]=-1.90710882E-05*ta*ta*ta*va*pa*pa;
                  utci[150]=2.10787756E-03*va*va*pa*pa;
                  utci[151]=-6.98445738E-04*ta*va*va*pa*pa;
                  utci[152]=2.30109073E-05*ta*ta*va*va*pa*pa;
                  utci[153]=4.17856590E-04*va*va*va*pa*pa;
                  utci[154]=-1.27043871E-05*ta*va*va*va*pa*pa;
                  utci[155]=-3.04620472E-06*va*va*va*va*pa*pa;
                  utci[156]=5.14507424E-02*dtm*pa*pa;
                  utci[157]=-4.32510997E-03*ta*dtm*pa*pa;
                  utci[158]=8.99281156E-05*ta*ta*dtm*pa*pa;
                  utci[159]=-7.14663943E-07*ta*ta*ta*dtm*pa*pa;
                  utci[160]=-2.66016305E-04*va*dtm*pa*pa;
                  utci[161]=2.63789586E-04*ta*va*dtm*pa*pa;
                  utci[162]=-7.01199003E-06*ta*ta*va*dtm*pa*pa;
                  utci[163]=-1.06823306E-04*va*va*dtm*pa*pa;
                  utci[164]=3.61341136E-06*ta*va*va*dtm*pa*pa;
                  utci[165]=2.29748967E-07*va*va*va*dtm*pa*pa;
                  utci[166]=3.04788893E-04*dtm*dtm*pa*pa;
                  utci[167]=-6.42070836E-05*ta*dtm*dtm*pa*pa;
                  utci[168]=1.16257971E-06*ta*ta*dtm*dtm*pa*pa;
                  utci[169]=7.68023384E-06*va*dtm*dtm*pa*pa;
                  utci[170]=-5.47446896E-07*ta*va*dtm*dtm*pa*pa;
                  utci[171]=-3.59937910E-08*va*va*dtm*dtm*pa*pa;
                  utci[172]=-4.36497725E-06*dtm*dtm*dtm*pa*pa;
                  utci[173]=1.68737969E-07*ta*dtm*dtm*dtm*pa*pa;
                  utci[174]=2.67489271E-08*va*dtm*dtm*dtm*pa*pa;
                  utci[175]=3.23926897E-09*dtm*dtm*dtm*dtm*pa*pa;
                  utci[176]=-3.53874123E-02*pa*pa*pa;
                  utci[177]=-2.21201190E-01*ta*pa*pa*pa;
                  utci[178]=1.55126038E-02*ta*ta*pa*pa*pa;
                  utci[179]=-2.63917279E-04*ta*ta*ta*pa*pa*pa;
                  utci[180]=4.53433455E-02*va*pa*pa*pa;
                  utci[181]=-4.32943862E-03*ta*va*pa*pa*pa;
                  utci[182]=1.45389826E-04*ta*ta*va*pa*pa*pa;
                  utci[183]=2.17508610E-04*va*va*pa*pa*pa;
                  utci[184]=-6.66724702E-05*ta*va*va*pa*pa*pa;
                  utci[185]=3.33217140E-05*va*va*va*pa*pa*pa;
                  utci[186]=-2.26921615E-03*dtm*pa*pa*pa;
                  utci[187]=3.80261982E-04*ta*dtm*pa*pa*pa;
                  utci[188]=-5.45314314E-09*ta*ta*dtm*pa*pa*pa;
                  utci[189]=-7.96355448E-04*va*dtm*pa*pa*pa;
                  utci[190]=2.53458034E-05*ta*va*dtm*pa*pa*pa;
                  utci[191]=-6.31223658E-06*va*va*dtm*pa*pa*pa;
                  utci[192]=3.02122035E-04*dtm*dtm*pa*pa*pa;
                  utci[193]=-4.77403547E-06*ta*dtm*dtm*pa*pa*pa;
                  utci[194]=1.73825715E-06*va*dtm*dtm*pa*pa*pa;
                  utci[195]=-4.09087898E-07*dtm*dtm*dtm*pa*pa*pa;
                  utci[196]=6.14155345E-01*pa*pa*pa*pa;
                  utci[197]=-6.16755931E-02*ta*pa*pa*pa*pa;
                  utci[198]=1.33374846E-03*ta*ta*pa*pa*pa*pa;
                  utci[199]=3.55375387E-03*va*pa*pa*pa*pa;
                  utci[200]=-5.13027851E-04*ta*va*pa*pa*pa*pa;
                  utci[201]=1.02449757E-04*va*va*pa*pa*pa*pa;
                  utci[202]=-1.48526421E-03*dtm*pa*pa*pa*pa;
                  utci[203]=-4.11469183E-05*ta*dtm*pa*pa*pa*pa;
                  utci[204]=-6.80434415E-06*va*dtm*pa*pa*pa*pa;
                  utci[205]=-9.77675906E-06*dtm*dtm*pa*pa*pa*pa;
                  utci[206]=8.82773108E-02*pa*pa*pa*pa*pa;
                  utci[207]=-3.01859306E-03*ta*pa*pa*pa*pa*pa;
                  utci[208]=1.04452989E-03*va*pa*pa*pa*pa*pa;
                  utci[209]=2.47090539E-04*dtm*pa*pa*pa*pa*pa;
                  utci[210]=1.48348065E-03*pa*pa*pa*pa*pa*pa;            
                  
                  var total = 0;

                  for (i = 0, n = utci.length; i < n; ++i)
                      {
                           total = total+utci[i];
                      };

                  if (  ta < -50.0 || ta > 60.0 ) {total=9999};
                  if ( (tmrt < ta-30.0) || (tmrt > ta+70.0 )) {total=9999};
                  if (  rh <= 0.0 || rh >= 100.0 ) {total=9999};
                  return TwoDec(total);
}

/**
 * Given air temperature (Celsius), relative humidity (%) give a heat index in Celsius degree. References:[1] http://www.wpc.ncep.noaa.gov/html/heatindex.shtml [2] https://en.wikipedia.org/wiki/Heat_index [3] http://www.srh.noaa.gov/images/ffc/pdf/ta_htindx.PDF
 * 
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */

function heatindex(t,rh)
{
  var tf, tf2, ur2, hif;
  tf = C2F(t);
  tf2 = Math.pow(tf, 2.0);
  ur2 = Math.pow(rh, 2.0);
  hif = -42.379 + 2.04901523 * tf + 10.1433127 * rh - 0.22475541 *tf * rh
        - 6.83783 * 0.001* tf2 - 5.481717 * 0.01* ur2 +1.22874 * 0.001* tf2* rh
        + 8.5282 * 0.0001* tf * ur2 -1.99 * 0.000001* tf2* ur2;  
  
  if (t < 44 & t > 27 & rh < 13 )
           {
        return (TwoDec(F2C(hif-((13-rh)/4)*Math.sqrt((17-Mat.abs(tf-95.))/17))));
      }
  
  else if (t < 31 & t > 27 & rh > 85 ) {
        return (TwoDec(F2C(hif-((rh-85)/10) * ((87-tf)/5))));
      }
  

  if (t > 27)
      {
        return (TwoDec(F2C(hif)));
      }
     
  else
      
      {return(TwoDec(F2C(0.5 * (tf + 61.0 + ((tf-68.0) *1.2) + (rh*0.094) ))))};
  
}




/**
 * Given air temperature (Celsius), relative humidity (%), wind velocity (m/sec), direct beam short-wavelength radiation (W/mq) and sunelev sun elevation angle (degrees) gives Steadman outdoor sun index.
 *
 * @param {number} t,rh,wind,rshort,sunelev
 * @return {number}
 * @customfunction 
 */

function steadman_outdoor(t,rh,wind,rad,sunelev)
{    
  var steadman_outdoor_sun=9999;
  if (rh > 100.1 || rh < 0.0) {return 9999};
  if (t > 100.0 || t < -100.0) {return 9999};
  if (rad < 50) { return(steadman_outdoor_shade(t,rh,wind))}
  else {
    var ee = (rh/1000.0)*(6.105*Math.exp((t*17.27)/(237.7+t)));
    var q_glob = 0.56*(0.386-(0.0032*sunelev))*rad + 0.224*(0.1*rad)+ 0.028*rad- 150.0*(0.38-0.16*(Math.pow(ee,0.5))); 
    if (q_glob > 0.0) {steadman_outdoor_sun = t+3.48*(ee)-0.7*wind +0.7*q_glob/(wind+10.0)-4.25};
    };  
  return TwoDec(steadman_outdoor_sun);
}

/**
 * Given air temperature (Celsius), rh relative humidity (%), wind velocity (m/sec)  gives Steadman outdoor shade index.
 *
 * @param {number} t,rh,wind
 * @return {number}
 * @customfunction
 */

function steadman_outdoor_shade(t,rh,wind)
{
    var steadman_outdoor_shade,e;
    
    steadman_outdoor_shade = -9999;
    
    if (rh > 100.1 || rh < 0.0)
        {return -9999}
    else if (wind > 130.0 || wind < 0.0)
        {return 9999}
    else if (t > 100.0 || t < -100.0)
         {return -9999}
    else
    {
       e = (rh/100.0)*(6.105*Math.exp((t*17.27)/(237.7+t)));
       steadman_outdoor_shade = t+(0.33*e)-(0.7*wind)-4.0;
    };

  
  return TwoDec(steadman_outdoor_shade);
}

/**
 * Given air temperature (Celsius), relative humidity (%)  gives Steadman indoor index.
 *
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function steadman_indoor(t,rh)
{ 
    var steadman_indoor,e;

    steadman_indoor = -9999;
  
    if (rh > 100.1 || rh < 0.0) {return -9999}
    else if (t > 100.0 || t < -100.0) {return -9999}
    else
    {
      e = (rh/100.0)*(6.105*Math.exp((t*17.27)/(237.7+t)));
      steadman_indoor = -2.56+(0.89*t)+(0.382*e);  
    };

  return TwoDec(steadman_indoor);
}


function utci_class(t,rh,wind,trad) 
  {
	
  var  utci_v,utci_c;
 
  utci_v=UTCI(t,rh,wind,trad);
  
  if ( utci_v > 46.0)
   {utci_c=10.0;}
  else if (utci_v > 38.0 && utci_v <= 46.0)
    {utci_c=9.0;}
  else if (utci_v > 32.0 && utci_v <= 38.0)
  {utci_c=8.0;}
  else if (utci_v > 26.0 && utci_v <= 32.0)
    {utci_c=7.0;}
  else if (utci_v > 9.0 && utci_v <= 26.0)
    {utci_c=6.0;}
  else if (utci_v > 0.0 && utci_v <= 9.0)
    {utci_c=5.0;}
  else if (utci_v > -13.0 && utci_v <= 0)
  {utci_c=4.0;}
  else if (utci_v > -27.0 && utci_v <= -13.0)
    {utci_c=3.0;}	
  else if (utci_v > -40.0 && utci_v <= -27.0)
    {utci_c=2.0;}
  else if (utci_v <= -40.0)
    {utci_c=1.0;}
  else if (utci_v == 9999)
  {utci_c=9999};

  return utci_c;
}

function utci_class7(t,rh, wind,trad) 
{
	
  var  utci_v,utci_c;
 
  utci_v=UTCI(t,rh,wind,trad);
  
  if ( utci_v > 46.0)
   {utci_c=7.0;}
  else if (utci_v > 38.0 && utci_v <= 46.0)
    {utci_c=7.0;}
  else if (utci_v > 32.0 && utci_v <= 38.0)
  {utci_c=7.0;}
  else if (utci_v > 26.0 && utci_v <= 32.0)
    {utci_c=6.0;}
  else if (utci_v > 16.0 && utci_v <= 26.0)
    {utci_c=6.0;}
  else if (utci_v > 0.0 && utci_v <= 16.0)
    {utci_c=5.0;}
  else if (utci_v > -13.0 && utci_v <= 0)
  {utci_c=4.0;}
  else if (utci_v > -27.0 && utci_v <= -13.0)
    {utci_c=3.0;}	
  else if (utci_v > -40.0 && utci_v <= -27.0)
    {utci_c=2.0;}
  else if (utci_v <= -40.0)
    {utci_c=1.0;}
  else if (utci_v == 9999)
  {utci_c=9999};

  return utci_c;
}
    


/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives sharlau index state.
 *
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */


function sharlau_index_state(t,rh) 
  {
  var sharlau;
  var tcrit;

  if ( t < 5.1) {
                 tcrit =  - 0.0003 * Math.pow(rh,2)+ ( 0.1497 *rh ) - 7.7133;
                }
  else if (t>15.1) {
                 tcrit =   - 17.089 * Math.log(rh) + 94.979;
                 } 

   else { tcrit=t};
   var deltatcrit=t-tcrit;
  
   if (deltatcrit >= 0) {
                         sharlau="Comfort";
                        } 

   else if ( 0 > deltatcrit & deltatcrit >= -1) {
                                                 sharlau="Slight unpleasant";
                                                 } 
  
   else if (  - 1 < deltatcrit & deltatcrit >= - 3) 
                                                   {
                                                    sharlau="Unpleasant";
                                                   } 
	
  else {sharlau="Heavy Unpleasant"};
  
  return sharlau;

  }  
 
/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives sharlau index delta in celsius degrees.
 *
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */
      
function sharlau_index_delta(t,rh) 
         {
         var sharlau;
         var tcrit;

         if ( t < 5.1) {
                 tcrit =  - 0.0003 * Math.pow(rh,2)+ ( 0.1497 *rh ) - 7.7133;
                }
         else if (t>15.1) {
                 tcrit =   - 17.089 * Math.log(rh) + 94.979;
                 } 

         else { tcrit=t};
         var deltatcrit=t-tcrit;
  
     
         return deltatcrit;

         }  


/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  RSI Relative strain index  (RSI).
 *
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function RSI_index(t,rh) 
         {
                           var vap= pvap(t,rh);
                           var RSI = (t-21)/(58-vap*10);
                           return TwoDec(RSI);

         }


/**
 * Given air temperature (Celsius), relative humidity (%), wind velocity (m/sec) give humidex index.
 *
 * @param {number} t,rh,wind
 * @return {number}
 * @customfunction
 */

function humidex(t,rh)
{
  
  var humidex,e;
      humidex = -9999;
  
  if (rh > 100.1 || rh < 0.0) { return -9999}
  
    
  else if (t > 100.0 || t < -100.0)
       
  {return 9999}
  
    else
    {
      e = (rh/100.0)*(6.105*Math.exp((t*17.27)/(237.7+t)));
      humidex = t+(0.5555*(e-10.0));
    };
  

  return TwoDec(humidex);
}




/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  Oxford index (WD).
 *
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function oxford_index(t,rh)  
         {
          var ox;
          var tw = wetbulb(t,rh);
          ox = 0.85*tw+0.15*t;
          return ox;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%)and gives  Discomfort index (DI). 
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function discomfort_index(t,rh)   
         {
          var disc;
          var tw = wetbulb(t,rh);
          disc = 0.5*tw+0.5*t;
          return disc;
}


/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives Fighter index of thermal stress (FITS). 
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function fits_index(t,rh) 
         {
          var fits;
          var tw = wetbulb(t,rh)
          fits = 0.83*tw+0.35*t+5.08
          return fits;
}



/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  Wet-bulb dry temperature (WBDT). 
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function wbdt(t,rh) 
         {
          var wbdt;
          var tw = wetbulb(t,rh);
          wbdt = 0.4*tw+0.6*t;
          return wbdt;
}



/**
 * Given t air temperature (Celsius), rh relative humidity (%) and Tg globometric temperature gives  Wet-bulb globe temperature (WBGT) index indoor. 
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function wbgt_outdoor(t,rh,wind,solar,press,topo) 
         {
          var wbgt;
	  var pair=pheight(press,topo);
          var tw = wetbulb(t,rh,pair);
	  var tg = Tglob_sphere(t,rh,wind,solar,pair,0.05,0.97,0.8,0);

          wbgt = 0.7*tw+0.2*tg+0.1*t;
          return wbgt;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  Wet-bulb globe temperature (WBGT) index indoor. Bernard Integration for wind. 
 * @param {number} t,rh 
 * Bernard TE, Pourmoghani M (1999)  "Prediction of Workplace Wet Bulb Global Temperature."  Applied Occupational and Environmental Hygiene 14: 126-134
 * Ramsey JD, Bernard TE (2000) Heat Stress in R Harris (ed) Patty's Industrial Hygiene and Toxicology vol 2 New York: John Wiley & Sons 
 * @return {number}
 * @customfunction
 */

function wbgt_indoor(t,rh,wind,press,elev) 
         {
          if ( wind === undefined) {wind=0.1};
          var wbgt;
          var pair=pheight(press,elev);
          var tw = wetbulb(t,rh,pair);
		  wbgt= 0.67*tw+0.33*t-0.048 *Math.log(wind)*(t-tw);
          /*if ( wind < 1.1) { wbgt= 0.04*t + 0.96*tw};*/
          return wbgt;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%) and Tg globometric temperature gives  Wet-bulb globe temperature (WBGT) index indoor. 
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function wbgt(t,rh,tg) 
         {
          var wbgt;
          var tw = wetbulb(t,rh)
          wbgt = 0.7*tw+0.2*tg+0.1*t;
          return wbgt;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  Wet-bulb globe temperature (WBGT) index indoor. Bernard Integration for wind. 
 * @param {number} t,rh 
 * Bernard TE, Pourmoghani M (1999)  "Prediction of Workplace Wet Bulb Global Temperature."  Applied Occupational and Environmental Hygiene 14: 126-134
 * Ramsey JD, Bernard TE (2000) Heat Stress in R Harris (ed) Patty's Industrial Hygiene and Toxicology vol 2 New York: John Wiley & Sons 
 * @return {number}
 * @customfunction
 */

function wbgt_indoor_nop(t,rh,wind) 
         {
          if ( wind === undefined) {wind=1};
          var wbgt;
          var tw = wetbulb(t,rh)
          wbgt= 0.67*tw+0.33*t-0.048 *Math.log(wind)*(t-tw);
          /*if ( wind < 1.1) { wbgt= 0.04*t + 0.96*tw};*/
          return wbgt;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives Modified discomfort index (MDI). 
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function mdi_index(t,rh)    
         {
          var mdi;
          var tw = wetbulb(t,rh);
          mdi = 0.7*tw+0.3*t;
          return mdi;
}




/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  thom discomfort index. 
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */


function thom(t,rh) 
         {
          var thom;
          var tw = wetbulb(t,rh);
          thom = 0.4 * (t + tw) + 4.8;
          return thom;
}

/**
 * Given Ambient Air Temperature (< +10 Celsius) and relative air velocity wind ( 0.4 to 18 m/s)
 * give a windchill index - ISO11079. 
 * Reference: http://www.eat.lth.se/fileadmin/eat/Termisk_miljoe/IREQ2009ver4_2.html
 * @param {number} Ta,v
 * @return {number}
 * @customfunction
 */

function windchill(t,wind) 
        { var Tawci,twc = 1;
	      if (wind < 1.3) ( wind=1.3);
	      Tawci = t;
          wind=(3.6)*wind;
	      twc = 13.12 + 0.6215 * Tawci-11.37 * Math.pow(wind,0.16) +0.3965 * Tawci* Math.pow(wind,0.16);
	      return(TwoDec(twc));
        }



function wc_watt2mq (t, wind)
			{
				var Watts;
                                wind=(3.6)*wind;
				Watts = (12.1452 + 11.6222*Math.sqrt(wind) - 1.16222 * wind)*(33 - t);
				return Watts;

			}


/**
 * Given a temperature t (Celsius) and wind ( m/sec) frost time following Wind chill chart.
 * @param {number} t
 * @return {number} 
 * @customfunction
 */

function frostime(t,wind)
{
var ft;

if (wind> 100.1|| wind < 0.0)
    return 9999;
else if (t > -10.0 || t < -60.0)
    return 9999;
else{  
     ft=(((-24.5*((0.667*wind)+4.8)+2111)*(Math.pow((-t-4.8),-1.668)))/60);
    }
return OneDec(ft*60);
}

/**
 * Given air temperature (Celsius), relative humidity (%) and wind (m/s) velocity give Net effective Index  in Celsius degree.
 *
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */


function net_index(t,rh,wind)
{
    var net = 9999;
    if (rh > 100.1 || rh < 0.0)
       {return 9999}
    else if (wind > 130.0 || wind < 0.0)
       {return 9999}
    else if (t > 100.0 || t < -100.0)
       {return 9999}
    else
       {net = 37-((37-t)/(0.68-(0.0014*rh)+(1/(1.76+(1.4*(Math.pow(wind,0.75)))))))-(0.29*t*(1.0-(0.01*rh)))}
    return TwoDec(net);
}




/**
 * Given air temperature (Celsius), relative humidity (%) give Summer Simmer Index  in Celsius degree.
 *
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */

function ssi_index(t,rh)
{  
    var ssi = -9999;
    if (rh > 100.1 || rh < 0.0)
       {return ssi}
    else if (t > 100.0 || t < -100.0)
       {return ssi}
    else
       {ssi = ((1.98*((((9.0/5.0)*t)+32.0)-(0.55-0.0055*rh)*((((9.0/5.0)*t)+32.0)-58.0))-56.83)-32.0)/1.8}
    return  TwoDec(ssi);
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Pressure related functions.

/**
 * Given press air pressure in millibar, topo is altitude in meters and mean temperature of the air column calculate the local value of pressure
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function p_local(press,topo,temp)

{    var T0;
      if ( temp === undefined) { temp= 15.0};
     var temp=temp+273.15; // Formula isometrica di Laplace
     var L=-0.0065; // temperature lapse rate L = -0.0065 K/m
     var R_cost=287.05 ;//gas constant for dry air, J/(kg*degK) = 287.05
     var T0=temp-(L/2)*topo;// sea level standard temperature T0 = 288.15 K
     var p_local= press*Math.exp(-topo*9.81/(R_cost*T0));
     return p_local; 
 
 }


function pheight(press,topo)

{
  var pressalt;
  pressalt= press * Math.pow(1-(2.25577*(0.00001)*topo),5.25588);
  return(pressalt);
}

/**
 * Given t air temperature, rh relative humidity (%), p local air pressure give partial pressure of oxygen.
 *
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function poda(t,rh,p)
 {
  
  var poda;
  var  vpa = (rh / 100) * 6.105 * Math.pow(2.718281828, ( 17.27*t / ( 237.7 + t ) ));
  poda = 80.51 * p / (t + 273.15) * (1.0 - vpa / p);
  return poda;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Conversion related functions.


function mbtommHG(mb)
			{
				var mmHG;
				mmHG = 0.750062*mb;
				return mmHG;
			}




function torr2p(vp,vpunits)
{
    if (vpunits == "atm")
       {
       return vp/760.0; 
       }
    else if (vpunits == "bar")
       {
       return (vp / 760.0) * 1.013250;
       }
    else if (vpunits == "Pa")
       {
       return (vp / 760.0) * 101325.0;
       }
    else if (vpunits == "hPa")
       {
       return (vp / 760.0) * 1013.250;
       }
    else if (vpunits == "mbar")
       {
       return (vp / 760.0) * 1013.250; 
       }
    else if (vpunits == "psi")
       {
       return (vp/760.0) * 14.696;
       }
    else if (vpunits == "dyne/cm2")
       {
       return (vp/760.0) * 10132.5; 
       }
    else 
       {
       return vp;
       }
}
  

function mbtoinHG(mb)
			{
				var inHG;
				inHG = 0.0295300*mb;
				return inHG;
			}
			

function mbtokPA(mb)
			{
				var kPA;
				kPA = mb/10;
				return kPA;
			}
			
function mbtolbsinch(mb)
			{
				var lbsinch;
				lbsinch = 0.0145038*mb;
				return lbsinch;
			}
  
function mph2knots(mph)
{
	knots = 0.868391 * mph;
	return knots;
}

function mph2ms(mph)
{
	ms = 0.44704 * mph;
	return ms;
}

function mph2fts(mph)
{
	fts = 1.46667 * mph;
	return fts;
}

function mph2kmh(mph)
{
	kmh = 1.609344 * mph;
	return kmh;
}

function knots2mph(knots)
{
	mph = 1.15155 * knots;
	return mph;
}

function knots2ms(knots)
{
	ms = 0.514791 * knots;
	return ms;
}

function knots2fts(knots)
{
	fts = 1.68895 * knots;
	return fts;
}

function knots2kmh(knots)
{
	kmh = 1.85325 * knots;
	return kmh;
}

function ms2mph(ms)
{
	mph = 2.23694*ms;
	return mph;
}

function ms2knots(ms)
{
	knots = 1.94254 * ms;
	return knots;
}

function ms2fts(ms)
{
	fts = 3.28084 * ms;
	return fts;
}

function ms2kmh(ms)
{
	kmh = 3.6 * ms;
	return kmh
}

function fts2mph(fts)
{
	mph = 0.681818*fts;
	return mph;
}

function fts2knots(fts)
{
	knots =  0.592085 * fts;
	return knots;
}

function fts2ms(fts)
{
	ms =  0.3048 * fts;
	return ms;
}

function fts2kmh(fts)
{
	kmh = 1.09728 * fts;
	return kmh;
}

function kmh2mph(kmh)
{
	mph = 0.621371*kmh;
	return mph;
}

function kmh2knots(kmh)
{
	knots = 0.539593 * kmh;
	return knots;
}

function kmh2ms(kmh)
{
	ms = 0.277778 * kmh;
	return ms;
}

function kmh2fts(kmh)
{
	fts = 0.911344 * kmh;
	return fts;
}
  

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


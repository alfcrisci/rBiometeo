//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define global constants 

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

///////////////////////////////////////////////////////////////////////////////////////////
// format  

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

////////////////////////////////////////////////////////////////////////////////////////////
// math & trigonometric 

function radToDeg(angleRad) 
{
  return (180.0 * angleRad / Math.PI);
}

function degToRad(angleDeg) 
{
  return (Math.PI * angleDeg / 180.0);
}

function arrayMinIndex (array) {
  return array.indexOf(Math.min.apply(null, array));
};


function arrayMaxIndex (array) {
  return array.indexOf(Math.max.apply(null, array));
};


function linspace(x0, xN, dx){
  
    var n = Math.floor((xN - x0)/(dx));
    var x = [];
    for(var i =0; i < n; ++i){
        x.push(x0 + i*dx);
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
  * * "Applied Statistics Algorithms" (1985) vol 22 no.3 Algorithm AS66 P. Griffiths and I. D. Hill, editor 
*/


function pnorm(z,tail) {
    
    if( tail === undefined ) { tail = false;};
    
    z=parseFloat(z);
	
    var ltone= 7.0;
    var utzero= 18.66;
    con= 1.28;
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
    b10= 0.742380924027;
    b11= 30.789933034;
    b12= 3.99019417011;

    
   if(z<0) {
      tail=!tail;
      z=-z;
    }
    if(z<=ltone || tail && z<=utzero) {
      y=0.5*z*z;
      if(z>con) {
        alnorm=b1*Math.exp(-y)/(z-b2+b3/(z+b4+b5/(z-b6+b7/(z+b8-b9/(z+b10+b11/(z+b12))))));
      }
      else {
        alnorm=0.5-z*(a1-a2*y/(y+a3-a4/(y+a5+a6/(y+a7))));
      }
    }
    else {
      alnorm=0;
    }
    if(!tail) alnorm=1-alnorm;
      return(alnorm);
  }

// ALGORITHM AS 111, APPL.STATIST., VOL.26, 118-121, 1977.
// Computes z=invNorm(p)

function qnorm(p) {
    
    p=parseFloat(p);
    split=0.42;
    a0=  2.50662823884;
    a1=-18.61500062529;
    a2= 41.39119773534;
    a3=-25.44106049637;
    b1= -8.47351093090;
    b2= 23.08336743743;
    b3=-21.06224101826;
    b4=  3.13082909833;
    c0= -2.78718931138;
    c1= -2.29796479134;
    c2=  4.85014127135;
    c3=  2.32121276858;
    d1=  3.54388924762;
    d2=  1.63706781897;
    q=p-0.5;
    
    if(Math.abs(q)<=split) {
      r=q*q;
      ppnd=q*(((a3*r+a2)*r+a1)*r+a0)/((((b4*r+b3)*r+b2)*r+b1)*r+1);
    }
    else {
      r=p;
      if(q>0) r=1-p;
      if(r>0) {
        r=Math.sqrt(-Math.log(r));
        ppnd=(((c3*r+c2)*r+c1)*r+c0)/((d2*r+d1)*r+1);
        if(q<0) ppnd=-ppnd;
      }
      else {
        ppnd=0;
      }
    } 
    return(ppnd);
  }


/**
 * Wind reduction at specific height 
 * @param {number} x, ref, fin
 * @return {number}
 * 
 */

function reducewind(x,ref,fin) {  
                                        if( ref === undefined ) { tresh = 10;};
                                        if( fin === undefined ) { fin = 2;};
                                        return(x*1/(Math.log(ref/0.01)/Math.log(fin/0.01)));
                               }

/**
 * Compute error erf function
 * @param {number} x
 * @return {number}
 * 
 */

function erf(x) {  x=parseFloat(x); 
                   return(2 * pnorm(x * Math.sqrt(2)) - 1);
		}


/////////////////////////////////////////////////////////////////////////////////////////////////
// Date related 

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
 * @param {number} yr
 * @return {String}
 */


function isLeapYear(yr) 
{
  return ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0);
}

/**
 * Given a date, return the name of the day for that date.
 * @param {Date} date
 * @return {string}
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
// sun related  


function sun_data(strtime,lat,lon,parameter) 
   { 
    var datetime=new Date(strtime); 
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

/**
 * Given thoretical directed radiation of horizontal surface.
 * @param {number} jddate, az, elev, planezen, planeaz
 * @return {number}
 */

function radtheoric(jddate,elev,albedo,param)
{ 
  if( albedo === undefined ) { albedo = 0.3;};
  if( param === undefined ) { param  = "global";};
	
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

/**
 * Given thoretical directed radiation of tilted surface
 * @param {number} jddate, az, elev, planezen, planeaz
 * @return {number}
 */

function rad_direct_tilted(jddate,az,elev,planezen,planeaz) 
{
                            planezen=planezen/rad;
                            planeaz=planeaz/rad;
                            elev=elev/rad;
                            az=az/rad;
                            var rad_dir=radtheoric(jddate,elev,"direct");
                            var radinc=rad_dir *(Math.cos(elev)*Math.sin(planezen)*Math.cos(planeaz-az)+Math.sin(elev)*Math.cos(planezen));
                            return(rad_inc);
}

/**
 * Given sun elevation in degrees give value of projection factor.
 * @param {number} suneleve
 * @return {number}
 */

function proj(sunelev)
{
          if (sunelev < 0.0) {return 0.0};
          return 0.308 * Math.cos(rad * (sunelev* (0.998- (Math.pow(sunelev, 2.0) / 50000.0))));
}


/**
 * Given a temperature in celsius degree (degC), return the Fahrenheit degree value (degF).
 * @param {number} C
 * @return {number}
 */

function C2F(C) 
{
  if (typeof C !== 'number') {
                              throw TypeError('Celsius value must be a number');
                              }
  return (Math.round((C * 9) / 5 + 32,2));
}

/**
 * Given a temperature in Fahrenheit degree (degF), return  the celsius degree value (degF).
 * @param {number} F
 * @return {number}
 */

function F2C(F) 
{
  if (typeof F !== 'number') {
                             throw TypeError('Value must be a number');
                             }
 return(Math.round((5/9) * (F - 32),3));
}



/////////////////////////////////////////////////////////////////////////////////////////
//  wind  sector direction 

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
  

////////////////////////////////////////////////////////////////////////////////////////////////////
// radiant temperature  

/** 
 * Given t air temperature in degC, rh relative humidity (%), shortwave  directed beam short-wavelength radiation (W/mq)the sun elevation,albedo gives and surface emissivity provides 
 * an assessment of Mean Radiant Temperature.
 * @param {number} t, rh, wind, rshort, sunelev
 * @return {number}
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
 * Given mean radiant temperature t air temperature (degC), g Globe Temeperature in degC, wind speed in m/s and diameter in mm.
 * @param {number} t Air temperature , tg Globe Temeperature, wind speed and diameter. 
 * @return {number}
 */

function mrt_thorsson(t, tg, wind, diam)
{        if ( diam === undefined) {diam=0.15;} ;
         var emis_globe = 0.97;
         var stefanb = 0.0000000567;
         return Math.pow(Math.pow(tg + 273.15, 4) + ((1.335 * Math.pow(10,8) * Math.pow(wind,0.71)) /(emis_globe*Math.pow(diam,0.4))) * (tg - t), 0.25) - 273.15;
}







function fglob_sphere(Tglobe_prev,Tair,rh,speed,solar,zenith,pair,alb_sfc,fdir,diam)
                        {
                        if(zenith === undefined )   {zenith = 0.0000000001;};
                        if(zenith <= 0 )            { zenith = 0.0000000001;};
                        if(zenith > 1.57 )          { zenith = 1.57;};
                        if(pair === undefined )     { pair =1013.25;};
                        if(alb_sfc === undefined )  { alb_sfc = 0.4;};
                        if(fdir === undefined )     { fdir = 0.8;}; 
                        if(diam === undefined )     { diam = 0.05;}; 
                       
                        var cza,dT,Tref,h,Tglobe;
                        var speedmin = 0.13;  
                        var alb_globe = 0.05;
                        var emis_globe = 0.95;
                        var emis_sfc = 0.999;
                        var stefanb = 0.000000056696;
                        var Tsfc = Tair;
                        var RH=rh*0.01;  
                        var emis_air;
                        converge = 0.05;
                        
                        cza = Math.cos(zenith);
                         
                        Tref = 0.5 * (Tglobe_prev + Tair);
                          
                        h = h_sphere_in_air(Tref, speed, pair);
                          
                        Tglobe= Math.pow(0.5 * (emis_atm(Tair,RH) * Math.pow( Tair,4) + emis_sfc * Math.pow(Tsfc,4)) 
                                      - h / (emis_globe * stefanb) * (Tglobe_prev - Tair) 
                                      + solar / (2 * emis_globe * stefanb) * (1 - alb_globe) * (fdir * (1 / (2 * cza) - 1) + 1 + alb_sfc),0.25); 

                         dT = Math.abs(Tglobe - Tglobe_prev);
                     
                         return(dT);
                        }

/**
 * Given  tg globometric temperature in degC of sphere bounded respect air temperature. 
 * @param {number} t,rh,speed,solar,zenith,pair,alb_sfc,fdir,diam
 * @return {number}
 */

function tglob_sphere(t,rh,speed,solar,zenith,pair,alb_sfc,fdir,diam,maxair,minair,prec){
  
                         if( pair === undefined )     { pair =1013.25;};
                         if( alb_sfc === undefined )  { alb_sfc = 0.4;};
                         if( fdir === undefined )     { fdir = 0.8;}; 
                         if( diam === undefined )     { diam = 0.05;}; 
                         if( minair === undefined )     { minair = 2;}; 
                         if( maxair === undefined )     { maxair = 10;}; 
                         if( prec === undefined )     { prec = 0.01;}; 
  
                         if(solar > 15 &&  zenith > 1.54) {zenith = 1.54;}; 
	                 if(solar > 900 &&  zenith > 1.52) {zenith = 1.52;}; 
                   
  
                         var Tair = t + 273.15;
                         var map1=[];
                         var array1 = linspace(Tair-minair,Tair+maxair,prec);
                         for (var i = 0; i < array1.length; i++) {map1[i]=fglob_sphere(array1[i],Tair,rh,speed,solar,zenith,pair,alb_sfc,fdir,diam)}
                         return(array1[arrayMinIndex(map1)]-273.15);
                         }




/**
 * Given a air temperature t (Celsius degree), globe temperature (degC), wind speed in m per second and diam of globe in meters compute the mean radiant temperature (Celsius degrees) ;
 * @param {number} t, tg, wind, diam_glob
 * @return {number}
 */

function mrt_globe(t, tg, wind, diam_globe,emis_globe)

{        if ( diam_globe === undefined) {diam_globe = 0.05;} ; 
 
         if ( emis_globe === undefined) {emis_globe = 0.97;} ; 
 
         var stefanb = 0.0000000567;
 
         return Math.pow((Math.pow(tg + 273.15, 4) + ((1.1 * Math.pow(10,8) * Math.pow(wind,0.6)) /(emis_globe*Math.pow(diam_globe,0.4))) * (tg - t)), 0.25)- 273.15;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Psycrometrics related functions.


/**
 * Given air temperature (Celsius), relative humidity (%)  gives natural wetbulb in celsius degrees.
 * Formulation from Stull 2011, Journal of Applied Meteorology and Climatology.
 * @param {number} t,rh
 * @return {number}
 */

function wetbulb_stull(t,rh) 
{
     c = new Array(6);
     c[0] =0.151977;
     c[1] =8.313659;
     c[2] =1.676331;
     c[3] =0.00391838;
     c[4] =0.023101;
     c[5] =4.686035;
  
    var wetbulb = t * Math.atan(c[0] * Math.sqrt(rh + c[1])) 
                     + Math.atan(t + rh) - Math.atan(rh - c[2]) 
                     + c[3] * (Math.pow(rh,3/2)) * Math.atan(c[4] * rh) - c[5];
    return(wetbulb)
}





function fnatural_wetbulb(Twb_prev,Tair,rh,wspeed,solar,zenith,pair,alb_sfc,fdir,irad)
                        {
                       
                         if( alb_sfc === undefined ) {alb_sfc = 0.4;};
                         if( fdir === undefined ) { fdir = 0.8;}; 
                         if( irad === undefined ) {irad = 1;};
                              
                         var dT,Tref,h,Twb,Fatm,density,eair;
                         var speedmin = 0.13;  
                         var emis_sfc = 0.999;
                         var stefanb= 0.000000056696;
                           
                        /* heat capaticy of dry air at constant pressure */
                        
                         var cp=1003.5;
                         var m_air=28.97;
                         var m_h2o=18.015;
                         var r_gas=8314.34;
                         var r_air=r_gas / m_air;
                         var ratio=cp * m_air/ m_h2o;
                         var Pr=cp / (cp + (1.25 * r_air));
  
                        // Wick constants
                        
                        var emis_wick = 0.95;   // emissivity
                        var alb_wick = 0.4;    // albedo
                        var diam_wick = 0.007; // diameter (in m)
                        var len_wick = 0.0254; // length (in m)
  
                        // Globe constants
                        
                    
                        var Tsfc = Tair;
                        var RH=rh * 0.01;  
                        var emis_air= emis_atm(Tair,RH);
                            eair = RH * esat(Tair);   
                            Tref = 0.5 * (Twb_prev + Tair);
                          
                            // Radiative heating term	
                          
                            Fatm = stefanb * emis_wick * (0.5 * (emis_air * Math.pow(Tair, 4) 
                                   + emis_sfc * Math.pow(Tsfc, 4))  - Math.pow(Twb_prev, 4)) 
                                   + (1 - alb_wick) * solar * ((1 - fdir) * (1 + 0.25 * diam_wick / len_wick) 
                                   + ((Math.tan(zenith) / 3.1416) + 0.25 * diam_wick / len_wick) * fdir + alb_sfc);
    
                           // Schmidt number
                           
                           density = (pair * 100) / (Tair * r_air);
                       
                           var Sc = viscosity(Tair) / (density * diffusivity(Tref, pair));
                           
                           // Calculate the convective heat transfer coefficient for a long cylinder in cross flow
                          
                            h = h_cylinder_in_air(Twb_prev, wspeed, pair,speedmin, diam_wick);    
                          
                           // Calculate the saturation vapor pressure (hPa) over liquid water
                          
                            var ewick = esat(Twb_prev);
                           
                         
                           // Calculate the heat of evaporation, J/(kg K)
                            
                           var evap = h_evap(Twb_prev); 
                              
                          
                           Twb = Tair - (evap/ratio) * ((ewick - eair) / (pair - ewick)) * Math.pow((Pr / Sc),0.56) + Fatm / h * irad;
                           
                           dT = Twb - Twb_prev;
                               
                           return(Math.abs(dT));
                         }
                                  
function natural_wetbulb(t,rh,wspeed,solar,zenith,pair,alb_sfc,fdir,irad,maxair,minair,prec){
                        
                         if( zenith === undefined )    { zenith = 0.0000000001;};
                         if( zenith <= 0 )             { zenith = 0.0000000001;};
                         if( zenith > 1.57 )           { zenith = 1.57;};
                        
                         if ( wspeed === undefined )  { wspeed = 0.13};
                         if ( solar === undefined )   { solar = 0};
                         if ( minair === undefined )  { minair = 2;}; 
                         if ( maxair === undefined )  { maxair = 10;}; 
                         if ( pair === undefined )    { pair = 1010;};
                         if ( alb_sfc === undefined)  { alb_sfc = 0.4;};
                         if ( fdir === undefined )    { fdir = 0.8;}; 
                         if ( irad === undefined )    { irad = 1;};
                         if ( prec === undefined )    { prec = 0.1;};
                       
                         var Tair = t + 273.15;
                         var Twb_prev = dewpoint(t,rh) + 273.15;
                         var map1=[];
                         var array1 = linspace(Twb_prev-minair,Tair+maxair,prec);
                         for (var i = 0; i < array1.length; i++) {map1[i]=fnatural_wetbulb(array1[i],Tair,rh,wspeed,solar,zenith,pair)};
                         return(array1[arrayMinIndex(map1)]-273.15);
                         }




/**
 * Purpose: to calculate the convective h the heat tranfer coefficient for flow around a sphere. tk (Kelvin) 
 * and air pressure in millibar(hPA).
 * Reference; BSL, page 23.;
 * @param {number} t, speed,pair,speedmin,diam_globe;
 * @return {number}
 */
                             
function h_sphere_in_air(tk,speed,pair,speedmin,diam_globe)
    {
       if( diam_globe === undefined ) {diam_globe=0.05;};
       if( speedmin === undefined ) {speedmin=0.13;};
       if( pair === undefined ) {pair=1013.25;};
       var Rair = 8314.34 / 28.97;
       var Pr = 1003.5 / (1003.5 + 1.25 * Rair);
       var thermal_con = (1003.5 + 1.25 * 8314.34 / 28.97) * viscosity(tk);
       var density = (pair * 100) / (Rair * tk);  // kg/m3;
       if  (speed < speedmin ) {speed = speedmin};
       var Re = (speed * density * diam_globe)/ viscosity(tk);
       var Nu = 2 + 0.6 * Math.pow(Re,0.5) * Math.pow(Pr, 0.3333);
       return (Nu * thermal_con)/ diam_globe; // W/(m2 K);
   }


 /**
 * Purpose: to calculate the convective heat tranfer coefficient for heat flow around a cylinder tk in degK
 * and air pressure in millibar(hPa).
 * Reference : Bird, Stewart, && Lightfoot (BSL), page 409.;
 * @param {number} t, speed,pair,speedmin,diam_globe;
 * @return {number}
 */ 
    
function h_cylinder_in_air(tk,speed,pair,speedmin,diam_wick){
   
   if( diam_wick === undefined ) { diam_wick=0.007;};
   if( speedmin === undefined )  { speedmin=0.13;};
   if( pair === undefined )      { pair=1010;};
           
   var m_air = 28.97;
   var r_gas = 8314.34;
   var r_air = r_gas / m_air;
   var cp = 1003.5; // heat capaticy at constant pressure of dry air
   var Pr = cp / (cp + (1.25 * r_air));
  
  // Calculate the thermal conductivity of air, W/(m K)
  
  var thermal_con = (cp + 1.25 * r_gas / m_air) * viscosity(tk);
                                   
  // Density of the air
  
  var density = (pair * 100) / (r_air * tk);
  
  if (speed < speedmin) {speed = speedmin};
  
  // Reynolds number
  
  var Re = speed * density * diam_wick / viscosity(tk);
  
  //  Nusselt number
  
  var Nu = 0.281 * Math.pow(Re,0.6) * Math.pow(Pr, 0.44);
  
  // Convective heat transfer coefficient in W/(m2 K) for a long cylinder in cross flow
  var h_cylinder_in_air = Nu * thermal_con / diam_wick ; 
  
  return(h_cylinder_in_air);
}





                             
/**
 * Given a air temperature tk (kelvin) calculate the heat of evaporation.
 * Purpose: to calculate the convective heat tranfer coefficient for flow around a sphere.; t in K
 * Reference : Bird, Stewart, && Lightfoot (BSL), page 409.;

 * @param {number} tk
 * @return {number}
 */

function h_evap(tk){
   var evap = ((313.15 - tk) / 30 )* (-71100) + 2407300;
  return(evap);
}


/**
 * Given a air emissivity by using temperature in kelvin and relative umidity ( number)
 * Purpose: to calculate the convective heat tranfer coefficient for flow around a sphere.; t in K
 * Reference; Oke (2nd edition), page 373.;
 * @param {number} tk,rh
 * @return {number}
 */

function emis_atm(tk,rh)
{

                  var e = rh * esat(tk);
                  return(0.575 * Math.pow(e,0.143));
}                             
 
 /**
 * Calculate the saturation vapor pressure (mb) over liquid water given the temperature (degK).;
 * Reference Buck's (1981) approximation (eqn 3) of Wexler's (1976) formulae.;
 * @param {number} tk
 * @return {number}

 */  

function esat (tk) 
{
                  var esat= 1.004 *(6.1121 * Math.exp(17.502 * (tk - 273.15) / (tk - 32.18)));
                  return(esat);  
}

/**
 * Given a air temperature tk (degK) compute the viscosity of air in kg/(m s).
 * Reference; BSL, page 23.;
 * @param {number} tk
 * @return {number}
 */

              
function viscosity(tk)
{

                       var omega = (tk / 97 - 2.9) / 0.4 * (-0.034) + 1.048;
                       return 0.0000026693 * Math.pow(28.97 * tk,0.5) / (3.617 * 3.617 * omega );
}



/**
 * Given a air temperature tk (Kelvin) and air pressure in millibar (hPa) compute the heat diffusivity in air.
 * Reference; BSL, page 23.;
 * @param {number} t
 * @return {number}
 */

function diffusivity(tk, pair) {
  
   if( pair === undefined ) {pair=1013.25;};
  
  var pcrit13 = Math.pow(36.4 * 218, 1 / 3);
  var tcrit512 = Math.pow(132 * 647.3,(5 / 12));
  var Tcrit12 = Math.pow((132 * 647.3), 0.5);
  var Mmix = Math.pow((1 / 28.97 + 1 / 18.015),0.5);
  var diffusivity = 0.000364 * Math.pow((tk / Tcrit12),2.334) * pcrit13 * tcrit512 * Mmix / (pair / 1013.25) * 0.0001;
 return(diffusivity);
}

function fRH(t,td)
			{
				var rh;
				rh = 100*(es(td)/ es(t));
				return rh;
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


/**
 * Given air temperature (Celsius) gives  saturation  pressure in hPa.
 *  @param {number} t,rh
 * @return {number
 */

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



/**
 * Given air temperature (Celsius), relative humidity (%).
 * @param {number} t,rh
 * @return {number}
 */

function pvap(t,rh)
			{
				var E;
				E = es(t) * (rh/100);
				return E;
			}





/**
 *  Given a air temperature t (degC) and air relative humidity  (rh)  and formula give the dew-point in degC.
 *  @param {number} t,rh,formula
 *  @return {number}
 */

function dewpoint(t,rh,formula) {
         if (formula == undefined) {formula == "NOAA"}
         var RHD = rh / 100;
         if (formula == "Paroscientific") 
             {return 237.3 * (Math.log(RHD) / 17.27 + t / (237.3 + t)) / (1 - Math.log(RHD) / 17.27 - t / (237.3 + t));}
         else if  (formula == "Sonntag") 
             {return 243.12 * (Math.log(RHD) / 17.62 + t / (243.12 + t)) / (1 - Math.log(RHD) / 17.62 - t / (243.12 + t));}
         else 
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
 */

function spvol(ta,hum_ratio,pa) 
{
	var t, y;
	t=ta+273.16;
	y=(287.055*t*(1+1.6078*hum_ratio))/(pa*100.0);
	return (y);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////////////////////////////////////
// thermal Confort index section

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
  
 
/**
 * Given antropometric features ( body mass,age, height and gender) give custom basal metabolic rate/
 * request for a day Harris Benedict Equation (cal/day) 
 * kJ and divided for daily seconds Watt but already normalized for Adu.
 * @param {number} mbody,age,ht,gender
 * @return {number}
 * @customfunction
 */
function HB_bmr_met(mbody,age,ht,gender) 
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
 * Given a temperature t (degC), relative humidity rh (%), wind ( m/sec), mean radiant temperature mtrad ( degC) 
 * and clothing insulation (clo) 
 * gives PMV following Hoppe scheme for a customized person.
 * @param {number} ta
 * @return {number} 
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


/**
 * Given a temperature t (Celsius), relative humidity rh (%), wind ( m/sec), mean radiant temperature tr (degC), M metabolism, W work
 * and clothing insulation (clo) gives perceived_temperature following the PMV scheme.
 * @param {number} t,rh,wind,tr,M,W,clo
 * @return {number} 
 * @customfunction
 */

function perceived_temperature(t,rh,wind,tr,M,W,clo) 
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

    
  
/**
 * Given a temperature t (Celsius), relative humidity rh (%), wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work ( generally 0),
 * and clothing insulation (clo) gives perceived PMV (Predicted Mean Vote) for moderate thermal environements following ISO 7730.
 * @param {number} ta
 * @return {number} 
 * @customfunction
 */

function PMV_ISO7730(t,rh,wind,trad,M,W,clo) 
    {
     
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
    hl4 = 0.0014 * M * (34 - t);
    // heat loss by radiation  R
    hl5 = 3.96 * fcl * (Math.pow(xn, 4) - Math.pow(tra / 100, 4));
    // heat loss by convection C
    hl6 = fcl * hc * (tcl - ta);

    ts = 0.303 * Math.exp(-0.036 * M) + 0.028;
  
    pmv = ts * (mw - hl1 - hl2 - hl3 - hl4 - hl5 - hl6);
  
   
    return(TwoDec(pmv));
}


 /**
 * Given a temperature t (Celsius), relative humidity rh (%), wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work ( generally 0),
 * and clothing insulation (clo) gives perceived HSI (Heat Strain Index) or AET or Sweat rate indexes.
 * Reference Introduction to Human Factors and Ergonomics for Engineers , authors Mark R. Lehto, Steven J. Landry and Jim Buck
 * @param {number} ta
 * @return {number} 
 */

function HSI_index(t,rh,wind,trad,M,W,clo,param) 
    {
    
    if( param === undefined ) { param = "HSI";};
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

        
/**
 * Maximal clothing level by using ISO 7730 PMV given temperature t (degC), relative humidity rh (%), 
 * wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work (generally 0),
 * @param {number} t, rh, wind, trad, M, W
 * @return {number}
 */

        
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
 * Minimal clothing level by using ISO 7730 PMV given temperature t (degC), relative humidity rh (%), 
 * wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work (generally 0),
 * @param {number} t,rh,wind,trad,M,W
 * @return {number}
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

/**
 * Maximal clothing level by using ISO 7730 PMV given temperature t (degC), relative humidity rh (%), 
 * wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work (generally 0) 
 * imposing customized parameter as mbody body weight in kg, heigth in meters and gender ( "male" or "female").
 * @param {number} t,rh,wind,trad,M,W
 * @return {number}
 */

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
 * Minimal clothing level by using ISO 7730 PMV given temperature t (degC), relative humidity rh (%), 
 * wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work (generally 0) 
 * imposing customized parameter as mbody body weight in kg, heigth in meters and gender ( "male" or "female").
 * @param {number} t,rh,wind,trad,M,W
 * @return {number}
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
 * Given Standard Effective Index  given temperature t (degC), relative humidity rh (%), 
 * wind ( m/sec), mean radiant temperature trad (degC), M metabolism (met) , W external work and patm air pressure in hPa.
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

    // initial estimate of Tcl
  
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
 * Given rh relative humidity (%), wind windspeed (m/s) , MA as Metabolism ( W/mq), clo as mean clothing insulation value in clo
 * and the timing in hours H  gives the optimal temperature of thermal comfort.
 * @param {number} t,rh 
 * @return {number}
 */


function ta_comfort(rh, wind,M,clo,H)
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
 * Given Ambient Air Temperature (< +10 Celsius deg ), relative humidity rh (%), wind relative air velocity wind ( 0.4 to 18 m/s)
 * trad Mean radiant temperature (Celsius Deg), M as Metabolic energy production (58 to 400 W/m2), W rate of mechanical work W ( normally 0 W/m2),
 * AVAILABLE basic clothing insulation clo ( clo = 0.155 W/m2K), Air clothing ensemble permeability p (low < 5, medium 50, high > 100 l/m2s) 
 * give a Recovery Time Index in minutes ISO 11079. 
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
 *  Given air temperature (Celsius), relative humidity (%), wind speed (m/sec) and mean radiant temperature ( tmrt in degC) 
 *  gives the Universal Thermal Climate Index in Celsius.
 *  @param {number} t,rh,wind,tmrt
 *  @return {number}
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

function steadman_outdoor(t,rh,wind,solar,sunelev)
{    
  var steadman_outdoor_sun=9999;
  if (rh > 100.1 || rh < 0.0) {return 9999};
  if (t > 100.0 || t < -100.0) {return 9999};
  if (solar < 50) { return(steadman_outdoor_shade(t,rh,wind))}
  else {
    var ee = (rh/1000.0)*(6.105*Math.exp((t*17.27)/(237.7+t)));
    var q_glob = 0.56*(0.386-(0.0032*sunelev))*solar + 0.224*(0.1*solar)+ 0.028*solar- 150.0*(0.38-0.16*(Math.pow(ee,0.5))); 
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
    
    steadman_outdoor_shade = 9999;
    
    if (rh > 100.1 || rh < 0.0)
        {return 9999}
    else if (wind > 130.0 || wind < 0.0)
        {return 9999}
    else if (t > 100.0 || t < -100.0)
         {return 9999}
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
 * Given air temperature (Celsius), relative humidity (%)  gives Temperature Humidity Index discomfort index. Giles (1990)
 *
 * @param {number} t,rh,wind
 * @return {number}
 * @customfunction
 */

function THI(t,rh) 
         {
          var thi;
          thi = t-0.55*(1-0.01*rh)*(t-14.5);
          return thi;
}


/**
 * Given air temperature (Celsius), relative humidity (%)  gives Temperature Humidity Index discomfort index. kliber (1964) Kliber H. H., 1964. Environmental physiology and shelter engineering. LXVII. 
 * Thermal effects of various temperature-humidity combinations on Holstein cattle as measured by physiological responses. Res. Bull. Missouri Agric. Exp. Station: 862.
 *
 * @param {number} t,rh,wind
 * @return {number}
 * @customfunction
 */

function THI_kliber(t,rh) 
         {
          var thi;
          thi = (1.8*t-(1-0.01*rh)*(t-14.3))+32;
          return thi;
}


/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  Oxford index (WD).
 *
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function oxford_index(t,rh,wind,pair)  
         {
          var ox;
          if ( pair === undefined) {pair=1010};
	  if ( wind === undefined) {wind=0.13};
        
          var tw = natural_wetbulb(t,rh,wind,0,0,pair);
          
          ox = 0.85*tw+0.15*t;
          return ox;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%)and gives  Discomfort index (DI). 
 * @param {number} t,rh 
 * @return {number}
 */

function discomfort_index(t,rh,wind,pair)   
         {
          var disc;
          if ( pair === undefined) {pair=1010};
	  if ( wind === undefined) {wind=0.13};
        
          var tw = natural_wetbulb(t,rh,wind,0,0,pair);
          disc = 0.5*tw+0.5*t;
          return disc;
}


/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives Fighter index of thermal stress (FITS). 
 * @param {number} t,rh 
 * @return {number}
 */

function fits_index(t,rh,wind,pair) 
         {
          var fits; 
	  if ( pair === undefined) {pair=1010};
	  if ( wind === undefined) {wind=0.13};
        
          var tw = natural_wetbulb(t,rh,wind,0,0,pair);
	
          fits = 0.83*tw+0.35*t+5.08
          return fits;
}


/**
 * lost_productivity is a function to estimate population heat exposure and impacts on working people
 * @param {number} wbgt,tresh
 * @return {number}
 * Estimating population heat exposure and impacts on working people in conjunction with climate change
 * Tord Kjellstrom  & Chris Freyberg & Bruno Lemke & Matthias Otto & David Briggs
 * Int J Biometeorol (2018) 62:291-306 DOI 10.1007/s00484-017-1407-0
*/

function lost_productivity(wbgt,tresh) {  
                                        if( tresh === undefined ) { tresh = 33.5;};
                                        return(0.5*(1+ erf((wbgt-tresh)/(3.75*Math.sqrt(2))))*100)
}

/**
 * Given body mass index  by using antropometric features. 
 * @param {number} h,w
 * @return {number}
 * @customfunction
 */

function BMW(h,w) 
         {return(w/(Math.pow((h/100),2)));} 

/**
 * Given body surface area by using antropometric features height and weigth. 
 * @param {number} h,w
 * @return {number}
 * @customfunction
 */


function BSA(h,w) 
         { return( Math.pow(h/100,0.725)*(0.20247*(Math.pow(w,0.425)))); }    

  
/**
 * Given met rate level by using clothing iso level and BSA.
 * @param {number} BSA, isolevel
 * @return {number}
 */


function met_rate(BSA, isolevel) {
  
   if ( isolevel === undefined) {isolevel = 1 };
  
  return(BSA*(isolevel*50));
}



/**
 * Given met and clo level gives acclimated threshold of risk by using wbgt index. 
 * @param {number} met, clolevel
 * @return {number}
 */

function rel_acclimatized(met,clolevel) {
  
     if ( clolevel === undefined) {isolevel = 1 };
  
     return(56.7-(11.5*getBaseLog(10,met))-clolevel);
}


/**
 * Given met and clo level gives unacclimated threshold of risk by using wbgt index. 
 * @param {number} met,clolevel
 * @return {number}
 */

function ral_unacclimatized(met,clolevel) {
  
     if ( clolevel === undefined) {isolevel = 1 };
  
     return(59.9-(14.1*getBaseLog(10,met))-clolevel);
}



          
          
/**
 * Given  WBGT returns heat risk level in italian language by using a treshshold.
 * @param {number} wbgt,tresh
 * @return {number}
 */

function heat_risk_text_level(wbgt,tresh)  { 
                                               if ( tresh === undefined) {tresh = 28.5 };
                                               var risk =wbgt/tresh;
                                               var level_list=["NON SIGNIFICATIVO","BASSO","MODERATO","ALTO"];  
                                               var class;
                                               if    ( risk <= 0.8)        {  class = 1;} 
                                                     else if (risk <= 1)   {  class = 2;} 
                                                     else if (risk <= 1.2) {  class = 3;} 
                                                     else                  {  class = 4};
                                              
                                               return(level_list[class]);           
                                              }

/**
 * Given  WBGT returns heat risk level in english language by using a treshshold.
 * @param {number} wbgt,tresh
 * @return {number}
 */

function heat_risk_text_level_eng(wbgt,tresh)  { 
                                               if ( tresh === undefined) {tresh = 28.5 };
                                               var risk =wbgt/tresh;
                                               var level_list=["NOT SIGNIFICANT","LOW","MODERATE","HIGH"];  
                                               var class;
                                               if    ( risk <= 0.8)        {  class = 1;} 
                                                     else if (risk <= 1)   {  class = 2;} 
                                                     else if (risk <= 1.2) {  class = 3;} 
                                                     else                  {  class = 4};
                                              
                                               return(level_list[class]);           
                                              }

/**
 * Given  WBGT returns heat risk level as color code.
 * https://www.rapidtables.com/convert/color/hex-to-rgb.html
 * RISCHIO = 80% NESSUN RISCHIO (GREEN) rgb(0,255,0)
 * 80% < RISCHIO = 100% ATTENZIONE (YELLOW) rgb(255,255,0)
 * 100% < RISCHIO = 120% ALLARME (ORANGE) rgb(255,165,0)
 * RISCHIO > 120% EMERGENZA (RED) rgb(255,0,0)
 * @param {number} wbgt,tresh
 * @return {text}
 */
        
  

function heat_risk_color_level(wbgt,tresh)  { 
                                               if ( tresh === undefined) {tresh = 28.5 };
                                               var risk =wbgt/tresh;
                                               var colorcode_list=["green","yellow","orange","red"]; 
                                                  var class;
                                               if    ( risk <= 0.8)        {  class = 1;} 
                                                     else if (risk <= 1)   {  class = 2;} 
                                                     else if (risk <= 1.2) {  class = 3;} 
                                                     else                  {  class = 4};
                                               return(colorcode_list[class]);           
                                              }

/**
 *  Given  WBGT returns heat risk level as color code in hex format. 
 *  @param {number} wbgt,tresh
 *  RISCHIO = 80% NESSUN RISCHIO (GREEN) rgb(0,255,0) level 1 
 *  80% < RISCHIO = 100% ATTENZIONE (YELLOW) rgb(255,255,0) level 2 
 *  100% < RISCHIO = 120% ALLARME (ORANGE) rgb(255,165,0) level 3 
 *  RISCHIO > 120% EMERGENZA (RED) rgb(255,0,0) level 4 
 *  @return {text}
 */

function heat_risk_hexrgb_level(wbgt,tresh) { 
                                               if ( tresh === undefined) {tresh = 28.5 };
                                               var risk= wbgt/tresh;
                                               var colorcode_hex=["#00ff00","#ffff00","#ffa500","#ff0000"];
                                               var class;
                                   
                                               if    ( risk <= 0.8)        {  class = 1;} 
                                                     else if (risk <= 1)   {  class = 2;} 
                                                     else if (risk <= 1.2) {  class = 3;} 
                                                     else                  {  class = 4};


                                               return(colorcode_hex[class]);           
                                              }

/**
 *  Given WBGT returns heat risk level value. 
 *  @param {number} wbgt,tresh
 *  @return {number}
 */

function heat_risk_index_level(wbgt,tresh)    { 
                                               if ( tresh === undefined) {tresh = 28.5 };
                                               var risk =(wbgt/tresh)*100;
                                               return(risk);        
                                              }
/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  Wet-Bulb Dry Temperature (WBDT). 
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function wbdt(t,rh,pair) 
         {
          if ( pair === undefined) { pair==1010};	 
          var wbdt;
          var tw = natural_wetbulb(t,rh,0,0,pair);
	  wbdt = 0.4*tw+0.6*t;
          return wbdt;
}


/**
 *  Given t air temperature (Celsius degrees), rh relative humidity (%) , wind speed in m per second, 
 *  solar global radiation in  Watt/mq, tg globometric temperature gives, solar zenith in radians,  
 *  pair Air Pressure in millibar (hPa),alb_sfc mean albedo surface, fdir is the ratio between diffuse and directed radiation, 
 *  irad is 1 if the radiation is computed, diam is the diameter of heat globe, maxair and minair are the range respect to air temperature 
 *  to search solution and prec is the precision.
 * 
 * Wet-bulb globe temperature (WBGT) index following Liljegren scheme . 
 * @param {number} t,rh,wind,solar,zenith,pair,alb_sfc,fdir,irad,diam,maxair,minair,prec
 * @return {number} 
 */

function wbgt_sun(t,rh,wind,solar,zenith,pair,alb_sfc,fdir,irad,diam,maxair,minair,prec) 
         {
          var wbgt;
          if( pair === undefined ) {pair = 1010;};
          if( alb_sfc === undefined ) {alb_sfc = 0.4;};
          if( fdir === undefined ) { fdir = 0.8;}; 
          if( irad === undefined ) {irad = 1;};
          if( diam === undefined ) {diam=0.05;};
	  if( maxair === undefined ) {maxair=10;};
          if( minair === undefined ) {minair=2;};
          if( prec === undefined ) {prec=0.01;};
          
          var tg= tglob_sphere(t,rh,wind,solar,zenith,pair,maxair,minair,alb_sfc,fdir,diam,prec);
          var tw = natural_wetbulb(t,rh,wind,solar,zenith,pair,alb_sfc,fdir,irad,prec);
	  	 
          wbgt = 0.7*tw+0.2*tg+0.1*t;
	  if( solar === undefined  && zenith === undefined ) {wbgt = 0.7*tw+0.3*t;};
          	 
          return wbgt;
}

/**
 *  Given t air temperature (Celsius degrees), rh relative humidity (%) , wind speed in m per second, 
 *  pair Air Pressure in millibar (hPa),alb_sfc mean albedo surface, fdir is the ratio between diffuse and directed radiation, 
 *  irad is 1 if the radiation is computed, diam is the diameter of heat globe, maxair and minair are the range respect to air temperature 
 *  to search solution and prec is the precision.
 */

function wbgt_shade(t,rh,wind,pair,alb_sfc,fdir,diam,prec) 
         {
          var wbgt;
          if( pair === undefined )    {pair = 1010;};
          if( alb_sfc === undefined ) {alb_sfc = 0.4;};
          if( fdir === undefined )    {fdir = 0.8;}; 
          if( diam === undefined )    {diam=0.05;};
          if( prec=== undefined )     {diam=0.1;};
          var tw = natural_wetbulb(t,rh,wind,0.001,0.0001,pair,alb_sfc,fdir,1,prec);
          wbgt = 0.7*tw+0.3*t;
          return wbgt;
}

/**
 * Given t air temperature (Celsius), rh relative humidity (%) and Tg globometric temperature gives  Wet-bulb globe temperature  index (WBGT). 
 * @param {number} t,rh,tg
 * @return {number}
 */

function wbgt_stull(t,rh,tg) 
              {
              var wbgt;
              var tw = wetbulb_stull(t,rh)
              wbgt = 0.7*tw+0.2*tg+0.1*t;
              return wbgt;
           }

/**
 * Given t air temperature (Celsius), rh relative humidity (%)  gives  Wet-bulb globe temperature (WBGT) index indoor. Bernard Integration for wind. 
 * @param {number} t,rh 
 * Bernard TE, Pourmoghani M (1999)  "Prediction of Workplace Wet Bulb Global Temperature."  Applied Occupational and Environmental Hygiene 14: 126-134
 * Ramsey JD, Bernard TE (2000) Heat Stress in R Harris (ed) Patty's Industrial Hygiene and Toxicology vol 2 New York: John Wiley & Sons 
 * @return {number} t,rh,wind,pair,elev
 * @customfunction
 */

function wbgt_indoor(t,rh,wind,pair,elev) 
         {
          if ( wind === undefined) {wind=0.13};
          if ( pair === undefined) {pair=1010};
          if ( elev === undefined) {elev=0};
          
          var wbgt;
          var pair=pheight(pair,elev);
          var tw = natural_wetbulb(t,rh,wind,0,0,pair);
	      wbgt= 0.67*tw+0.33*t-0.048 *Math.log(wind)*(t-tw);
          if ( wind < 1.1) { wbgt= 0.04*t + 0.96*tw};
          return wbgt;
}



/**
 * Given t air temperature (Celsius), rh relative humidity (%) gives Modified discomfort index (MDI). 
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function mdi_index(t,rh,wind,pair)    
         {
	  if ( pair === undefined) {pair=1010};
	  if ( wind === undefined) {wind=0.13};
       
          var mdi;
          var tw = natural_wetbulb(t,rh,wind,0,0,pair);
	  mdi = 0.7 * tw + 0.3 * t;
          return mdi; 
}




/**
 * Given t air temperature (degC), rh relative humidity (%) and air pressure  (hPa) gives the thom discomfort index. 
 * @param {number} t,rh 
 * @return {number}
 */


function thom(t,rh,pair,wind) 
         {
          var thom;
	  if ( pair === undefined) {pair=1010};
          if ( wind === undefined) {wind=0.13};
          var tw = natural_wetbulb(t,rh,wind,0,0,pair);
          thom = 0.4 * (t + tw) + 4.8;
          return thom;
}

/**
 * Given Ambient Air Temperature (< +10 Celsius) and relative air velocity wind ( 0.4 to 18 m/s)
 * give a windchill index - ISO11079. 
 * Reference: http://www.eat.lth.se/fileadmin/eat/Termisk_miljoe/IREQ2009ver4_2.html
 * @param {number} t,wind
 * @return {number}
 */

function windchill(t,wind) 
        { if (wind === undefined ) ( wind=1.3);
          if (wind < 1.3) ( wind=1.3);
	      wind=(3.6)*wind;
	      var twc = 13.12 + 0.6215 * t-11.37 * Math.pow(wind,0.16) +0.3965 * t* Math.pow(wind,0.16);
	      return(twc);
        }



/**
 * Given Ambient Air Temperature t (< +10 Celsius) and relative air velocity wind ( 0.4 to 18 m/s)
 * give a windchill index - ISO11079 in watt on mq. 
 * Reference: http://www.eat.lth.se/fileadmin/eat/Termisk_miljoe/IREQ2009ver4_2.html
 * @param {number} t,wind
 * @return {number}
 */

function wc_watt2mq (t, wind)
			{
			 if (wind < 0.4) ( wind=0.4);
	                 var Watts = (12.1452 + 11.6222*Math.sqrt(wind) - 1.16222 * wind)*(33 - t);
			 return Watts;

			}




/**
 * Given a temperature t (degC ) and wind ( m/sec) frost time following Wind chill class .
 * @param {number} t,wind
 * @return {number} 
 */

function windchill_cla(t,wind)
{    if (wind === undefined ) ( wind=1.3);
     if (wind < 1.3) ( wind=1.3);
	      
     var wcla;
     var wcindex=windchill(t,wind);  
     if (wcindex > 0 ) {return 1;}
     else if (wcindex > -10.0) {return 2;}
     else if (wcindex > -28.0) {return 3;}
     else if (wcindex > -40.0) {return 4;}
     else if (wcindex > -48.0) {return 5;}
     else if (wcindex > -54.0) {return 6;}
     else { return 7;};
}


/**
 * Given a temperature t (degC ) and wind ( m/sec) frost time following Wind chill chart.
 * @param {number} t
 * @return {number} 
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
 * Given air temperature (degC), relative humidity (%) and wind (m/s) velocity give Net effective Index  in degC.
@param {number} t,rh
 * @return {number}
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
 * Given air temperature (Celsius), relative humidity (%) give Summer Simmer Index  in degC.
 *
 * @param {number} t,rh
 * @return {number}
 */

function ssi_index(t,rh)
{  
    var ssi = 9999;
    if (rh > 100.1 || rh < 0.0)
       {return ssi}
    else if (t > 100.0 || t < -100.0)
       {return ssi}
    else
       {ssi = ((1.98*((((9.0/5.0)*t)+32.0)-(0.55-0.0055*rh)*((((9.0/5.0)*t)+32.0)-58.0))-56.83)-32.0)/1.8}
    return  TwoDec(ssi);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Pressure 




/**
 * Given press air pressure in millibar, topo is altitude in meters 
 * and mean temperature of the air column calculate the local value of pressure
 * @param {number} t,rh 
 * @return {number}
 * @customfunction */

function p_local(press,topo,temp)

{    var T0;
     if ( temp === undefined) { temp= 15.0};
     var temp=temp+273.15;        // Formula isometrica di Laplace
     var L=-0.0065;               // temperature lapse rate L = -0.0065 K/m
     var R_cost=287.05 ;          // gas constant for dry air, J/(kg*degK) = 287.05
     var T0=temp-(L/2)*topo;      // sea level standard temperature T0 = 288.15 K
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
 * @param {number} t,rh,g
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

/**
 * Given air temperature (Celsius) calculates Saturated Vapor Pressure (Torr) at Temperature T  (C) .
 * @param {number} T
 * @return {number}
 */
	
  
function vpaTorr(t) {
    
                     return Math.exp(18.6686 - 4030.183 / (t + 235.0));
}


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


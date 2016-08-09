// Define constants for functions.

var    Patm = 101325.0;
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

var SurfAlbedo = 0.4
var stefanb = 0.000000056696
var diamGlobe = 0.05 // 0.05 = 50mm diam globe
var diamWick = 0.007
var lenWick = 0.0254
var propDirect = 0.8  // Assume a proportion of direct radiation = direct/(diffuse + direct)
var ZenithAngle = 0  // Angle of sun from directly above
var MinWindSpeed = 0.1   // 0 wind speed upsets log function
var AtmPressure = 101  // Atmospheric pressure in kPa

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Notation related functions.

function OneDec(c) {
    return Math.round(10 * c) / 10
}

function TwoDec(c) {
    return Math.round(100 * c) / 100
}

function ThreeDec(c) {
    return Math.round(1000 * c) / 1000
}

function scientificNotation(c, e) {
    return c.toPrecision(e)
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

function solve(f,y,x0) {
  var x = x0;
  var maxCount = 10;
  var count = 0;
  do {
    var xNew;
    var dx = x/1000; 
    var z=f(x);
    xNew = x + dx*(y-z)/(f(x+dx)-z);
    if (Math.abs((xNew-x)/xNew)<0.0001) 
      return xNew;
    else if (count>maxCount) {
      xnew=NaN; 
      throw new Error(1, "Solver does not converge.");
      break; 
    }
    x = xNew;
    count ++;
  } while (true);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Date related functions.

Date.prototype.getJulian = function() {
    return Math.floor((this / 86400000) - (this.getTimezoneOffset()/1440) + 2440587.5);
}


Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};


Date.prototype.getDOY = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};


function getDOY(datetime) {

  return(datetime.getDOY())
}

function toJulian(date) { return date.valueOf() / (1000 *60*60 * 24) -0.5 + J1970; };  // è il calcolo JD corretto.

function fromJulian(j)  { return new Date((j + 0.5 - J1970) * (1000 *60*60 * 24)); }; 

function toDays(date)   { return toJulian(date) - J2000; };

function parseISO8601String(dateString) {
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



function isLeapYear(yr) 
{
  return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
}

/**
 * Given a date, return the name of the day for that date.
 *
 * @param {Date} date
 * @return {String}
 * @customfunction
 */

function DAYNAME(date) {
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

function sun_data(datetime,lat,lon,parameter) {
    udtTimedHours = datetime.getHours() - 0;
    udtTimedMinutes =datetime.getMinutes() - 0;
    udtTimedSeconds = datetime.getSeconds() - 0;
    udtLocationdLongitude = lon - 0;
    udtLocationdLatitude = lat - 0;
    dEarthMeanRadius = 6371.01;
    dAstronomicalUnit = 149597890;
    dDecimalHours = udtTimedHours + (udtTimedMinutes + udtTimedSeconds / 60) / 60;
    dJulianDate = datetime.valueOf() / (1000 *60*60 * 24) -0.5  + J1970;
    dElapsedJulianDays = dJulianDate - 2451545;
    dOmega = 2.1429 - 0.0010394594 * dElapsedJulianDays;
    dMeanLongitude = 4.895063 + 0.017202791698 * dElapsedJulianDays;
    dMeanAnomaly = 6.24006 + 0.0172019699 * dElapsedJulianDays;
    dEclipticLongitude = dMeanLongitude + 0.03341607 * Math.sin(dMeanAnomaly) + 3.4894E-4 * Math.sin(2 * dMeanAnomaly) - 1.134E-4 - 2.03E-5 * Math.sin(dOmega);
    dEclipticObliquity = 0.4090928 - 6.214E-9 * dElapsedJulianDays + 3.96E-5 * Math.cos(dOmega);
    dSin_EclipticLongitude = Math.sin(dEclipticLongitude);
    dY = Math.cos(dEclipticObliquity) * dSin_EclipticLongitude;
    dX = Math.cos(dEclipticLongitude);
    dRightAscension = Math.atan2(dY, dX);
    0 > dRightAscension && (dRightAscension += twopi);
    dDeclination = Math.asin(Math.sin(dEclipticObliquity) * dSin_EclipticLongitude);
    dGreenwichMeanSiderealTime = 6.6974243242 + 0.0657098283 * dElapsedJulianDays + dDecimalHours;
    dLocalMeanSiderealTime = (15 * dGreenwichMeanSiderealTime +udtLocationdLongitude) * rad;
    dHourAngle = dLocalMeanSiderealTime - dRightAscension;
    dLatitudeInRadians = udtLocationdLatitude * rad;
    dCos_Latitude = Math.cos(dLatitudeInRadians);
    dSin_Latitude = Math.sin(dLatitudeInRadians);
    dCos_HourAngle = Math.cos(dHourAngle);
    udtSunCoordinatesdZenithAngle = Math.acos(dCos_Latitude * dCos_HourAngle * Math.cos(dDeclination) + Math.sin(dDeclination) * dSin_Latitude);
    dY = -Math.sin(dHourAngle);
    dX = Math.tan(dDeclination) * dCos_Latitude - dSin_Latitude * dCos_HourAngle;
    udtSunCoordinatesdAzimuth = Math.atan2(dY,dX);
    0 > udtSunCoordinatesdAzimuth && (udtSunCoordinatesdAzimuth += twopi);
    udtSunCoordinatesdAzimuth /= rad;
    dParallax = dEarthMeanRadius / dAstronomicalUnit * Math.sin(udtSunCoordinatesdZenithAngle);
    udtSunCoordinatesdZenithAngle = (udtSunCoordinatesdZenithAngle + dParallax) / rad;
    azimuth = udtSunCoordinatesdAzimuth;
    zenith = udtSunCoordinatesdZenithAngle;
    elevation = 90 - udtSunCoordinatesdZenithAngle;
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

function radtheoric(param,datetime,lat,lon,albedo)
{ 
  if( albedo === undefined ) { albedo = 0.3;};
  var radcalcteoric;
  var elev=sun_data(datetime,lat,lon,"elevation");
  var jddate=datetime.getDOY();
  var SC = 1.361; //  kW/m2   ET solar radition I0 kW/m2 Solar constant
  var I0 = SC*(1+0.034*Math.cos((jddate)*2*pi/365)); //  atmospheric effect
  var A = 1.160 + 0.075 * Math.sin((jddate-274)*2*pi/365);
  var opt_depth = 0.174 + 0.035 * Math.sin((jddate-100)*2*pi/365);
  var air_mass = 1/Math.sin(elev*2*pi/360); 
  var IB = I0*Math.exp(-opt_depth*air_mass); //  Direct Beam 
  var IDH = IB*(0.095 + 0.04*Math.sin((jddate-100)*2*pi/365)); // Diffuse radiation 
  var ID = IDH*(1+Math.cos(pi-elev*2*pi/360))/2; 
  var IBH = IB*Math.sin(elev*2*pi/360);
  var IR =  albedo*(IBH+IDH)*(1+Math.cos(pi-elev*2*pi/360))/2; // reflected
  var ITot = IB+ID+IR; //  total
  if ( ITot <0) {ITot=0;IB=0;IR=0;};
  
  if (param == "global") {return(ITot)}
  else if (param == "direct") {return(IB)}
  else if (param == "diffuse") {return(ID)}
  else if (param == "reflected") {return(IR)}
  else  {return("Not Available")}    

}

function rad_direct_tilted (datetime,lat,lon,planezen,planeaz) {

                            var az=sun_data(datetime,lat,lon,"elevation");
                            var elev=sun_data(datetime,lat,lon,"elevation");
                            planezen=planezen/rad;
                            planeaz=planeaz/rad;
                            elev=elev/rad;
                            az=az/rad;
                            var rad_dir=radtheoric("direct",datetime,lat,lon);
                            var radinc=rad_dir *(Math.cos(elev)*Math.sin(planezen)*Math.cos(planeaz-az)+Math.sin(elev)*Math.cos(planezen));
   return(rad_inc);
}


function  proj(sunelev)
{
          if (sunelev < 0.0)
          {return 0.0};
 return 0.308 * Math.cos(rads * (sunelev* (0.998- (Math.pow(sunelev, 2.0) / 50000.0))));
}

//Calculated the mean radiant temperature from the solar radiation.  Modified based on direct && diffuse.  Gives values too small;
//Assumes a uniform surround temperature of Ta && short wave solar radiation only;

function fMRTmod (Ta, solar){
         var solardirect,solardiffuse; 
         if(solar > 1000 ){
                           solardirect = 0.75 * solar;
                           solardiffuse = 0.25 * solar;
                          }
         else if (solar > 250)
                          {solardiffuse = (-0.001 * solar + 1.25) * solar;
                           solardirect = (0.001 * solar - 0.25) * solar;
                          }
         else             {
                          solardirect = 0;
                          solardiffuse = solar;
                          }
                          return (0.97 * (Ta + 273.2) ^ 4 + 0.7 * solardiffuse / (0.97 * 0.0000000567) + 0.32 * 0.7 * solardirect / (0.97 * 0.0000000567)) ^ 0.25 - 273.2;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Psycrometrics related functions.

/**
 * Given air temperature (Celsius), relative humidity rh (%) give dewpoint .
 *
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */

function fTd (Ta, RH){
         var RHD = RH / 100;
         return 237.3 * (Log(RHD) / 17.27 + Ta / (237.3 + Ta)) / (1 - Math.log(RHD) / 17.27 - Ta / (237.3 + Ta));
}

function fRH (Ta, Td){


          return 100 * Math.exp(17.27 * Td / (237.7 + Td) - 17.27 * Ta / (237.7 + Ta));
}

function fTmrtB (Ta, Tg, ws){
         var WF;
         var WF1 = 0.4 * (Math.abs(Tg - Ta)) ^ 0.25;
         var WF2 = 2.5 * ws ^ 0.6;
         if (WF1 > WF2 )
            {WF = WF1}
         else {WF = WF2};
         return 100 * (((Tg + 273) / 100) ^ 4 + WF * (Tg - Ta)) ^ 0.25 - 273;
}


/**
 * Given air temperature (Celsius), relative humidity rh (%) give dewpoint .
 *
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */

function fRH (t, td) {

              return 100 * Math.exp(17.27 * td / (237.7 + td) - 17.27 * t / (237.7 + t));

}






function fWBGTi (Ta, Td, ws, RH){
                      var Diffold,Diff,Ed,Ew,Tw;
                      // Psychrometric Wet bulb temperature calculation;
                      if(Td > Ta ){return "-999.9"};
                      if(ws < 0.1 ){ws = 0.1;};
                      Tw = Td;
                      var diff = 10000;
                      var Ed = 0.6106 * Exp(17.27 * Td / (237.3 + Td));
                      do  { 
                           Diffold = Diff;
                           Ew = 0.6106 * Exp(17.27 * Tw / (237.3 + Tw));
                           Diff = 1556 * Ed + 101 * Ta - 1556 * Ew + 1.484 * Ew * Tw - 1.484 * Ed * Tw - 101 * Tw;
                           Tw = Tw + 0.2;
                           if (Tw > Ta ) { break; }                        
                           } while ( Math.abs(Diff) + Math.abs(Diffold) === Math.abs(Diff + Diffold));

                      if(Tw > Td + 0.3 )
                         {Tw = Tw - 0.3;}
                      else
                         {Tw = Td};
                      return 0.67 * Tw + 0.33 * Ta - 0.048 * Log(ws) / Log(10) * (Ta - Tw);
}

function h_cylinder_in_air (Tair, Pair, speed, speedMin){

          //  Purpose to calculate the convective heat transfer coefficient for a long cylinder in cross flow.;
          //  Reference Bedingfield && Drew, eqn 32;
          //  Author James C. Liljegren;
          //  Decision && Information Sciences Division;
          //  Argonne National Laboratory;

          var Pr = 1003.5 / (1003.5 + 1.25 * 8314.34 / 28.97);
          var thermal_con = (1003.5 + 1.25 * 8314.34 / 28.97) * viscosity(Tair);
          var density = (Pair * 100) / (8314.34 / 28.97 * Tair);
          if(speed < speedMin ){
                    speed = speedMin;
          }
          var Re = speed * density * diamWick / viscosity(Tair);
          var Nu = 0.281 * Re ^ 0.6 * Pr ^ 0.44;
          return Nu * thermal_con / diamWick;  // W/(m2 K);
}


function diffusivity (Tair, Pair){

                     //  Purpose compute the diffusivity of water vapor in air, m2/s;
                     //  Reference; BSL, page 505.;
                     var pcrit13 = Math.pow((36.4 * 218), (1/ 3));
                     var tcrit512 = Math.pow((132 * 647.3), (5 / 12));
                     var Tcrit12 = Math.pow((132 * 647.3), 0.5);
                     var Mmix = Math.pow((1 / 28.97 + 1 / 18.015),0.5);
                     return 0.000364 * (Tair / Tcrit12) ^ 2.334 * pcrit13 * tcrit512 * Mmix / (Pair / 1013.25) * 0.0001;
}



function h_sphere_in_air (Tair, Pair, speed, speedMin){

         //  Purpose to calculate the convective heat tranfer coefficient for flow around a sphere.;
         //  Reference Bird, Stewart, && Lightfoot (BSL), page 409.;
         var Rair = 8314.34 / 28.97;
         var Pr = 1003.5 / (1003.5 + 1.25 * Rair);
         var thermal_con = (1003.5 + 1.25 * 8314.34 / 28.97) * viscosity(Tair);
         var density = Pair * 100 / (Rair * Tair)   // kg/m3;
         if(speed < speedMin ){speed = speedMin};
         var Re = speed * density * diamGlobe / viscosity(Tair);
         var Nu = 2 + 0.6 * Re ^ 0.5 * Pr ^ 0.3333;
         return Nu * thermal_con / diamGlobe ; // W/(m2 K);
}

function emis_atm (Ta, RH){
                  //  Reference; Oke (2nd edition), page 373.;
                  var e = RH * esat(Ta);
                  return 0.575 * Math.pow(e,0.143);
}

function esat (Tk){

              //  Purpose: calculate the saturation vapor pressure (mb) over liquid water given the temperature (K).;
              //  Reference Buck's (1981) approximation (eqn 3) of Wexler's (1976) formulae.;
              //  over liquid water;
              //  correction for moist air, if pressure is ! available; for pressure > 800 mb;
                  var esat= 6.1121 * Exp(17.502 * (Tk - 273.15) / (Tk - 32.18));
                  return 1.004 * esat;  
}

function viscosity (Tair){

                   //  Purpose: Compute the viscosity of air, kg/(m s) given temperature, K;
                   //  Reference; BSL, page 23.;
                       var omega = (Tair / 97 - 2.9) / 0.4 * (-0.034) + 1.048;
                       return 0.0000026693 * (28.97 * Tair) ^ 0.5 / (3.617 ^ 2 * omega);
}


function h_sphere_in_air_withdiam (Tair, Pair, speed, speedMin, diam){

                                    //  Purpose: to calculate the convective heat tranfer coefficient for flow around a sphere.;
                                    //  Reference : Bird, Stewart, && Lightfoot (BSL), page 409.;
                                    var Rair = 8314.34 / 28.97;
                                    var Pr = 1003.5 / (1003.5 + 1.25 * Rair);
                                    var thermal_con = (1003.5 + 1.25 * 8314.34 / 28.97) * viscosity(Tair);
                                    var density = Pair * 100 / (Rair * Tair)   // kg/m3;
                                    if(speed < speedMin ){speed = speedMin};
                                    var Re = speed * density * diam / viscosity(Tair);
                                    var Nu = 2 + 0.6 * Re ^ 0.5 * Pr ^ 0.3333;
                                    return Nu * thermal_con / diam; // W/(m2 K);
}


function fTg_withdiam (Ta, rh, speed, solar, diam,fdir,zenith){
                        if( fdir === undefined ) { fdir = 0.8;}; //Assume a proportion of direct radiation = direct/(diffuse + direct);
                        if(zenith === undefined ) {zenith = 0;}; //Assume a proportion of direct radiation = direct/(diffuse + direct);
                        zenith=zenith/rad;
                        var converge,alb_sfc,cza;
                        var speedMin = 0.1   //0 wind speed upsets log function;
                        var Pair = 101; // in hpa
                        var alb_sfc = SurfAlbedo;
                        var alb_globe = 0.05;
                        var emis_globe = 0.95;
                        var emis_sfc = 0.999;
                        var Tair = Ta + 273.15;
                        var RH = rh * 0.01;
                        var Tsfc = Tair;
                        var Tglobe_prev = Tair;
                        converge = 0.05;
                        Pair = Pair * 10;
                        if(zenith <= 0 ){ zenith = 0.0000000001;};
                        if(zenith > 1.57 ){ zenith = 1.57;}
                        cza = Math.cos(zenith);
                        var iter=1;
                        do {
                           var Tref = 0.5 * (Tglobe_prev + Tair) // Evaluate properties at the average temperature;
                           var h = h_sphere_in_air_withdiam(Tref, Pair, speed, speedMin, diam);
                           var Tglobe = Math.pow(Math.pow((0.5 * (emis_atm(Tair, RH) * Tair, 4) + emis_sfc * Math.pow(Tsfc , 4) - h / (emis_globe * stefanb) * (Tglobe_prev - Tair) + solar / (2 * emis_globe * stefanb) * (1 - alb_globe) * (fdir * (1 / (2 * cza) - 1) + 1 + alb_sfc))), 0.25);
                           var dT = Tglobe - Tglobe_prev;
                           if((Math.abs(dT) < converge) ) { Tglobe = Tglobe - 273.15;break;}
                           iter=iter+1;
                           } while ( iter < 500);  
                        
                          if ( iter === 499) {
                             Tglobe_prev = (0.9 * Tglobe_prev + 0.1 * Tglobe);
                          }
                        return Tglobe;
}



/**
 * Given air temperature (Celsius) calculates Saturated Vapor Pressure (Torr) at Temperature T  (C) .
 *
 * @param {number} T
 * @return {number}
 * @customfunction
 */
	
  
function vpaTorr(T) {
    
                     return Math.exp(18.6686 - 4030.183 / (T + 235.0));
}

/**
 * Given air temperature T (Celsius)  function gives Saturation Vapor Pressure. Dimension of outcomes in Pascal (kPa)
 *
 * @param {number} t
 * @return {number}
 * @customfunction
 */

function esat (t) {
		 if (t < 0) {
			         var a = 21.874;
			         var b = 7.66;
		            } else {
			         var a = 17.269;
			         var b = 35.86;
		             }
		return(611 * Math.exp(a * t / (t + 273.16 - b)) / 1000);  
	};  
  


/*
 * Saturation Vapor Pressure formula for range -100..0 Deg. C.
 * Hardy B, 1998,"ITS-90 Formulations for Vapor Pressure, Frostpoint Temperature,Dewpoint Temperature, and Enhancement Factors in the Range 100 to +100 C".
 * Proceedings of the Third International Symposium on Humidity & Moisture",Teddington, London, England, April 1998
*/

function pvsIce(T) {
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
 * Saturation Vapor Pressure formula for range 273..678 Deg. K. 
 * Equation (30) in Section 8.1 "The Saturation-Pressure Equation (Basic Equation),Erlangen, Germany, September 1997.
*/


function pvsWater(T) {
  
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
 * Given air temperature T (Celsius)  function gives Saturation Vapor Pressure. Dimension of outcomes in Pascal (kPa)
 *
 * @param {number} T
 * @return {number}
 * @customfunction
 */

function PVS(T) {
                 T=T+273.16;
  var minT = 173; // -100 Deg. C.
  var maxT = 678;
  var noresp = -999.9;
  
  if (T < minT || T> maxT) 
     {return noresp;}
  
  else if (T<273.15)
           {return(pvsIce(T)/1000);}
  else
           {return(pvsWater(T)/1000);}
}



/**
 * Given air temperature (Celsius), relative humidity (%) and pressure ( pa) give deficit of saturation in delta kPA
 *
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */

function  deficitsat( t, rh) {
  var pws = PVS(t);
  var pae=rh/100*pws;
  return (pws-pae);
}

/**
 * Given a temperature in Celsius, return Fahrenheit value.
 * @param {number} C
 * @return {number}
 * @customfunction
 */

function C2F(C) {
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

function F2C(F) {
  if (typeof F !== 'number') {
                             throw TypeError('Value must be a number');
                             }
 return(Math.round((5/9) * (F - 32),3));
}


/**
 * Given a temperature  Celsius value give Vapor Pressure in kPa.
 *
 * @param {number} ta
 * @return {number}
 * @customfunction
 */

function es(ta)
{
  // Hardy, R.; ITS-90 Formulations for Vapor Pressure, Frostpoint
  // Temperature, Dewpoint Temperature and Enhancement Factors in the
  // Range -100 to 100 degC; 
  // Proceedings of Third International Symposium on Humidity and Moisture;
  // edited by National Physical Laboratory (NPL), London, 1998, pp. 214-221
  // http://www.thunderscientific.com/tech_info/reflibrary/its90formulas.pdf
  // (retrieved 2008-10-01)
 
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
  
  
  
  tk = ta+273.15; 
  
  es_air = g[7]*Math.log(tk);
  
  for ( var i = 0; i < 7; i ++ )
         {es_air = es_air+g[i]*Math.pow(tk,i-2)};
  
  var es = Math.exp(es_air)*0.01; // convert Pa to hPa
  
  return es/10;
}

/**
 * Given a air temperature (Celsius) and air pressure (hPa)  give Dew point in Celsius degrees.
 *
 * @param {number} t,hpa
 * @return {number}
 * @customfunction
 */

function dewpt(t, hpa) {
  var p, dpt;
  p=Math.log(100.0*hpa);
  if (t >= 0.0)
      {dpt=(-60.45)+7.0322*p+.37*p*p;}
  else
      {dpt=(-35.957)-1.8726*p+1.1689*p*p;}
  return (dpt);
}
               
/**
 * Given a temperature t in Celsius give saturation pressure in kPa.
 * @param {number} t
 * @return {number} 
 * @customfunction
 */


function  p_saturazione(t) {

  t = t+273.15;
  if (t > 273.15) {
                  return (Math.exp(-5800.2206/t+1.3914993-.048640239*t+(.41764768e-4)*Math.pow(t,2.0)-(.14452093e-7)*Math.pow(t, 3.0)+6.5459673*Math.log(t))/1000.0);
                  }
  else            {
                  return (Math.exp(-5674.5359/t+6.3925247-(.9677843e-2)*t+(.62215701e-6)*Math.pow(t, 2.0)+(.20747825e-8)*Math.pow(t, 3.0)-(.9484024e-12)*Math.pow(t, 4.0)+4.1635019*Math.log(t))/1000.0);
                  }
}



/**
 * Given a air temperature t (Celsius) and air pressure hpa (hPa)  give Dew Point in Celsius degrees.
 *
 * @param {number} t,hpa
 * @return {number}
 * @customfunction
 */

function dewpoint(t, hpa) {
  var p, dpt;
  p= Math.log(100.0*hpa);
  if (t >= 0.0)
      {dpt=(-60.45)+7.0322*p+.37*p*p;}
  else
      {dpt=(-35.957)-1.8726*p+1.1689*p*p;}
  return (dpt);
}



/**
 * Given a air temperature t (Celsius) and air relative humidity  (RH)  give Dew point in Celsius degrees.
 *
 * @param {number} t,RH
 * @return {number}
 * @customfunction
 */

function fTd (t, RH){
  
var RHD = RH / 100;
  
return 237.3 * (Math.log(RHD) / 17.27 + t / (237.3 + t)) / (1 - Math.log(RHD) / 17.27 - t / (237.3 + t));
}




/*----------------------------------------------------------------------*/
/* calculates the enthalpy of air/water vapor mixture [kJ/kg]           */
/* Based on furmula in the ASHRAE Handbook of Fundamentals.             */
/* Inputs are dry-bulb temperature [C] and humidity ratio (unitless).   */
/*----------------------------------------------------------------------*/
// [[Rcpp::export]] 

function enthal( tdb,  w) {
	var y;
	y=1.006*tdb+w*(2501.0+1.805*tdb);
	return (y);
}

/*----------------------------------------------------------------------*/
/* spvol() gets the specific volume of air/water vapor mixture [m^3/kg] */
/* input: tc--- dry_bulb temperature [C]                                */
/*        w---- humidity ratio                                          */
/*        pa---- air pressure  [kPa]                                    */
/* output: function = specific volume                                   */
/*----------------------------------------------------------------------*/
// [[Rcpp::export]] 

function spvol(tc, w,pa) {
	var t, y;
	t=tc+273.16;
	y=(287.055*t*(1+1.6078*w))/(pa*1000.0);
	return (y);
}

/*----------------------------------------------------------------------*/
/* calculates the humidity ratio of air/water vapor mixture.            */
/* Based on formula in the ASHRAE Handbook of Fundamentals.             */
/* Inputs is water vapor pressure [kPa]. Assume aipr=101.325 [kPa]      */
/* output : function = humidity ratio                                   */
/*----------------------------------------------------------------------*/

// [[Rcpp::export]] 

function humrat(p, pa) {
	var y;
	y=0.62198*p/(pa-p);
	return (y);
}

/*----------------------------------------------------------------------*/
/*  wetblb()                                                            */
/* It solves for the wet-bulb temperature iteratively,using enthalpy.   */
/* Based on formula in the ASHRAE Gandbook of Fundamentals.             */
/* Inputs:dry-blub temperature [C]. humidity ratio (unitless)           */
/* enthalpy [kJ/kg]. and air pressure [kPa].                            */
/* Wet-bulb temperature is calculated to the nearest .01 C.             */
/*----------------------------------------------------------------------*/


function wetblb(tstar, w, hh, pa) {
	var  t, dum1, dum3, hwstar, p, wstar, hstar, twb;

	t=tstar+1.0;
	dum3=10.0;
	do {
		dum3=(-dum3/10.0);
		do {
			t=t+dum3;
			hwstar=4.186*t;
			p=psat(t);
			wstar=humrat(p, pa);
			hstar=enthal(t, wstar);
			dum1=hstar-hh-(wstar-w)*hwstar;
		} while (dum1*dum3<=0.0);
	} while (Math.abs(dum3)>=.000001);

	twb=t;
	return twb;
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Metabolic  related functions. 

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
// Comfort related functions. 

/**
 * Given Ambient Air Temperature (< +10 Celsius), relative humidity rh (%), Relative air velocity wind ( 0.4 to 18 m/s)
 * Mean radiant temperature (Celsius),Metabolic energy production M (58 to 400 W/m2), Rate of mechanical work W( normally 0 W/m2),
 * AVAILABLE basic clothing insulation ICL ( clo = 0.155 W/m2K), Air clothing permeability p (low < 5, medium 50, high > 100 l/m2s) 
 * give a Insulation required IREQ Index ISO 11079. 
 * Reference: http://www.eat.lth.se/fileadmin/eat/Termisk_miljoe/IREQ2009ver4_2.html
 * @param {number} Ta,rh,v,Tr,M,W,Icl,p,w
 * @customfunction
 */


function IREQ(Ta,rh,v,Tr,M,W,Icl,p,w,param) {
    
    
   var Tsk,wetness,Tex,Pex,
	Psks,fcl,vp,Icl,Iclr,Pa,Tcl,hc,hr,
	IREQ,Ia,Rt,factor,Balance,R,C,Hres,calculation,ICL_ISO11079,
	E,S,DLE,ArAdu,IclCorr,slask,worktype,ICLminimal,ICLneutral,
	IREQneutral,IREQminimal,DLEneutral,DLEminimal = 1;
  
   /*  
    * Ta (C), Ambient air temperature (< +10 C)
    * rh (%), Relative humidity
    * v (m/s), Relative air velocity (0.4 to 18 m/s)
    * Tr (C), Mean radiant temperature (often close to ambient air temperature)
    * M (W/m2), Metabolic energy production (58 to 400 W/m2)
    * W (W/m2), Rate of mechanical work, (normally 0)
    * Icl (clo), AVAILABLE basic clothing insulation (1 clo = 0.155 W/m2K) 
    * p (l/m2s), Air permeability (low < 5, medium 50, high > 100 l/m2s)
    * w (m/s), Walking speed (or calculated work created air movements) 
  */  
  
   // Parameter adjustements to induce stationarity.
  
	if (M <= 58)  { M = 58 }; // minimum metabolic rate 
  
	if (M >= 400) { M = 400};
  
	if (Ta>=10) {Ta=10;}
  
	if (w<=0.0052*(M-58)) { w=0.0052*(M-58);};	
	
    if (w>=1.2) {w=1.2;};
	
    if (v<=0.4) {v=0.4;}
	
    if (v>=18){v=4;}; 

    // Calculation clothing insulation parameters.
  
	Icl=Icl*0.155;
	
    Ia=0.092*Math.exp(-0.15*v-0.22*w)-0.0045;
	
    calculation=0;
    
	do {
		
        calculation=calculation+1;
		
        // Calculation of Tsk (C) and wetness (%) 
		
        if (calculation==1) 
           {
			
        // For IREQminimal, DLEminimal ! 
          
			Tsk=33.34-0.0354*M;
			wetness=0.06;
		}
         	else	{
			
        // For IREQneutral, DLEneutral ! 
              
			Tsk=35.7-0.0285*M;
			wetness=0.001*M;
	 	}
		
        // Calculation of Tex (C) and Pex,Psks,Pa (Pa) 
      
		Tex=29+0.2*Ta;                     
		Pex=0.1333*Math.exp(18.6686-4030.183/(Tex+235));
		Psks=0.1333*Math.exp(18.6686-4030.183/(Tsk+235)); 
		Pa=(rh/100)*0.1333*Math.exp(18.6686-4030.183/(Ta+235));
      
		// Calculation of IREQ (m2C/W),Rt (m2kPa/W),fcl (n.d.),hr W/m2C with stepwise iteration 
      
		IREQ=0.5; hr=3; ArAdu=0.77; factor=0.5; // Initial values ! 
        
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

		// *** Calculation of Dlimneutral and Dlimminimal *** 
	
       // Calculation of S (W/m2), Rt (m2kPa/W), fcl (n.d.), hr W/m2C with stepwise iteration 
      
      
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
			
            IREQminimal =Math.round((IREQ/0.155)*10)/10;
			
            ICLminimal =Math.round((((IREQ+Ia/fcl)/(0.54*Math.exp(-0.15*v-0.22*w)*Math.pow(p,0.075)-0.06*Math.log(p)+0.5))-0.085/fcl)/0.155*10)/10;
			
            if (S>-8)
             
              { DLEminimal=8}
			
            else
              {
                DLEminimal=Math.round(DLE*10)/10;
		      }
            }
		 
        else	
            {
			    IREQneutral=Math.round((IREQ/0.155)*10)/10;
			    ICLneutral=Math.round((((IREQ+Ia/fcl)/(0.54*Math.exp(-0.15*v-0.22*w)*Math.pow(p,0.075)-0.06*Math.log(p)+0.5))-0.085/fcl)/0.155*10)/10;
			    
                if (S>-8)
                    { DLEneutral=8}
			    
                else
                    { DLEneutral=Math.round(DLE*10)/10}
			
           if (Icl/0.155>ICLneutral)
             
              {ICL_ISO11079="AVAILABLE > REQUIRED MINIMAL & NEUTRAL basic clothing insulation"}
           
           else  
			   {ICL_ISO11079="NOT AVAILABLE < REQUIRED MINIMAL & NEUTRAL basic clothing insulation"}	
		    }
	} while (calculation < 2);
    
    if (param == "IREQ_neutral") {return(IREQneutral)}
    else if (param == "IREQ_min") {return(IREQminimal)}
    else if (param == "ICL_neutral") {return(ICLneutral)}
    else if (param == "ICL_min") {return(ICLminimal)}
    else if (param == "DLE_neutral") {return(DLEneutral)}
    else if (param == "DLE_min") {return(DLEminimal)}
    else if (param == "ICL_ISO11079") {return(ICL_ISO11079)}
    else  {return("Not Available")}    
}



/**
 * Given Ambient Air Temperature (< +10 Celsius), relative humidity rh (%), Relative air velocity wind ( 0.4 to 18 m/s)
 * Mean radiant temperature (Celsius),Metabolic energy production M (58 to 400 W/m2), Rate of mechanical work W( normally 0 W/m2),
 * AVAILABLE basic clothing insulation ICL ( clo = 0.155 W/m2K), Air clothing permeability p (low < 5, medium 50, high > 100 l/m2s) 
 * give a Recovery Time Index in hours ISO 11079. 
 * Reference: http://www.eat.lth.se/fileadmin/eat/Termisk_miljoe/IREQ2009ver4_2.html
 * @param {number} Ta,rh,v,Tr,M,W,Icl,p,w
 * @return {number}
 * @customfunction
 */


function RT(Ta,rh,v,Tr,M,W,Icl,p,w) {
	
    if(w === undefined) { w = 0;};
    
    var Tsk,wetness,Tex,Pex,
	Psks,fcl,vp,Icl,Iclr,Pa,Tcl,hc,hr,
	IREQ,Ia,Rt,factor,Balance,R,C,Hres,calculation,RTneutral,
	E,S,ArAdu,IclCorr,slask,worktype,DLE = 1;
  
   /*  
    * Ta (C), Ambient air temperature (< +10 C)
    * rh (%), Relative humidity
    * v (m/s), Relative air velocity (0.4 to 18 m/s)
    * Tr (C), Mean radiant temperature (often close to ambient air temperature)
    * M (W/m2), Metabolic energy production (58 to 400 W/m2)
    * W (W/m2), Rate of mechanical work, (normally 0)
    * Icl (clo), AVAILABLE basic clothing insulation (1 clo = 0.155 W/m2K) 
    * p (l/m2s), Air permeability (low < 5, medium 50, high > 100 l/m2s)
    * w (m/s), Walking speed (or calculated work created air movements) 
  */  
  
   // Parameter adjustements to induce stationarity.
  
	if (M <= 58)  { M = 58 }; // minimum metabolic rate 
  
	if (M >= 400) { M = 400};
  
	if (Ta<=10) {Ta=10;}
  
	if (w<=0.0052*(M-58)) { w=0.0052*(M-58);};	
	
    if (w>=1.2) {w=1.2;};
	
    if (v<=0.4) {v=0.4;}
	
    if (v>=18){v=4;}; 

    // Calculation clothing insulation parameters.
  
	Icl=Icl*0.155;
	
    Ia=0.092*Math.exp(-0.15*v-0.22*w)-0.0045;
	
   
	      // Calculation of Tsk (C) and wetness (%) 
		// For RTneutral! 
		
        Tsk=35.7-0.0285*M;
		wetness=0.001*M;
		
        // Calculation of Tex (C) and Pex,Psks,Pa (Pa) 
		
        Tex=29+0.2*Ta;                     
		Pex=0.1333*Math.exp(18.6686-4030.183/(Tex+235));
		Psks=0.1333*Math.exp(18.6686-4030.183/(Tsk+235)); 
		Pa=(rh/100)*0.1333*Math.exp(18.6686-4030.183/(Ta+235));  
		
        // Calculation of S (W/m2), Rt (m2kPa/W), fcl (n.d.), hr W/m2C with stepwise iteration 
		
        Tcl=Ta; hr=3; S=-40; ArAdu=0.77; factor=100; Iclr=Icl;// Initial values !          
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
      
		if (DLE>=0)
            {RTneutral="Negative body storage."}
        else
        {RTneutral=Math.round(Math.abs(DLE)*10)/10};
  
         
       return(RTneutral);
  
}
/**
 * Given Ambient Air Temperature (< +10 Celsius) and relative air velocity wind ( 0.4 to 18 m/s)
 * give a windchill index - ISO11079. 
 * Reference: http://www.eat.lth.se/fileadmin/eat/Termisk_miljoe/IREQ2009ver4_2.html
 * @param {number} Ta,v
 * @return {number}
 * @customfunction
 */

function windchill_new(t,v) {
	var v,Tawci,WCI,twc = 1;
	v = v*1.0
	Tawci = t;
	twc = 13.12+0.6215*Tawci-11.37*Math.pow(v,0.16)+0.3965*Tawci* Math.pow(v,0.16);
	return(TwoDec(twc));
}









/**
 * Given PMV value and Metabolic energy production M (58 to 400 W/m2) return the balance follwing PMV  Index ISO 7730. 
  * @param {number} PMW
 * @return {number}
 * @customfunction
 */

function PPD(PMV) {
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

  
function balancePMV7730(pmv,M) {
                       var balance = pmv / (0.303 * Math.exp(-0.036 * M) + 0.028);
                       return(balance);
                       } 
  
  

/**
 * Given air temperature (Celsius), relative humidity (%) give a heat index in Celsius degree. References:[1] http://www.wpc.ncep.noaa.gov/html/heatindex.shtml [2] https://en.wikipedia.org/wiki/Heat_index [3] http://www.srh.noaa.gov/images/ffc/pdf/ta_htindx.PDF
 * 
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */

function heatindex(t, rh)
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
 * Given air temperature (Celsius), relative humidity (%) give a heat index in Celsius degree. For primates https://community.dur.ac.uk/r.a.hill/Hill%20et%20al%202004.pdf
 *
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */

function  hi_index( t, rh)
{
    var hi = 999.9;
    if (rh > 100.1 || rh < 0.0)
       {return 999.9}
    else if (t > 100.0 || t < -100.0)
       {return 999.9}
    else
    {hi = -8.784695+(1.61139411*t)+
                (2.338549*rh)-
                (0.14611605*t*rh)-(1.2308094*Math.pow(10,-2)*Math.pow(t,2))
               -(1.6424828*Math.pow(10,-2)*Math.pow(rh,2))
               +(2.211732*Math.pow(10,-3)*Math.pow(t,2)*rh)
               +(7.2546*Math.pow(10,-4)*t*Math.pow(rh,2))
               -(3.582*Math.pow(10,-6)*Math.pow(rh,2));
     }
  
  return TwoDec(hi);
}

/**
 * Given air temperature (Celsius), relative humidity (%),wind ( m/sec) give a Net Effective Index index in Celsius degree.
 *
 * @param {number} t,rh
 * @return {number}
 * @customfunction
 */

function net_index(t, rh, wind)
{
    var net = 999.9;
    if (rh > 100.1 || rh < 0.0)
       {return 999.9}
    else if (wind > 130.0 || wind < 0.0)
       {return 999.9}
    else if (t > 100.0 || t < -100.0)
       {return 999.9}
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

function ssi_index(t, rh)
{  
    var ssi = 999.9;
    if (rh > 100.1 || rh < 0.0)
       {return ssi}
    else if (t > 100.0 || t < -100.0)
       {return ssi}
    else
       {ssi = ((1.98*((((9.0/5.0)*t)+32.0)-(0.55-0.0055*rh)*((((9.0/5.0)*t)+32.0)-58.0))-56.83)-32.0)/1.8}
    return  TwoDec(ssi);
}


/**
 * Given a temperature t (Celsius) and wind ( m/sec) frost time following ISO 9970.
 * @param {number} t
 * @return {number} 
 * @customfunction
 */

function frostime( t,  wind)
{
var ft;

if (wind> 100.1|| wind < 0.0)
    return 999.9;
else if (t > -10.0 || t < -60.0)
    return 999.9;
else{  
     ft=(((-24.5*((0.667*wind)+4.8)+2111)*(Math.pow((-t-4.8),-1.668)))/60);
    }
return OneDec(ft*60);
}




/**
 * Given a temperature t (Celsius), relative humidity rh (%), wind ( m/sec), mean radiant temperature mtrad ( Celsius) and clothing insulation (clo) 
 *  give PMV following Hoppe scheme for a customized person.
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


function PMV_T_metab(t,rh,wind, mtrad,iclo)
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
  
  metb = metabolism(t);
  h = metb;
 
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
  esw = 0.42 * adu * (h/adu - 58.08);
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

function PMV_ISO7730(ta, rh,vel,tr, M,W,clo) {
    
    // ta, air temperature (Â°C)
    // tr, mean radiant temperature ( °C)
    // vel, relative air velocity (m/s)
    // rh, relative humidity (%) Used only this way to input humidity level
    // met, metabolic rate (met)
    // clo, clothing (clo)
    // wme, external work, normally around 0 (met)

    var pa, icl, mw, fcl, hcf, taa, tra, tcla, p1, p2, p3, p4,
    p5, xn, xf, eps, hcn, hc, tcl, hl1, hl2, hl3, hl4, hl5, hl6,
    ts, pmv, ppd, n;

    pa = rh * 10 * Math.exp(16.6536 - 4030.183 / (ta + 235));

    icl = 0.155 * clo; //thermal insulation of the clothing in M2K/W
    mw = M - W; //internal heat production in the human body
    
    if (icl <= 0.078) {fcl = 1 + (1.29 * icl)}
    
    else {fcl = 1.05 + (0.645 * icl)};

    //heat transf. coeff. by forced convection
  
    hcf = 12.1 * Math.sqrt(vel);
    taa = ta + 273;
    tra = tr + 273;
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



function HSI_index(ta, rh,vel,tr, M,W,clo,param) {
    
    if( param === undefined ) { param = "HSI";};
 
    // ta, air temperature (Â°C)
    // tr, mean radiant temperature ( °C)
    // vel, relative air velocity (m/s)
    // rh, relative humidity (%) Used only this way to input humidity level
    // met, metabolic rate (met)
    // clo, clothing (clo)
    // wme, external work, normally around 0 (met)

    var pa, icl, mw, fcl, hcf, taa, tra, tcla, p1, p2, p3, p4,
    p5, xn, xf, eps, hcn, hc, tcl, hl1, hl2, hl3, hl4, hl5, hl6,
    ts, pmv, ppd, n;

    pa = rh * 10 * Math.exp(16.6536 - 4030.183 / (ta + 235));

    icl = 0.155 * clo; //thermal insulation of the clothing in M2K/W
    mw = M - W; //internal heat production in the human body
    
    if (icl <= 0.078) {fcl = 1 + (1.29 * icl)}
    
    else {fcl = 1.05 + (0.645 * icl)};

    //heat transf. coeff. by forced convection
  
    hcf = 12.1 * Math.sqrt(vel);
    taa = ta + 273;
    tra = tr + 273;
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

  
    var eres = mw  - hl3 - hl4 - hl5 - hl6;
  
    if (eres<0) { "No sweating"}
  
    var emax = 2.0 * Math.pow(vel,0.6) *(42 -(rh/100)*mbtommHG(es(ta)*10));; //Introduction to Human Factors and Ergonomics for EngineersDi Mark R. Lehto,Steven J. Landry,Jim Buck
        
    if ( param  == "HSI") {return(TwoDec((eres/emax)*100))}
    else if ( param  == "AET") {return(Math.abs(2440*(eres-emax)))}
    else { return("Check data!")};
}



function ocir_custom(t,rh,wind,mtrad,age,mbody,ht,gender)
{
 if( gender === undefined ) { gender = "male";};
 
 var MAX_ITER = 50;
 var PMV_GOOD_sup = 0.5;
 var PMV_GOOD_inf = 0.5;

 var pmv = -1.0; 
 var clo;
 
 var clomin;
 var clomax;
 var clorange;
   
  for (var j = 0; j < MAX_ITER; j ++)
    {
      pmv = PMV_custom(t,rh,wind,mtrad,clo,age,mbody,ht,gender);
      
      if (pmv > PMV_GOOD_inf) { clomin=clo};
      if (pmv > PMV_GOOD_sup) { clomin=clo;break;};
      
      clo+= 0.1;
    }
  
  clorange= OneDec(clomin) +" - "+OneDec(clomax);
  
 if ( parameter == "ocir") {return(ocir)}
    else if ( parameter == "clomax") {return(OneDec(clomax))}
    else if ( parameter == "clomin") {return(OneDec(clomin))}
    else { return("Parameter not indicated!")};
}

function ocir_7730(outcome,ta, rh,vel,tr,M)
{
 if( M === undefined ) { M = 58.15;};
  
 var MAX_ITER = 50;
 var PMV_GOOD_sup = 0.5;
 var PMV_GOOD_inf = 0.5;

 var pmv = -1.0; 
 var clo;
 
 var clomin;
 var clomax;
 var clorange;
   
  for (var j = 0; j < MAX_ITER; j ++)
    {
      pmv = PMV_ISO7730(ta, rh,vel,tr, M,0,clo)
      if (pmv > PMV_GOOD_inf) { clomin=clo};
      if (pmv > PMV_GOOD_sup) { clomin=clo;break;};
      
      clo+= 0.1;
    }
  
  clorange= OneDec(clomin) +" - "+OneDec(clomax);
  
 if ( parameter == "ocir") {return(ocir)}
    else if ( parameter == "clomax") {return(OneDec(clomax))}
    else if ( parameter == "clomin") {return(OneDec(clomin))}
    else { return("Parameter not indicated!")};
}


/**
 * Given Standard Effective Index  air temperature ta (Celsius) rh,rh,vel, tr,  M, W, clo, patm
 *
 * @param {number} t,td
 * @return {number}
 * @customfunction
 */




function pierceSET (ta, rh,vel, tr,  M, W, clo, patm) {
  
     if( patm === undefined ) { patm = 1013.25;};
  
    var TempSkinNeutral, TempBodyNeutral, SkinBloodFlowNeutral, TempSkin, TempCore,TempCoreNeutral,
    SkinBloodFlow, MSHIV, ALFA, ESK, PressureInAtmospheres, TIMEH, LTIME, DELTA, RCL,
    FACL, LR, RM, M, WCRIT, ICL, CHC, CHCA, CHCV, CHR, CTC, TOP, TCL, DRY, HFCS, ERES,
    CRES, SCR, SSK, TCSK, TB, SKSIG, WARMS, COLDS, WARMC, COLDC, CRSIG, WARMB, COLDB,
    REGSW, BDSIG, REA, RECL, EMAX, PRSW, PWET, EDIF, RA, TCL_OLD, TCCR, DTSK, DTCR, ERSW,
    X, X_OLD, CHCS, TIM, STORE, HSK, RN, ECOMF, EREQ, HD, HE, W, PSSK, CHRS, CTCS,
    RCLOS, RCLS, FACLS, FCLS, IMS, ICLS, RAS, REAS, RECLS, HD_S, HE_S;

    var VaporPressure = rh * vpaTorr(ta) / 100;
    var AirVelocity = Math.max(vel, 0.1);
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
    TOP = (CHR * tr + CHC * ta) / CTC;
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
                CHR = 4.0 * SBC * Math.pow(((TCL + tr) / 2.0 + 273.15), 3.0) * 0.72;
                CTC = CHR + CHC;
                RA = 1.0 / (FACL * CTC); //resistance of air layer to dry heat transfer
                TOP = (CHR * tr + CHC * ta) / CTC;
            }
            TCL = (RA * TempSkin + RCL * TOP) / (RA + RCL);
            flag = true;
        } while (Math.abs(TCL - TCL_OLD) > 0.01);
        flag = false;
        DRY = (TempSkin - TOP) / (RA + RCL);
        HFCS = (TempCore - TempSkin) * (5.28 + 1.163 * SkinBloodFlow);
        ERES = 0.0023 * M * (44.0 - VaporPressure);
        CRES = 0.0014 * M * (34.0 - ta);
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
 * Given air temperature (Celsius), relative humidity (%), wind velocity (m/sec) and mean radiant temperature ( tmrt in Celsius degree) gives Universal Thermal Climate Index in Celsius.
 *
 * @param {number} t,rh,wind,tmrt
 * @return {number}
 * @customfunction
 */

function UTCI(ta,rh,wind,tmrt)  
                     {     if (!(typeof ta === 'number' &&
                                 typeof rh === 'number'  &&
                                 typeof wind === 'number'  &&
                                 typeof tmrt === 'number')  
                              )
                                                      {
                                                       throw TypeError('Value must be a number');
                                                      }
                  
                  var ta,pa,va, e, dtm,i;
                  e = es(ta);
                  pa = (e*rh/100.0); // use vapour pressure in kPa
                  va = wind;
                  dtm = tmrt - ta;
    
                  utci = new Array(210)
                  
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
                      }

                  if (  ta < -50.0 || ta > 50.0 ) {total=999.9};
                  if ( (tmrt < ta-30.0) || (tmrt > ta+70.0 )) {total=999.9};
                  if (  wind < 0.5 || wind > 30.0 ) {total=999.9};
                  if (  rh <= 0.0 || rh >= 100.0 ) {total=999.9};
                  return TwoDec(total);
}



function utci_simplified(t,rh,v,tr) {
  
         return(3.21 + 0.872 * t + 0.2459 * tr - 2.5078 * v - 0.0176 * rh);
} 


function utci_class( t,rh, wind,tmrt) 
{
	
  var  utci_v,utci_c;
 
  utci_v=UTCI(t,rh,wind,tmrt);
  
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
  else if (utci_v == 999.9)
  {utci_c=-999.9};

  return utci_c;
}

function utci_class7( t,rh, wind,tmrt) 
{
	
  var  utci_v,utci_c;
 
  utci_v=UTCI(t,rh,wind,tmrt);
  
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
  else if (utci_v == 999.9)
  {utci_c=-999.9};

  return utci_c;
}
    

function sto_shade_class( t,rh, wind) 
{
  var  stoshade_v,stoshade_c;
 
  steadman_outdoor_shade_v=steadman_outdoor_shade(t,rh,wind);   
                             
 
  if ( stoshade_v > 40.0)
   {stoshade_c=9.0;}
  else if (stoshade_v > 35.0 && stoshade_v <= 40.0)
    {stoshade_c=8.0;}
  else if (stoshade_v > 30.0 && stoshade_v <= 35.0)
  {stoshade_c=7.0;}
  else if (stoshade_v > 27.0 && stoshade_v <= 30.0)
    {stoshade_c=6.0;}
  else if (stoshade_v > 10.0 && stoshade_v <= 27.0)
    {stoshade_c=5.0;}
  else if (stoshade_v > 5.0 && stoshade_v <= 10.0)
    {stoshade_c=4.0;}
  else if (stoshade_v > 0.0 && stoshade_v <= 5.0)
  {stoshade_c=3.0;}
  else if (stoshade_v > -5.0 && stoshade_v <= -0.0)
    {stoshade_c=2.0;}	
  else if (stoshade_v <= -5.0)
    {stoshade_c=1.0;}
  else if (stoshade_v == 999.9)
  {stoshade_c=-999.9};

  return stoshade_c;
}



function sharlau_index(t,rh) {
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
       

function RSI_index(t,rh) {
                           var es_vap=es(t);
                           var vap= rh/100*es_vap;
                           var RSI = (t-21)/(58-vap*10);
                           return TwoDec(RSI);

}


/**
 * Given air temperature (Celsius), relative humidity (%), wind velocity (m/sec) 
 *
 * @param {number} t,rh,wind
 * @return {number}
 * @customfunction
 */

function humidex(t,rh)
{
  
  var humidex,e;
    humidex = 999.9;
  
  if (rh > 100.1 || rh < 0.0) { return -999.9}
  
    
  else if (t > 100.0 || t < -100.0)
       
  {return -999.9}
  
    else
    {
      e = (rh/100.0)*(6.105*Math.exp((t*17.27)/(237.7+t)));
      humidex = t+(0.5555*(e-10.0));
    };
  

  return TwoDec(humidex);
}



function t_apparent_AUS(t, rh,wind) // equivalent to steadman_outdoor_shade
{

  var t_app;
  var e = (rh/100.0)*(6.105*exp((t*17.27)/(237.7+t)));
  t_app = t +0.33*e-0.70*wind-4;
  return t_app;
}


function steadman_outdoor_sun(t,rh,wind,rshort,sunelev)
{
   var steadman_outdoor_sun=-999.9;
   var ee = (rh/1000.0)*(6.105*exp((t*17.27)/(237.7+t)));
   var q_glob = 0.56*(0.386-(0.0032*sunelev))*rshort + 0.224*(0.1*rshort)+ 0.028*rshort - 150.0*(0.38-0.16*(pow(ee,0.5))); 
  
    if (rh > 100.1 || rh < 0.0)
       {return 999.9}
    else if (t > 100.0 || t < -100.0)
    {return 999.9}; 
    
  if (q_glob > 0.0)
     {steadman_outdoor_sun = t+3.48*(ee)-0.7*wind +0.7*q_glob/(wind+10.0)-4.25};
  return steadman_outdoor_sun;
}

/**
 * Given air temperature (Celsius), relative humidity (%), wind velocity (m/sec) and give Steadman outdoor shade index.
 *
 * @param {number} t,rh,wind
 * @return {number}
 * @customfunction
 */

function steadman_outdoor_shade(t, rh, wind)
{
    var steadman_outdoor_shade,e;
    
    steadman_outdoor_shade = 999.9;
    
    if (rh > 100.1 || rh < 0.0)
        {return 999.9}
    else if (wind > 130.0 || wind < 0.0)
        {return 999.9}
    else if (t > 100.0 || t < -100.0)
         {return 999.9}
    else
    {
       e = (rh/100.0)*(6.105*Math.exp((t*17.27)/(237.7+t)));
       steadman_outdoor_shade = t+(0.33*e)-(0.7*wind)-4.0;
    };
  
  return TwoDec(steadman_outdoor_shade);
}

/**
 * Given air temperature (Celsius), relative humidity (%) and give Steadman indoor index.
 *
 * @param {number} t,rh 
 * @return {number}
 * @customfunction
 */

function steadman_indoor(t,rh)
{ 
    var steadman_indoor,e;

    steadman_indoor = 999.9;
  
    if (rh > 100.1 || rh < 0.0)
       {return 999.9}
    else if (t > 100.0 || t < -100.0)
       {return 999.9}
    else
    {
      e = (rh/100.0)*(6.105*Math.exp((t*17.27)/(237.7+t)));
      steadman_indoor = -2.56+(0.89*t)+(0.382*e);  
    };

  return TwoDec(steadman_indoor);
}




function thom(t,p)
{
  
    var thom;
    var  tw = (t*(0.45+(0.006*t*sqrt(p/1060.0))));  
    thom = 0.4*(t+tw)+4.8;
    return TwoDec(thom);
}


function temprad(t,rh,rshort,rdiffuse,sunelev,albedo)
{
  if( albedo === undefined ) { albedo = 0.3;};
  
  var temprad;
  var emiair;
  var tsk;
  
  var e = (rh/100.0)*(6.105*Math.exp((t*17.27)/(237.7+t)));
  var sig = 5.67e-8;
  emiair = 0.66 + 0.039 * Math.sqrt(e);
  tsk = t + 273.12;
  var ratio=0.0429*Math.sin(sunelev*rad)+0.345*Math.cos(sunelev*rad);
  var proj=0.308 * Math.cos(rad * (sunelev* (0.998- (Math.pow(sunelev, 2.0) / 50000.0))));
  temprad= Math.pow(273.16 - (emiair * Math.pow(tsk, 4) + (1-albedo) * (rdiffuse) / (sig* 0.97)+(1-albedo) * proj * ratio* ((rshort-rdiffuse)/(sig*0.97))),0.25)- 273.16;
  return temprad;
}

function wbgt(t,rh,wind)
{ 
    var wbgt= 999.9;
    if (rh > 100.1 || rh < 0.0)
        {wbgt=999.9}
    else if (t > 100.0 || t < -100.0)
        {wbgt= 999.9}
    else
    {
        var e = (rh/100.0)*(6.105*exp((t*17.27)/(237.7+t)));
        wbgt = (0.567*t)+(0.393*e)+3.94;
    }
    return wbgt;
}





function  ta_comfort(rh, wind, M,iclo,H)

{
           var  t = 40.0,
                balance,i,C,hr,hc,Rst,WS,Rdyn,Fcl,Psk,pa,Im,Retdyn,w,E,mres,Tex,Cres,
                Ra = 1/9,
                fcl = 1+0.31 * iclo,
                Tsk =35.7 - .0285 * M - 3;
           if (H == -999.0)
                 {Tsk = 35.7 - 0.0285 * M};

           Rst = iclo * .155 + Ra / fcl;
           WS = .0052 * (M - 58);
           if  (WS > 0.7) { WS = 0.7};
           corr = Math.exp(0.043 - 0.398 * wind + 0.066 * wind * wind- 0.378 * WS +0.094 * WS * WS);
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

              Psk = .1333 * exp(18.6686 - 4030.183 / (Tsk + 235));
              Pa = rh * .1333 * exp(18.6686 - 4030.183 / (t +235)) / 100;
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
              var Pex = .1333 * exp(18.6686 - 4030.183 / (Tex + 235));
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







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Pressure related functions.

function  p_local(press,topo,temp)

{
     var temp=temp+273; // Formula isometrica di Laplace
     var L=-0.0065; // temperature lapse rate L = -0.0065 K/m
     var R_cost=287.05 ;//gas constant for dry air, J/(kg*degK) = 287.05
     var T0=temp-(L/2)*topo;// sea level standard temperature T0 = 288.15 K
     var p_local= press*exp(-topo*9.81/(R_cost*T0));
     return p_local; 
 
 }

function poda(t,rh,p)
 {
  
  var poda;
  var  vpa = (rh / 100) * 6.105 * pow(2.718281828, ( 17.27*t / ( 237.7 + t ) ));
  poda = 80.51 * p / (t + 273.15) * (1.0 - vpa / p);
  return poda;
}

function mbtoinHG(mb)
			{
				var inHG;
				inHG = 0.0295300*mb;
				return inHG;
			}
			
function mbtommHG(mb)
			{
				var mmHG;
				mmHG = 0.750062*mb;
				return mmHG;
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
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility related functions.

function compass_16(direction) {
  var dir = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE",
             "SSE", "S", "SSW", "SW", "WSW", "W", "WNW",
            "NW", "NNW"];
  var dirint=(((direction+11.25)/22.5));							   
  return(dir[parseInt(dirint % 16)])
}



function compass_8(direction) {
  var dir = ["N",  "NE", "E",  "SE",
             "S",  "SW", "W", "NW"];
  var dirint=(((direction+22.5)/45));							   
  return(dir[parseInt(dirint % 8)])
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
  

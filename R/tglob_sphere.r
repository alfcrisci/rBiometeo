#' Tglob_sphere
#'
#' Calculate the globe temperature having diamter. The author of procedure is James C. Liljegren Decision and Information Sciences Division Argonne National Laboratory.
#' 
#'
#' @param numeric t Air temperature in Celsius Degrees.a
#' @param numeric rh Air Relative humidity in %.
#' @param numeric speed Mean Wind speed in meter per seconds [m/s].
#' @param numeric pair Air pressure in millibar [hPa].
#' @param numeric solar Global solar radionatino in W/mq.
#' @param numeric diam Diameter of the sphere in meters. Input example 0.05 = 50 mm.
#' @param numeric fdir Fraction on 1 of direct solar respect to global.
#' @param numeric zenith Zenith angle.
#' @param numeric albedo Mean albedo of surroundings.
#' @return 
#' 
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @references Liljegren J, Carhart R, Lawday P, Tschopp S, Sharp R (2008)  "Modeling Wet Bulb Globe Temperature using Standard Meteorological Measurements" Journal of Occupational and Environmental Hygiene 5: 645-655 \link{www.climatechimp.org}. 
#' @keywords Globometric temperature, sphere.
#' 
#' @export
#'
#'
#'
#'

Tglob_sphere=function(t,rh,speed,solar,diam,fdir,zenith,albedo) {
                         ct$assign("ta", as.array(ta))
                         ct$assign("rh", as.array(rh))
                         ct$assign("speed", as.array(speed))
                         ct$assign("pair", as.array(speed))
                         ct$assign("solar", as.array(solar))
                         ct$assign("fdir", as.array(fdir))
                         ct$assign("zenith", as.array(zenith))
                         ct$assign("diam", as.array(diam))
                         ct$assign("alb_sfc", as.array(albedo))
                         
                        
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=Tglob_sphere(ta[i],rh[i],speed[i],pair[i],solar[i],diam[i],fdir[i],zenith[i],alb_sfc[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


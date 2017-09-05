#' Tglob_sphere
#'
#' Calculate the globe temperature having sphere diameter. The author of procedure is James C. Liljegren Decision and Information Sciences Division Argonne National Laboratory.
#' 
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric wind Mean Wind speed in meter per second.
#' @param numeric solar Global solar radiation in Watt per mq.
#' @param numeric pair Air pressure in millibar or hPa.
#' @param numeric fdir Fraction on 1 of direct solar respect to global.
#' @param numeric zenith Zenith angle in decimal degrees.
#' @param numeric diam Diameter of the sphere in meters. Input example 0.05 = 50 mm.
#' @param numeric albedo Mean albedo of surroundings.
#' @return 
#' 
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @references Liljegren J, Carhart R, Lawday P, Tschopp S, Sharp R,2008, "Modeling Wet Bulb Globe Temperature using Standard Meteorological Measurements" Journal of Occupational and Environmental Hygiene 5, 645-655. 
#' @keywords Globometric temperature, sphere.
#' 
#' @export
#'
#'
#'
#'

Tglob_sphere=function(t,rh,wind,solar,pair,diam,fdir,zenith,albedo) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("speed", as.array(wind))
                         ct$assign("solar", as.array(solar))
                         ct$assign("pair", as.array(pair))
                         ct$assign("fdir", as.array(fdir))
                         ct$assign("zenith", as.array(zenith))
                         ct$assign("diam", as.array(diam))
                         ct$assign("alb_sfc", as.array(albedo))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=Tglob_sphere(t[i],rh[i],speed[i],solar[i],pair[i],alb_sfc[0],diam[0],fdir[0],zenith[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


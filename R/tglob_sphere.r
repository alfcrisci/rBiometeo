#' tglob_sphere
#'
#' Calculate the globe temperature having the sphere diameter. The code is based on the work James C. Liljegren Decision and Information Sciences Division Argonne National Laboratory.
#' 
#'
#' @param numeric t Air temperature in Celsius degrees
#' @param numeric rh Air Relative humidity in percentage
#' @param numeric wind Mean Wind speed in meter per second
#' @param numeric solar Global solar radiation in Watt on mq
#' @param numeric zenith Zenith angle in decimal degrees
#' @param numeric pair Air pressure in millibar or hPa. Default 1010 hPa
#' @param numeric fdir Ratio of directed solar respect to the diffuse.Default is 0.8
#' @param numeric diam Diameter of the sphere in meters. Input example 0.05 = 50 mm
#' @param numeric albedo Mean albedo of surroundings. Default is 0.4 
#' @return 
#' 
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @references Liljegren J, Carhart R, Lawday P, Tschopp S, Sharp R,2008, "Modeling Wet Bulb Globe Temperature using Standard Meteorological Measurements" Journal of Occupational and Environmental Hygiene 5, 645-655. 
#' @keywords Globometric temperature.
#' 
#' @export
#'
#'
#'
#

tglob_sphere=function(t,rh,wind,solar,zenith=0,pair=1010,diam=0.05,fdir=0.8,albedo=0.4) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("speed", as.array(wind))
                         ct$assign("solar", as.array(solar))
                         ct$assign("pair", as.array(pair))
                         ct$assign("fdir", as.array(fdir))
                         ct$assign("zenith", as.array(zenith))
                         ct$assign("diam", as.array(diam))
                         ct$assign("alb_sfc", as.array(albedo))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=tglob_sphere(t[i],rh[i],speed[i],solar[i],pair[i],alb_sfc[i],diam[0],fdir[0],zenith[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


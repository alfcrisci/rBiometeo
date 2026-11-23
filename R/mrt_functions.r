#' mrt_thorsson
#'
#' Mean radiant temperature from globe temperature with the convection coefficients of Thorsson et al. (2007).
#'
#' @param t numeric air temperature in degC.
#' @param tg numeric globe temperature in degC.
#' @param wind numeric windspeed in meter per second.
#' @param diam numeric diameter of the globe in meters (e.g. 0.15 for the standard globe).
#' @return Mean Radiant temperature in degC
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @references Thorsson et al, Different methods for estimating the mean radiant temperature in an outdoor urban setting, Int. J. Climatol.27  1983   1993 (2007)
#' @keywords  MRT 
#' 
#' @export
#'
#'
#'
#'

mrt_thorsson=function(t,tg,wind,diam=0.15) {
                         ct$assign("t", as.array(t))
                         ct$assign("tg", as.array(tg))
                         ct$assign("wind", as.array(wind))
                         ct$assign("diam", as.array(diam))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=mrt_thorsson(t[i],tg[i],wind[i],diam[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

#' mrt_globe
#'
#' Mean radiant temperature from globe temperature according to ISO 7726 (1998), with the convective coefficient as the
#' larger of forced and natural convection.
#'
#' @param t numeric air temperature in degC.
#' @param tg numeric globe temperature in degC.
#' @param wind numeric windspeed in meter per second.
#' @param diam numeric diameter of the globe in meters (e.g. 0.05 for a 50 mm globe).
#' @return Mean Radiant temperature in degC
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords  globe temperature 
#' 
#' @export
#'
#'
#'
#'

mrt_globe=function(t,tg,wind,diam=0.05) {
                         ct$assign("t", as.array(t))
                         ct$assign("tg", as.array(tg))
                         ct$assign("wind", as.array(wind))
                         ct$assign("diam", as.array(diam))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=mrt_globe(t[i],tg[i],wind[i],diam[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


#' mrt_solar_proj
#'
#' Calculated the mean radiant temperature from the short solar irradiance with human projection factor. it assumes a uniform surround temperature of air temperature  and short wave solar radiation.
#'
#' @param t numeric        Air temperature in degC.
#' @param rh numeric       Relative humidity in percentage.
#' @param solar  numeric   Global solar radiation in Watt on mq.
#' @param sunelev numeric  Sun elevation angle in decimal degrees.
#' @param alb_sfc numeric  Mean albedo of surroundings. Default is 0.3.
#' @param emis_sfc numeric Surface emissivity. Default is 0.97.
#' @param fdir numeric    Fraction of direct radiation in the global radiation. Default is 0.8.
#' @return Mean Radiant temperature projected in degC.
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords  fMRT 
#' 
#' @export
#'
#'
#'
#'

mrt_solar_proj=function(t,rh,solar,sunelev,alb_sfc=0.3,fdir=0.8,emis_sfc=0.97) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("solar", as.array(solar))
                         ct$assign("sunelev", as.array(sunelev))
                         ct$assign("albedo", as.array(alb_sfc))
                         ct$assign("emis_sfc", as.array(emis_sfc))
                         ct$assign("fdir", as.array(fdir))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=mrt_solar_proj(t[i],rh[i],solar[i],sunelev[i],albedo[0],emis_sfc[0],fdir[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




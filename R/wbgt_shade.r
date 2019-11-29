#' wbgt_shade
#'
#' Calculate wet bulb globe temperature index for outdoor shaded environements.
#' 
#
#' @param t    numeric Air temperature in degC.
#' @param rh   numeric Relative humidity in percentage.
#' @param wind numeric Mean Wind speed in meters per second.
#' @param solar numeric  Solar Radiation Radiance in Watt./mq
#' @param pair numeric Air pressure in millibar or hPa. Default 1010 hPa.
#' @param elev numeric Elevation in meters on sea level. Default is 0.
#
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  wbgt, shade
#' 
#' @export
#'
#'
#'
#'

wbgt_shade=function(t,rh,wind,solar=10,pair=1010,elev=0) {
                                                         ct$assign("t", as.array(t))
                                                         ct$assign("rh", as.array(rh))
                                                         ct$assign("wind", as.array(wind))
                                                         ct$assign("solar", as.array(solar))
                                                         ct$assign("press", as.array(pair))
                                                         ct$assign("elev", as.array(elev))
                                                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbgt_shade(t[i],rh[i],wind[i],solar[i],press[0],elev[0])};")
                                                         res=ct$get("res")
                                                         return(ifelse(res==9999,NA,res))
}

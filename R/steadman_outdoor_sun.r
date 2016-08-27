#' steadman_outdoor_sun
#'
#' Computes Steadman's apparent temperature under sunny outdoor conditions.
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param numeric  wind Wind speed in meteronseconds ms
#' @param rshort Global short radiation in W/mq.
#' @param sunelev Sun elevation in degrees.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  Steadman, Apparente temperature
#' 
#' @export
#'
#'
#'
#'

steadman_outdoor_sun=function(t,rh,wind,rshort,sunelev) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("rshort", as.array(rshort))
                         ct$assign("sunelev", as.array(rshort))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=steadman_outdoor_sun(t[i],rh[i],wind[i],rshort[i],sunelev[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


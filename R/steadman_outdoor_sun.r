#' steadman_outdoor_sun
#'
#' Computes Steadman's apparent temperature under sunny outdoor conditions.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric  wind Wind speed in meter per second.
#' @param rshort Global short radiation in Watt per mq.
#' @param sunelev Sun elevation in degrees.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  steadman, Apparent temperature, Sunny
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
                         ct$assign("sunelev", as.array(sunelev))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=steadman_outdoor(t[i],rh[i],wind[i],rshort[i],sunelev[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


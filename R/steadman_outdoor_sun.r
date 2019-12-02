#' steadman_outdoor_sun
#'
#' Computes Steadman's apparent temperature under sunny outdoor conditions.
#'
#' @param t numeric       Air temperature in degC.
#' @param rh numeric      Relative humidity in percentage.
#' @param wind numeric    Wind speed in meters per second.
#' @param rshort numeric  Global short radiation in Watt/mq.
#' @param sunelev numeric Sun elevation in degrees.
#' @return steadman outdoor index
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
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


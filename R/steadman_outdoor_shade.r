#' steadman_outdoor_shade
#'
#' Computes Steadman's apparent temperature under shaded outdoor conditions.
#'
#' @param t numeric     Air temperature in Celsius degrees.
#' @param rh numeric    Relative humidity in percentage.
#' @param wind numeric  Wind speed in meters per second.
#' @return Apparent temperature index.
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  Steadman, outdoor, shade, apparent temperature.
#' 
#' @export
#'
#'
#'
#'

steadman_outdoor_shade=function(t,rh,wind) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=steadman_outdoor_shade(t[i],rh[i],wind[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


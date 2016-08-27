#' steadman_outdoor_shade
#'
#' Computes Steadman's apparent temperature under shade outdoor conditions.
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param numeric  wind Wind speed in meteronseconds ms
#' @return Apparent temperature index.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  Steadman,outdoor,shade,Apparent Temeperature.
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


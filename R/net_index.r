#' net_index
#'
#' Net effective temperature (NET) incorporates ambient temperature, wind speed, and relative humidity and is used in both hot and cold situations.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric  wind Windspeed in meter per second.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  net_index 
#' @references Cho KLA, Margaret Loughnan M, and Tapper T,2013, An Exploration of Temperature Metrics for Further Developing the Heat-Health Weather Warning System in Hong Kong.

#' @export
#'
#'
#'
#'

net_index=function(t,rh,wind) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=net_index(t[i],rh[i],wind[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


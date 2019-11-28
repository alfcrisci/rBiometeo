#' net_index
#'
#' Calculate the Net Effective Temperature (NET) incorporating ambient temperature in degC , wind speed (m/s), and relative humidity (%). It is used in  hot and cold situations.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage (%).
#' @param wind numeric Windspeed in meters per second.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}#' @keywords  net_index 
#' @references Cho KLA, Margaret Loughnan M, and Tapper T, 2013, An Exploration of Temperature Metrics for Further Developing the Heat-Health Weather Warning System in Hong Kong.
#' @export
#'
#'
#'
#'

net_index=function(t, rh, wind) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=net_index(t[i],rh[i],wind[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


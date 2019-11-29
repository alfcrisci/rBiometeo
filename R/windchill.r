#' windchill
#'
#' Calculates the NWS Windchill Temperature (WCT) to estimate the perceived temperature with wind in cold environemnt.
#'
#' @param t numeric Air temperature in degC.
#' @param wind numeric Windspeed in meters per second.
#' @return windchill index
#' 
#' @references Windchill NOAA calculator \url{https://www.weather.gov/epz/wxcalc_windchill}
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  windchill index in degC.
#' 
#' @export
#'
#'
#'
#'

windchill=function(t,wind) {
                         ct$assign("t", as.array(t))
                         ct$assign("v", as.array(wind))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=windchill(t[i],v[i])};")
                         res=ct$get("res")
                         return(ifelse(!is.numeric(res),NA,res))
}




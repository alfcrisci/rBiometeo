#' windchill_cla
#'
#' Calculates the risk class of Windchill index.
#'
#' @param t numeric    Air temperature in degC.
#' @param wind numeric Windspeed in meters per second.
#' @return windchill index in degC
#' 
#' @references Windchill Tables \url{https://www.canada.ca/en/environment-climate-change/services/weather-health/wind-chill-cold-weather/wind-chill-index.html}
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  windchill classes
#' 
#' @export
#'
#'
#'
#'

windchill_cla=function(t,wind) {
                         ct$assign("t", as.array(t))
                         ct$assign("v", as.array(wind))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=windchill_cla(t[i],v[i])};")
                         res=ct$get("res")
                         return(ifelse(!is.numeric(res),NA,res))
}




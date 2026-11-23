#' windchill_cla
#'
#' Wind chill risk class (Environment and Climate Change Canada) on the rounded wind chill temperature: 1 no risk (>= 1),
#' 2 low (0 to -9), 3 moderate (-10 to -27), 4 high (-28 to -39), 5 very high (-40 to -47), 6 severe (-48 to -54),
#' 7 extreme (<= -55). Labels: windchill_class_text.
#'
#' @param t numeric    Air temperature in degC.
#' @param wind numeric Windspeed in meters per second.
#' @return class 1-7
#' 
#' @references Windchill Tables \url{https://www.canada.ca/en/environment-climate-change/services/weather-health/wind-chill-cold-weather/wind-chill-index.html}
#'
#' @author  Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
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
                         return(res)
}




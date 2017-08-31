#' windchill
#'
#' Calculates the NWS Windchill Temperature (WCT) to estimate the perceived temperature with wind in cold environemnt.Assumes no impact from the sun and having own face model.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric windspeed Windspeed in meter per seconds [m/s].
#' @return Windchill
#' @references New Windchill NOAA calculator \url{http://www.srh.noaa.gov/epz/?n=wxcalc_windchill}
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  windchill, WCT
#' 
#' @export
#'
#'
#'
#'

windchill=function(t,v) {
                         ct$assign("t", as.array(t))
                         ct$assign("v", as.array(windspeed))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=windchill_new(t[i],v[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




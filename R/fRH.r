#' fRH
#'
#' Return relative humidity from air temperature (Celsius) and Dew point (Celsius);
#'
#' @param tair numeric Vector or value of air temperature in Celsius degree.
#' @param dewp numeric Vector or value of dew point temperature in Celsius degree.
#' @return res numeric  relative humidity value
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  Relative humidity 
#' 
#' @export
#'
#'
#'
#'

fRH=function(tair,dewp) {
                         ct$assign("t", as.array(tair))
                         ct$assign("td", as.array(dewp))
                         ct$eval("var rel=[]; for(var i=0, len=t.length; i < len; i++){ rel[i]=fRH(t[i], td[i])};")
                         return(ct$get("rel"))
}

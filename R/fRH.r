#' fRH
#'
#' Return relative humidity from air temperature (Celsius) and Dew point (Celsius);
#'
#' @param t numeric Vector or value of air temperature in Celsius degree.
#' @param td numeric Vector or value of dew point temperature in Celsius degree.
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

fRH=function(t,td) {
                         ct$assign("t", as.array(t))
                         ct$assign("td", as.array(td))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=fRH(t[i], td[i])};")
                         return(ct$get("res"))
}

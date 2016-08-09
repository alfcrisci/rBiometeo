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
#


fRH=function(tair,dewp) {
                        temp=cbind(tair,dewp)
                        res=apply(temp,1, function(x) ct$call("fRH",x[1],x[2]))
                        return(res)
}

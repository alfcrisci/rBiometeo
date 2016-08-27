#' frostime
#'
#' Given a temperature t (Celsius) and wind ( m/sec) frost time following Wind Chill Frostbite Chart.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric  wind The wind speed in meter per seconds [m/s].
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  frostime 
#' @references ISO 9920:2007 Ergonomics of the thermal environment -- Estimation of thermal insulation and water vapour resistance of a clothing ensemble.
#' @export
#'
#'
#'
#'

frostime=function(t,wind) {
                         ct$assign("t", as.array(t))
                         ct$assign("wind", as.array(wind))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=frostime(t[i],wind[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




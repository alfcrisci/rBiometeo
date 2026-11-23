#' frostime
#'
#' Facial frostbite time in minutes (Tikuisis & Osczevski, 2003). Wind is given in m/s and converted to km/h, the unit of the
#' original equation (since version 0.4; before it was used as km/h by mistake). NA outside -60 <= t <= -10 degC.
#'
#' @param t numeric Air temperature in Celsius degrees.
#' @param wind numeric the wind speed in meter per seconds [m/s].
#' @return frostbite time in minutes
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  frostime 
#' @references Tikuisis P., Osczevski R.J. (2003). Facial cooling during cold air exposure. Bull. Amer. Meteor. Soc. 84: 927-933.
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




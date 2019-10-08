#' wetbulb
#'
#' DESCRIPTION
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric press  Air pressure in hPa or millibar.
#' @return Wet bulb temperature in Celsius degrees.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  wetbulb 
#' @references  Brice, T., and T. Hall, 2013: The weather calculator. Available online at \url{https://www.weather.gov/epz/wxcalc}.
#' @export
#'
#'
#'
#'

wetbulb=function(t,rh,press=NULL) {
                         if (is.null(press)) {press=1013.25}
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("pa", as.array(press))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wetbulb(t[i],rh[i],pa[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


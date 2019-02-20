#' wetbulb
#'
#' DESCRIPTION
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric pa  Air pressure in hPa or millibar.
#' @param Wet bulb temperature in Celsius degrees.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  wetbulb 
#' @references Brice T, Hall T,2009, Wet-bulb calculator.
#' @export
#'
#'
#'
#'

wetbulb=function(t,rh,pa=NULL) {
                         if (is.null(pa)) {pa=101.3}
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("pa", as.array(pa))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wetbulb(t[i],rh[i],pa[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


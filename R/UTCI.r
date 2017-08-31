#' UTCI
#'
#' Calculate Universal Thermal Climate Index ( UTCI) index.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric wind Wind speed in meter per second.
#' @param numeric tr Mean radiant temperature in Celsius degrees
#' @return UTCI
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  UTCI 
#' @references Bröde P, Jendritzky G, Fiala D and Havenith G, 2011, The Universal Thermal Climate Index UTCI in Operational Use"  International Journal of Biometeorology.
#' @export
#'
#'
#'
#'

UTCI=function(ta,rh,wind,tr) {
                         ct$assign("ta", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("tmrt", as.array(tr))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=UTCI(ta[i],rh[i],wind[i],tmrt[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


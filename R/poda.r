#' poda
#'
#' Calculate partial pressure of oxygen in function of altitude.
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param p Local air pressure in hPa [millibar].
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  poda, oxygen, altitude.
#' 
#' @export
#'
#'
#'
#'

poda=function(t,rh,p) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("p", as.array(p))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){res[i]=poda(t[i],rh[i],p[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


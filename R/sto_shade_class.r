#' sto_shade_class
#'
#' Computes the correspondent Steadman's apparent temperature class in shaded conditions.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage
#' @param numeric  wind Wind speed in meter per seconds [m/s]
#' @return Class of Apparent temperature.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  class, shade, apparent temperature.
#' 
#' @export
#'
#'
#'
#'

sto_shade_class=function(t,rh,wind) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=sto_shade_class(t[i],rh[i],wind[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


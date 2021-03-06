#' poda
#'
#' Calculate the partial pressure of oxygen in function of altitude.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Air Relative humidity in percentage.
#' @param pair numeric Local air pressure in hPa.
#' @return partial pressure of oxygen
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  poda, oxygen, altitude.
#' 
#' @export
#'
#'
#'
#'

poda=function(t,rh,pair) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("p", as.array(pair))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){res[i]=poda(t[i],rh[i],p[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


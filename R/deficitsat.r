#' deficitsat
#'
#' Computes saturation deficit in hPa. This is air dryness evaluation.
#'
#' @param t  numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @return 
#'
#'
#' @author     Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' 
#' @export
#'
#'
#'
#'

deficitsat=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=deficitsat(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




#' vpaTorr
#'
#' Calculate water vapor pressure in torr.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  vpaTorr 
#' 
#' @export
#'
#'
#'
#'

vpaTorr=function(T) {
                         ct$assign("T", as.array(t))
                         ct$eval("var res=[]; for(var i=0, len=T.length; i < len; i++){ res[i]=vpaTorr(T[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


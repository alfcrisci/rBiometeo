#' utci_class
#'
#' Calculate the (10-fold) thermal class of Universal Thermal Climate Index ( UTCI) index.
#'
#' @param t numeric  Air temperature in degC
#' @param rh numeric  Air Relative humidity in percentage
#' @param wind numeric  Wind speed in meters per second
#' @param tmrt numeric  Mean radiant temperature in degC.
#' @return UTCI class
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  UTCI 
#' @references Brode P, Jendritzky G , Fiala D and Havenith G , 2011, The Universal Thermal Climate Index UTCI in Operational Use".International Journal of Biometeorology.
#' 
#'
#'
#' @export
#'

utci_class<-function(t,rh,wind,tmrt) {
  ct$assign("t", as.array(t))
  ct$assign("rh", as.array(rh))
  ct$assign("wind", as.array(wind))
  ct$assign("tmrt", as.array(tmrt))
  ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=utci_class(t[i],rh[i],wind[i],tmrt[i])};")
  res=ct$get("res")
  return(ifelse(res==9999,NA,res))
}


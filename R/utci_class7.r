#' utci_class7
#'
#' Calculate seven thermal classes of Universal Thermal Climate Index  UTCI index.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric  wind Wind speed in meter per second.
#' @param numeric tmrt Mean radiant temperature in Celsius degrees.
#' @return UTCI index in Celsius degrees.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  UTCI 
#' @references Bröde P,Jendritzky G,Fiala D and Havenith G, 2011,The Universal Thermal Climate Index UTCI in Operational Use".International Journal of Biometeorology.
#' @export
#'
#'
#'
#'

utci_class7=function(t,rh,wind,tmrt) {
                         if ( is.na(t) || is.na(rh)) {res=NA;return(res);}  
                         if (is.na(tmrt)) {tmrt=t};
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("tmrt", as.array(tmrt))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=utci_class7(t[i],rh[i],wind[i],tmrt[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


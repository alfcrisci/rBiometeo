#' utci_class
#'
#' Calculate ten (10) thermal class of Universal Thermal Climate Index ( UTCI) index.
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
#' @references Brode P,Jendritzky G,Fiala D and Havenith G, 2011,The Universal Thermal Climate Index UTCI in Operational Use".International Journal of Biometeorology.
#' 
#'
#'
#' @export
#'

utci_class<-function(t,rh,wind,tmrt) {
                         utci_index=utci(t,rh,wind,tmrt);
                         res=ifelse(is.na(utci_index),
                                    NA,
                                    as.numeric(cut(utci_index, c(-100,-40,-26.99,-12.99,0.01,9.01,26.01,32.01,38.01,46.01,100),right=T,label=c(1:10)))
                                    )
                         return(res)
}


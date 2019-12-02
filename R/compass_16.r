#' compass_16
#'
#' Calculate the wind sector (16 partition) provenience.  
#'
#' @param direction numeric   Directions in degrees from the North.
#' @return sector character
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' 
#' @export
#'
#'
#'
#'

compass_16=function(direction) {
                         ct$assign("direction", as.array(direction))
                         ct$eval("var res=[]; for(var i=0, len=direction.length; i < len; i++){ res[i]=compass_16(direction[i])};")
                        res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


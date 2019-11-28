#' compass_16
#'
#' Calculate the wind sector (16 partition) provenience.  
#'
#' @param direction numeric   Directions in degrees from the North.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  compass_16 
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


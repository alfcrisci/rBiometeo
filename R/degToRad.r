#' degToRad
#'
#' Conversion of decimal degrees to radians.
#'
#' @param numeric angleDeg Angle in decimal degrees.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  degToRad 
#' 
#' @export
#'
#'
#'
#'

degToRad=function(angleDeg) {
                         ct$assign("angleDeg", as.array(angleDeg))
                         ct$eval("var res=[]; for(var i=0, len=angleDeg.length; i < len; i++){ res[i]=degToRad(angleDeg[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


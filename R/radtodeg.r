#' radtodeg
#'
#' Conversion angles from radians of an angle in decimal degrees 
#'
#' @param anglerad  numeric  Angle in radiands.
#' @return angledeg in degrees
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  radtodeg 
#' 
#' @export
#'
#'
#'
#'

radtodeg=function(anglerad) {
                         ct$assign("anglerad", as.array(anglerad))
                         ct$eval("var res=[]; for(var i=0, len=anglerad.length; i < len; i++){ res[i]=radToDeg(angleRad[i])};")
                         res=ct$get("res")
                         return(ifelse(!is.numeric(res),NA,res))
}


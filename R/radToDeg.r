#' radToDeg
#'
#' Conversion the radians of an angle in decimal degrees. 
#'
#' @param numeric angleRad  Angle in radiands.
#' @return angleDeg in degrees.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  radToDeg 
#' 
#' @export
#'
#'
#'
#'

radToDeg=function(angleRad) {
                         ct$assign("angleRad", as.array(angleRad))
                         ct$eval("var res=[]; for(var i=0, len=angleRad.length; i < len; i++){ res[i]=radToDeg(angleRad[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


#' compass_16
#'
#' Calculate thewind sector (16 partition)  of its provenience.  
#'
#' @param numeric  direction Directions in degrees from the North ( meteorological) .
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
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


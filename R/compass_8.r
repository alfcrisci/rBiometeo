#' compass_8
#'
#' Calculate the  wind sector (8 partition)  of its provenience.  
#'
#' @param numeric  direction Directions in degrees from the North.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  compass_8 
#' 
#' @export
#'
#'
#'
#'

compass_8=function(direction) {
                         ct$assign("direction", as.array(direction))
                         ct$eval("var res=[]; for(var i=0, len=direction.length; i < len; i++){ res[i]=compass_8(direction[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


#' knots2mph
#'
#' Conversion from knots per second to miles per hour.
#'
#' @param knots numeric  Speed in knots per second.
#' @return miles per hour
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  knots2mph 
#' 
#' @export
#'
#'
#'
#'

knots2mph=function(knots) {
                         ct$assign("knots", as.array(knots))
                         ct$eval("var res=[]; for(var i=0, len=knots.length; i < len; i++){ res[i]=knots2mph(knots[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


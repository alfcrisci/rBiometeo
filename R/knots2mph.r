#' knots2mph
#'
#' Conversion from knot per second to mile per hour.
#'
#' @param numeric  knots Speed in knot per second.
#' @return 
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
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


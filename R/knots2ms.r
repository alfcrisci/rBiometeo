#' knots2ms
#'
#' Conversion from feet per second to meter per second.
#'
#' @param numeric  knots Speed in knot per second.
#' @return 
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  knots2ms 
#' 
#' @export
#'
#'
#'
#'

knots2ms=function(knots) {
                         ct$assign("knots", as.array(knots))
                         ct$eval("var res=[]; for(var i=0, len=knots.length; i < len; i++){ rel[i]=knots2ms(knots[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


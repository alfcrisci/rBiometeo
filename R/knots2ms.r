#' knots2ms
#'
#' Conversion from feet per second to meters per second.
#'
#' @param knots numeric  Speed in knots per second.
#' @return meters per second
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
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


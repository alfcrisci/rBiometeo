#' knots2kmh
#'
#' Conversion from knot per second to kilometers per hour.
#'
#' @param knots numeric  Speed in knots per second.
#' @return kilometers per hour
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  knots2kmh 
#' 
#' @export
#'
#'
#'
#'

knots2kmh=function(knots) {
                         ct$assign("knots", as.array(knots))
                         ct$eval("var res=[]; for(var i=0, len=knots.length; i < len; i++){ res[i]=knots2kmh(knots[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


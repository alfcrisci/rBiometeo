#' knots2fts
#'
#' Conversion from knot per second to feet per second.
#'
#' @param numeric  knots Speed in knot per second.
#' @return 
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  knots2fts 
#' 
#' @export
#'
#'
#'
#'

knots2fts=function(knots) {
                         ct$assign("knots", as.array(knots))
                         ct$eval("var res=[]; for(var i=0, len=knots.length; i < len; i++){ rel[i]=knots2fts(knots[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


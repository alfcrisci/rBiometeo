#' knots2fts
#'
#' Conversion from knots per second to feets per second.
#'
#' @param knots numeric  Speed in knots per second.
#' @return feets per second
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
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


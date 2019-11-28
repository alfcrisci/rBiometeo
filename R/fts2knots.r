#' fts2knots
#'
#' Conversion from feet per second to knot per second.
#'
#' @param fts numeric  Speed in feets per second.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  fts2knots 
#' 
#' @export
#'
#'
#'
#'

fts2knots=function(fts) {
                         ct$assign("fts", as.array(fts))
                         ct$eval("var res=[]; for(var i=0, len=fts.length; i < len; i++){ res[i]=fts2knots(fts[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


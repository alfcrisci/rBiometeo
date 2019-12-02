#' fts2knots
#'
#' Conversion from feet per second to knots per second.
#'
#' @param fts numeric  Speed in feets per second.
#' @return knots per second
#'
#'
#' @author  Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
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


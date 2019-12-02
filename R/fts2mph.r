#' fts2mph
#'
#' Conversion from feet per second to miles per hour.
#'
#' @param fts numeric  Speed in feets per second.
#' @return miles per hour
#'
#'
#' @author  Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  fts2mph 
#' 
#' @export
#'
#'
#'
#'

fts2mph=function(fts) {
                         ct$assign("fts", as.array(fts))
                         ct$eval("var res=[]; for(var i=0, len=fts.length; i < len; i++){ res[i]=fts2mph(fts[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


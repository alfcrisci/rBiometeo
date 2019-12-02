#' fts2kmh
#'
#' Conversion speed in feet per second to kilometers per hour.
#'
#' @param fts numeric  Speed in feets per second.
#' @return kilometers per hour
#'
#'
#' @author  Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  fts2kmh 
#' 
#' @export
#'
#'
#'
#'

fts2kmh=function(fts) {
                         ct$assign("fts", as.array(fts))
                         ct$eval("var res=[]; for(var i=0, len=fts.length; i < len; i++){ res[i]=fts2kmh(fts[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


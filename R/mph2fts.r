#' mph2fts
#'
#' Conversion speed in  miles per hour to feets per second. 
#'
#' @param mph numeric  Speed miles per hour.
#' @return feets per second
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  mph2fts 
#' 
#' @export
#'
#'
#'
#'

mph2fts=function(mph) {
                         ct$assign("mph", as.array(mph))
                         ct$eval("var res=[]; for(var i=0, len=mph.length; i < len; i++){ res[i]=mph2fts(mph[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


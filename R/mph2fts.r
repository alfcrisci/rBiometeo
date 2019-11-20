#' mph2fts
#'
#' Conversion speed in  miles per hour to feet per second. 
#'
#' @param numeric  mph Speed mile per hour.
#' @return 
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
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


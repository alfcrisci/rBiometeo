#' mph2kmh
#'
#' Conversion speed in  miles per hour to kilometers per hour. 
#'
#' @param mph numeric  Speed miles per hour.
#' @return kilometers per hour
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  mph2kmh 
#' 
#' @export
#'
#'
#'
#'

mph2kmh=function(mph) {
                         ct$assign("mph", as.array(mph))
                         ct$eval("var res=[]; for(var i=0, len=mph.length; i < len; i++){ res[i]=mph2kmh(mph[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


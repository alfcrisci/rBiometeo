#' mph2ms
#'
#' Conversion miles per hour in meters per second.
#'
#' @param mph numeric  Speed miles per hour.
#' @return meters per second
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  mph2ms 
#' 
#' @export
#'
#'
#'
#'

mph2ms=function(mph) {
                         ct$assign("mph", as.array(mph))
                         ct$eval("var res=[]; for(var i=0, len=mph.length; i < len; i++){ res[i]=mph2ms(mph[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


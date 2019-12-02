#' mph2knots
#'
#' Conversion speed in  miles per hour to knots per second. 
#'
#' @param mph numeric  Speed miles per hour.
#' @return knots per second
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  mph2knots 
#' 
#' @export
#'
#'
#'
#'

mph2knots=function(mph) {
                         ct$assign("mph", as.array(mph))
                         ct$eval("var res=[]; for(var i=0, len=mph.length; i < len; i++){ res[i]=mph2knots(mph[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


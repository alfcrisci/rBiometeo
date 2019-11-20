#' mph2ms
#'
#' Conversion miles per hour in meter per second.
#'
#' @param numeric  mph Speed in miles on hours.
#' @return 
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
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


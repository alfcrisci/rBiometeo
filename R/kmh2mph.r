#' kmh2mph
#'
#' Conversion kilometer per hour to miles per hour.
#'
#' @param kmh numeric  Speed in Kilometer per hours.
#' @return miles per hour
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  kmh2mph 
#' 
#' @export
#'
#'
#'
#'

kmh2mph=function(kmh) {
                         ct$assign("kmh", as.array(kmh))
                         ct$eval("var res=[]; for(var i=0, len=kmh.length; i < len; i++){ res[i]=kmh2mph(kmh[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


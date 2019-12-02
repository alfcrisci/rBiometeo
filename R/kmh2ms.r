#' kmh2ms
#'
#' Conversion from kilometers per hour to meters per second.
#'
#' @param kmh numeric  Speed kilometer per hour.
#' @return meters per second
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  kmh2ms 
#' 
#' @export
#'
#'
#'
#'

kmh2ms=function(kmh) {
                         ct$assign("kmh", as.array(kmh))
                         ct$eval("var res=[]; for(var i=0, len=kmh.length; i < len; i++){ res[i]=kmh2ms(kmh[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


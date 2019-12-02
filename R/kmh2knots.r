#' kmh2knots
#'
#' Conversion from kilometer per hour to knots per second.
#'
#' @param kmh numeric  Speed in kilometer per hour.
#' @return knots per second
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  kmh2knots 
#' 
#' @export
#'
#'
#'
#'

kmh2knots=function(kmh) {
                         ct$assign("kmh", as.array(kmh))
                         ct$eval("var res=[]; for(var i=0, len=kmh.length; i < len; i++){ res[i]=kmh2knots(kmh[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


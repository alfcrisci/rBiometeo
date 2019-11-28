#' kmh2fts
#'
#' Conversion from kilometer per hour to feet per second.
#'
#' @param kmh numeric  Speed in kilometer per hour.
#' @return 
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  kmh2fts 
#' 
#' @export
#'
#'
#'
#'

kmh2fts=function(kmh) {
                         ct$assign("kmh", as.array(kmh))
                         ct$eval("var res=[]; for(var i=0, len=kmh.length; i < len; i++){ res[i]=kmh2fts(kmh[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


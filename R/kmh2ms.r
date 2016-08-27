#' kmh2ms
#'
#' Conversion from kilometer per hour to meter per second.
#'
#' @param numeric  kmh Speed kilometer per hour.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
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


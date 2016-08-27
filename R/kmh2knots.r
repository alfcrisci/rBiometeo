#' kmh2knots
#'
#' Conversion from kilometer per hour to knot per second.
#'
#' @param numeric  kmh Speed in kilometer per hour.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
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


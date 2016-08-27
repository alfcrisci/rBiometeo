#' ms2knots
#'
#' Conversion speed meter per second in knot per second.
#'
#' @param numeric   ms Speed in meter per second [m/s].
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  ms2knots 
#' 
#' @export
#'
#'
#'
#'

ms2knots=function(ms) {
                         ct$assign("ms", as.array(ms))
                         ct$eval("var res=[]; for(var i=0, len=ms.length; i < len; i++){ res[i]=ms2knots(ms[i])};")
                        res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


#' ms2knots
#'
#' Conversion speed meter per second in knots per second.
#'
#' @param ms Speed numeric   in meters per second [m/s].
#' @return  knots per second
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
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


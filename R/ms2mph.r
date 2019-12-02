#' ms2mph
#'
#' Conversion speed in meters per second to miles per hour. 
#'
#' @param ms numeric Speed in meters per second.
#' @return  miles per hour
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  ms2mph 
#' 
#' @export
#'
#'
#'
#'

ms2mph=function(ms) {
                         ct$assign("ms", as.array(ms))
                         ct$eval("var res=[]; for(var i=0, len=ms.length; i < len; i++){ res[i]=ms2mph(ms[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


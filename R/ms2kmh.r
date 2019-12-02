#' ms2kmh
#'
#' Conversion speed meter per second  in kilometers per hour.
#'
#' @param ms Speed numeric   in meters per second [m/s].
#' @return kilometers per hour
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  ms2kmh 
#' 
#' @export
#'
#'
#'
#'

ms2kmh=function(ms) {
                         ct$assign("ms", as.array(ms))
                         ct$eval("var res=[]; for(var i=0, len=ms.length; i < len; i++){ res[i]=ms2kmh(ms[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


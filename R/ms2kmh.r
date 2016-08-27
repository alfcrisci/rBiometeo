#' ms2kmh
#'
#' Conversion speed meter per second  in km per hours.
#'
#' @param numeric   ms Speed in meter per second [m/s].
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
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


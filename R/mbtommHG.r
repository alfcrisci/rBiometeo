#' mbtommHG
#'
#' Conversion from Millibar [hPa] to mmHG.
#'
#' @param mb numeric   Air pressure in Millibar [hPa]. 
#' @return mmHG
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  mbtommHG 
#' 
#' @export
#'
#'
#'
#'

mbtommHG=function(mb) {
                         ct$assign("mb", as.array(mb))
                         ct$eval("var res=[]; for(var i=0, len=mb.length; i < len; i++){ res[i]=mbtommHG(mb[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


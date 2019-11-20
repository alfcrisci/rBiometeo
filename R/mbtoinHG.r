#' mbtoinHG
#'
#' Conversion from Millibar [hPa] to inches HG.
#'
#' @param numeric   mb Air pressure in Millibar [hPa] 
#' @return 
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  mbtoinHG 
#' 
#' @export
#'
#'
#'
#'

mbtoinHG=function(mb) {
                         ct$assign("mb", as.array(mb))
                         ct$eval("var res=[]; for(var i=0, len=mb.length; i < len; i++){ res[i]=mbtoinHG(mb[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


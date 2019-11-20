#' fts2kmh
#'
#' Conversion speed in feet per second to kilometer per hour.
#'
#' @param numeric  fts Speed in feet per second.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  fts2kmh 
#' 
#' @export
#'
#'
#'
#'

fts2kmh=function(fts) {
                         ct$assign("fts", as.array(fts))
                         ct$eval("var res=[]; for(var i=0, len=fts.length; i < len; i++){ res[i]=fts2kmh(fts[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


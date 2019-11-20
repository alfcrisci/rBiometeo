#' fts2ms
#'
#' Conversion from feet per second to meter per second.
#'
#' @param numeric  fts Speed in feet per second.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  fts2ms 
#' 
#' @export
#'
#'
#'
#'

fts2ms=function(fts) {
                         ct$assign("fts", as.array(fts))
                         ct$eval("var res=[]; for(var i=0, len=fts.length; i < len; i++){ res[i]=fts2ms(fts[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


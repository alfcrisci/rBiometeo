#' humrat
#'
#' Calculates humidity ratio in vapor-air mixture.
#'
#' @param p numeric  Water pressure in hPa.
#' @param pair numeric Air pressure in hPa.
#' @return humidity ratio
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  humrat 
#' 
#' @export
#'
#'
#'
#'

humrat=function(p,pair) {
                         ct$assign("p", as.array(p))
                         ct$assign("pa", as.array(pair))
                         ct$eval("var res=[]; for(var i=0, len=p.length; i < len; i++){ res[i]=humrat(p[i],pa[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




#' humrat
#'
#' Calculates humidity ratio in vapor-air mixture.
#'
#' @param numeric p Water pressure in hPa.
#' @param numeric pair Air pressure in hPa.
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
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




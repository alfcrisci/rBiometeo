#' torr2p
#'
#' Convert pressure in torr in other unit.
#'
#' @param vp numeric pressure in torr.
#' @param vpunits character  Units available are : "atm","bar","Pa","mbar" (default),"dyne/cm2" and "psi".
#' @return pressure fro torr
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  torr2p 
#' 
#' @export
#'
#'
#'
#'

torr2p=function(vp,vpunits="mbar") {
                         if ( length(vp)>1) {vp=rep(vpunits,length(vp))}
                         ct$assign("vp", as.array(vp))
                         ct$assign("vpunits", as.array(vpunits))
                         ct$eval("var res=[]; for(var i=0, len=vp.length; i < len; i++){ res[i]=torr2p(vp[i],vpunits[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




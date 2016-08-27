#' torr2p
#'
#' Convert pressure in torr in other unit.
#'
#' @param numeric vp pressure in torr.
#' @param character vpunits Unit available are : "atm","bar","Pa","mbar" (default),"dyne/cm2" and "psi".
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
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




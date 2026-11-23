#' wbgt_stull
#'
#' Calculate wet bulb globe temperature index for outdoor environements 
#' by using Stull formulation by using air temperature in degC ,relative humidity , 
#' globometric temperature in degC and air pressure in hPa.
#' 
#
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param tg numeric Globe temperature in degC.
#' @param pair numeric Air pressure in hPa. Not used (kept for compatibility): the Stull wet-bulb formula does not depend on pressure.
#' @return wbgt  in degC
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' 
#' @export
#'
#'
#'
#'

wbgt_stull=function(t,rh,tg,pair=1010) {
                                       ct$assign("t", as.array(t))
                                       ct$assign("rh", as.array(rh))
                                       ct$assign("tg", as.array(tg))
                                       ct$assign("press", as.array(pair))
                                       ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbgt_stull(t[i],rh[i],tg[i])};")
                                        res=ct$get("res")
                                       return(ifelse(res==9999,NA,res))
}

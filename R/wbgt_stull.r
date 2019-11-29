#' wbgt_stull
#'
#' Calculate wet bulb globe temperature index for outdoor environements 
#' by using Stull formulation by using air temperature in degC ,relative humidity , 
#' globometric temperature in degC and air pressure in hPa.
#' 
#
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param tg numeric Solar Radiation Radiance in Watt/mq.
#' @param pair numeric Air Pressure in hPa. Default is 1010.
#' 
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
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
                                       ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbgt_full(t[i],rh[i],tg[i],press[0])};")
                                        res=ct$get("res")
                                       return(ifelse(res==9999,NA,res))
}

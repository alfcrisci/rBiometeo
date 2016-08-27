#' PMV_ISO7730
#'
#' Calculate Predicted Mean Vote (PMV) following ISO 7730.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param numeric wind Windspeed in meter per second [m/s].
#' @param numeric tr Air temperature in Celsius degrees.
#' @param numeric M Metabolic rate of subject [W/mq].
#' @param numeric W Work rate of subject [W/mq].
#' @param numeric clo Clothing insulation level in clo.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords PMV_ISO7730 
#' 
#' @export
#'
#'
#'
#'

PMV_ISO7730=function(t,rh,wind,tr,M,W,clo) {
                         ct$assign("ta", as.array(ta))
                         ct$assign("rh", as.array(rh))
                         ct$assign("vel", as.array(wind))
                         ct$assign("tr", as.array(tr))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$assign("clo", as.array(clo))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=PMV_ISO7730(ta[i],rh[i],vel[i],tr[i],M[i],W[i],clo[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


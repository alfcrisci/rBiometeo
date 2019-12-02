#' HSI_index
#'
#' Computes the Heat Strain Index. HSI is the ratio of the demand for sweat evaporation to capacity of evaporation (Ereq on Emax). 
#' This denotes also the percent of skin wettedness, which is a good predictor of warm discomfort.
#'

#' @param t numeric    Air temperature in degC.
#' @param rh numeric   Relative humidity in percentage.
#' @param wind numeric Windspeed in meter per second.
#' @param tr numeric Mean radiant temperature in degC.
#' @param M numeric    Metabolic work in Watt per mq of the subject.
#' @param W   numeric  Mechanical work rate in Watt per mq of the subject.
#' @param clo numeric  Available basic clothing insulation in clo.
#' @param param character Index requested HSI or AET Allowable exposure time in minutes.
#' @return HSI index
#' 
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords HSI 
#' @references Belding et al 1955. Index for evaluating heat stress in terms of resulting physiological strain. Heat Pip Air Condit 27, 129 36.
#' @export
#'
HSI_index=function(t,rh,wind,tr,M,W,clo,param="HSI") {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("vel", as.array(wind))
                         ct$assign("tr", as.array(tr))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$assign("clo", as.array(clo))
                         ct$assign("param", as.array(param))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=HSI_index(ta[i],rh[i],vel[i],tr[i],M[0],W[0],clo[0],param[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


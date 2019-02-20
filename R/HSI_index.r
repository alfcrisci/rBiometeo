#' HSI_index
#'
#' Computes the Heat Strain Index. HSI is the ratio of the demand for sweat evaporation to capacity of evaporation (Ereq on Emax). 
#' This denotes also the percent of skin wettedness, which is a good predictor of warm discomfort.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity.
#' @param numeric wind Windspeed in meter per second.
#' @param numeric tr Mean radiant temperature in Celsius degrees.
#' @param numeric M Metabolic rate of subject Watt on mq.
#' @param numeric W Work rate of subject Watt on mq.
#' @param numeric clo Clothing insulation level in clo.
#' @param character param index requested HSI or AET Allowable exposure time in minutes.
#' @return HSI index
#' 
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
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


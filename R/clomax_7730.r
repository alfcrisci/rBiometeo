#' clomax_7730
#'
#' Calculate maximal clothing insulation value needed for thermal comfort in moderate thermal environments based on PMV ISO 7730.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric wind Wind speed in meter per second.
#' @param numeric tr Mean radiant temperature in Celsius degrees.
#' @param numeric M Metabolic rate of subject in Watt per mq.
#' @param character outcome Type of outcome expected. Two parameters are available "clomax" and "clomin".

#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  ocir 
#' 
#' @export
#'
#'
#'
#'

clomax_7730=function(t,rh,wind,tr,M) {
                         ct$assign("ta", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("vel", as.array(wind))
                         ct$assign("tr", as.array(tr))
                         ct$assign("M", as.array(M))
                         ct$eval("var res=[]; for(var i=0, len=outcome.length; i < len; i++){ res[i]=clomax_7730(outcome[i],ta[i],rh[i],vel[i],tr[i],M[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


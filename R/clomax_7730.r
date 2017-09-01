#' clomax_7730
#'
#' Calculate maximal clothing insulation value needed for thermal comfort in moderate thermal environments based on PMV ISO 7730.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric wind Wind speed in meter per second.
#' @param numeric tr Mean radiant temperature in Celsius degrees.
#' @param numeric M Metabolic rate of subject in Watt per mq.
#' @param numeric W Mechanical work of subject in Watt per mq. Generally 0.
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

clomax_7730=function(t,rh,wind,tr,M,W) {
                         ct$assign("ta", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("vel", as.array(wind))
                         ct$assign("tr", as.array(tr))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=clomax_7730(ta[i],rh[i],vel[i],tr[i],M[0],W[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


#' clomax_7730
#'
#' Calculate maximum clothing insulation value required to reach thermal comfort in moderate thermal environments ( -0.5 < PMV <0.5) based on PMV ISO 7730.
#'
#' @param t numeric    Air temperature in degC.
#' @param rh numeric   Air Relative humidity in percentage.
#' @param wind numeric Wind speed in meters per second.
#' @param tr numeric   Mean radiant temperature in degC.
#' @param M numeric    Metabolic rate of subject in W/mq.
#' @param W numeric    Mechanical work of subject in W/mq. Generally 0.
#' @return maximum  clothing insulation 
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' 
#' @export
#'
#'
#'
#'

clomax_7730=function(t,rh,wind,tr, M, W=0) {
                         ct$assign("ta", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("vel", as.array(wind))
                         ct$assign("tr", as.array(tr))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){res[i]=clomax_7730(ta[i],rh[i],vel[i],tr[i],M[0],W[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


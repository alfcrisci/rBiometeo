#' PMV_ISO7730
#'
#' Calculate Predicted Mean Vote (PMV) following ISO 7730.
#'
#' @param t numeric    Air temperature in degC.
#' @param rh numeric   Relative humidity in percentage.
#' @param wind numeric Windspeed in meter per second.
#' @param tr numeric Mean radiant temperature in degC.
#' @param M numeric    Metabolic work in Watt per mq of the subject.
#' @param W   numeric  Mechanical work rate in Watt per mq of the subject.
#' @param clo numeric  Available basic clothing insulation in clo.
#' @return Predicted Mean Vote
#'
#'
#' @author  Istituto per la Bioeconomia Firenze CNR Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords PMV_ISO7730 
#' 
#' @export
#'
#'
#'
#'

PMV_ISO7730=function(t,rh,wind,tr,M,W,clo) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("tr", as.array(tr))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$assign("clo", as.array(clo))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=PMV_ISO7730(t[i],rh[i],wind[i],tr[i],M[i],W[0],clo[0])};")
                         res=ct$get("res")
                         return(res)
}


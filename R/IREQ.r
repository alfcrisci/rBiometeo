#' IREQ
#'
#' Calculation of Required Clothing Insulation IREQ.
#'
#' @param t numeric    Air temperature in degC.
#' @param rh numeric   Relative humidity in percentage.
#' @param wind numeric Windspeed in meter per second.
#' @param tr numeric Mean radiant temperature in degC.
#' @param M numeric    Metabolic work in Watt per mq of the subject.
#' @param W   numeric  Mechanical work rate in Watt per mq of the subject.
#' @param clo numeric  Available basic clothing insulation in clo.
#' @param p  numeric   Air permeability of clothing ensemble lt on meters per second.
#' @param w  numeric   Walking speed in meters per second.
#' @param param  character Parameter of IREQ ISO 11079: "IREQ_neutral","IREQ_min","ICL_neutral","ICL_min","DLE_neutral","DLE_min","ICL_ISO11079"
#' @return IREQ value
#' @references ISO 11079, 2007-12-15, ERGONOMICS OF THE THERMAL ENVIRONMENT - DETERMINATION AND INTERPRETATION OF COLD STRESS WHEN USING REQUIRED CLOTHING INSULATION (IREQ) AND LOCAL COOLING EFFECTS.
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords IREQ 
#' @export 
#'
#'
#'
#'

IREQ=function(t,rh,wind,tr,M,W,clo,p,w,param="IREQ_neutral") {
                         if ( length(param)==1) {param=rep(param,length(t))}
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("v", as.array(wind))
                         ct$assign("Tr", as.array(tr))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$assign("Icl", as.array(clo))
                         ct$assign("p", as.array(p))
                         ct$assign("w", as.array(w))
                         ct$assign("param", as.array(param))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=IREQ(t[i],rh[i],v[i],Tr[i],M[i],W[i],Icl[i],p[i],w[i],param[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


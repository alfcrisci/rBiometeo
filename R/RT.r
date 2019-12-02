#' RT
#'
#' Computes the value of Required Recovery Time following scheme adopted in ISO 11079. Valid under 10 Celsius degree.
#'
#' @param t numeric    Air temperature in degC.
#' @param rh numeric   Relative humidity in percentage.
#' @param wind numeric Windspeed in meter per second.
#' @param trad numeric Mean radiant temperature in degC.
#' @param M numeric    Metabolic work in Watt per mq of the subject.
#' @param W   numeric  Mechanical work rate in Watt per mq of the subject.
#' @param clo numeric  Available basic clothing insulation in clo.
#' @param p  numeric   Air permeability of clothing ensemble lt on meters per second.
#' @param w  numeric   Walking speed in meters per second.
#' @return  Required Recovery Time
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @author  Ingvar Holmer. R adaptation Istituto di Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords Recovery Time. 
#' @references ISO 11079, 2007-12-15, ERGONOMICS OF THE THERMAL ENVIRONMENT - DETERMINATION AND INTERPRETATION OF COLD STRESS WHEN USING REQUIRED CLOTHING INSULATION (IREQ) AND LOCAL COOLING EFFECTS.
#'
#' @export
#'
#'
#'
#'

RT=function(t,rh,wind,trad,M,W,clo,p,w) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("v", as.array(wind))
                         ct$assign("Tr", as.array(trad))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$assign("Icl", as.array(clo))
                         ct$assign("p", as.array(p))
                         ct$assign("w", as.array(w))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=RT(Ta[i],rh[i],v[i],Tr[i],M[i],W[i],Icl[i],p[i],w[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


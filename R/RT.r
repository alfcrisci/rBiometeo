#' RT
#'
#' Computes the value of Required Recovery Time following scheme adopted in ISO 11079.Valid under 10 Celsius degree.
#'
#' @param numeric Ta Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param numeric v Windspeed in meter per second [m/s].
#' @param numeric tr Mean radiant temperature in Celsius degree.
#' @param numeric M Metabolic work in W/mq of the subject.
#' @param numeric W Mechanical work rate in W/mq of the subject.
#' @param numeric Icl Available basic clothing insulation [clo]
#' @param numeric p  Air permeability of clothing ensemble [lt/m2s]
#' @param numeric w  Walking speed in meter per seconds.
#' @return RT
#'
#'
#' @author  Ingvar Holmer. R adaptation Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords Recovery Time, Cold environements. 
#' @references ISO 11079, 2007-12-15, ERGONOMICS OF THE THERMAL ENVIRONMENT - DETERMINATION AND INTERPRETATION OF COLD STRESS WHEN USING REQUIRED CLOTHING INSULATION (IREQ) AND LOCAL COOLING EFFECTS.
#'
#' @export
#'
#'
#'
#'

RT=function(Ta,rh,v,Tr,M,W,Icl,p,w) {
                         ct$assign("Ta", as.array(Ta))
                         ct$assign("rh", as.array(rh))
                         ct$assign("v", as.array(v))
                         ct$assign("Tr", as.array(Tr))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$assign("Icl", as.array(Icl))
                         ct$assign("p", as.array(p))
                         ct$assign("w", as.array(w))
                         ct$eval("var res=[]; for(var i=0, len=Ta.length; i < len; i++){ res[i]=RT(Ta[i],rh[i],v[i],Tr[i],M[i],W[i],Icl[i],p[i],w[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


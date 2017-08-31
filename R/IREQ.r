#' IREQ
#'
#' Calculation of Required Clothing Insulation IREQ.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric v  Relative air velocity in meter per second.
#' @param numeric tr Mean radiant temperature in Celsius degree.
#' @param numeric M  Metabolic energy production in Watt per mq. 
#' @param numeric W Rate of mechanical work in Watt per mq. 
#' @param numeric Icl Available basic clothing insulation in clo.
#' @param numeric p  Air permeability of clothing ensemble liters on meter per second,
#' @param numeric w  Walking speed in meter per seconds.
#' @param character param  Parameter of IREQ ISO 11079: "IREQ_neutral","IREQ_min","ICL_neutral","ICL_min","DLE_neutral","DLE_min","ICL_ISO11079"
#' @return IREQ value
#' @references ISO 11079, 2007-12-15, ERGONOMICS OF THE THERMAL ENVIRONMENT - DETERMINATION AND INTERPRETATION OF COLD STRESS WHEN USING REQUIRED CLOTHING INSULATION (IREQ) AND LOCAL COOLING EFFECTS.
#' @author  Ingvar Holmer \link{http://www.eat.lth.se/fileadmin/eat/Termisk_miljoe/IREQ2009ver4_2.htm}. R adaptation Istituto di Biometeorologia Firenze Italy.  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords IREQ 
#' @export 
#'
#'
#'
#'

IREQ=function(t,rh,v,tr,M,W,Icl,p,w,param="IREQ_neutral") {
                         if ( length(param)==1) {param=rep(param,length(t))}
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("v", as.array(v))
                         ct$assign("Tr", as.array(tr))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$assign("Icl", as.array(Icl))
                         ct$assign("p", as.array(p))
                         ct$assign("w", as.array(w))
                         ct$assign("param", as.array(param))
                         ct$eval("var res=[]; for(var i=0, len=Ta.length; i < len; i++){ res[i]=IREQ(Ta[i],rh[i],v[i],Tr[i],M[i],W[i],Icl[i],p[i],w[i],param[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


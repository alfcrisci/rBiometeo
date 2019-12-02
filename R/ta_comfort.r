#' ta_comfort
#'
#' Calculate the temperature of thermal comfort requireed given other parameters and timing in hours.
#'
#' @param rh numeric    Relative humidity in percentage.
#' @param wind numeric  Wind speed in meter per second.
#' @param M numeric     Metabolic rate of the subject in Watt/mq.
#' @param iclo numeric Clothing level of subject in clo unit.
#' @param H numeric    Timimg in hours.
#' @return comfort temperature in degC
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  ta_comfort 
#' @export
#'
#'
#'
#'

ta_comfort=function(rh,wind,M,iclo,H) {
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("M", as.array(M))
                         ct$assign("iclo", as.array(iclo))
                         ct$assign("H", as.array(H))
                         ct$eval("var res=[]; for(var i=0, len=rh.length; i < len; i++){ res[i]=ta_comfort(rh[i],wind[i],M[i],iclo[i],H[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


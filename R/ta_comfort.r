#' ta_comfort
#'
#' Calculate the temperature of thermal comfort requireed given other parameters and timing in hours.
#'
#' @param numeric rh Air Relative humidity in percentage.
#' @param numeric  wind Wind speed in meter per second.
#' @param M Metabolic rate of the subject in Watt per mq.
#' @param iclo Clothing level of subject in clo unit.
#' @param H Timimg in hours.
#' @return 
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  ta_comfort 
#' @references Huizenga 
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


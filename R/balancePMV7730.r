#' balancePMV7730
#'
#' Calculate the thermal balance of the body in W/mq.
#'
#' @param pmv numeric Predicted Mean Vote Fanger following ISO 7730. 
#' @param M numeric Metabolism of the person (met).
#' @return balancePMV7730 in W/mq
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  balancePMV7730 
#' 
#' @export
#'
#'
#'
#'

balancePMV7730=function(pmv,M) {
                         ct$assign("pmv", as.array(pmv))
                         ct$assign("M", as.array(M))
                         ct$eval("var res=[]; for(var i=0, len=pmv.length; i < len; i++){ res[i]=balancePMV7730(pmv[i],M[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




#' PPD
#'
#' Predicted Percentage of Dissatisfied (PPD) predicts the percentage of occupants that will be dissatisfied with the thermal conditions. 
#'
#' @param PMV numeric Predicted Mean Vote.
#' @return Predicted Percentage of Dissatisfied
#'
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  PPD 
#' @references UNI EN ISO 7730.
#' @export
#'
#'
#'
#'

PPD=function(PMV) {
                         ct$assign("PMV", as.array(PMV))
                         ct$eval("var res=[]; for(var i=0, len=PMV.length; i < len; i++){ res[i]=PPD(PMV[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


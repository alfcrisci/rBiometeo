#' lost_productivity   
#'
#' Calculate the percentage in worker's lost productivity due to heat conditions.
#'
#' @param wbgt numeric Wetbulb globe temperature index in degC
#' @param tresh numeric treshshold for loss in degC
#'
#' @return percentage of productivity lost 
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#'
#' @keywords  Body Surface Area 
#' @export
#'
#'
#'
#'

lost_productivity=function(wbgt,tresh=33.5) {
  ct$assign("wbgt", as.array(wbgt))
  ct$assign("tresh", as.array(tresh))
  ct$eval("var res=[]; for(var i=0, len=wbgt.length; i < len; i++){ res[i]=lost_productivity(wbgt[i],tresh[0])};")
  res=ct$get("res")
  return(res)
}

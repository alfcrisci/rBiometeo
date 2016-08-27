#' balancePMV7730
#'
#' Calculate the thermal balance of the body in W/m.
#'
#' @param numeric pmv Fanger ISO 7730 Predicted Mean Vote. 
#' @param numeric M Metabolism of the person.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
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




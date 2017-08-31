#' mdi_index
#'
#' Modified discomfort index MDI 
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @return mdi_index 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  mdi_index 
#' @references Moran DS, Shitzer A, Pandolf KB ,1998, A physiological strain index to evaluate heat stress. Am J Physiol 275, R129–34.
#' @export 
#'
#'
#'
#'

mdi_index=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=mdi_index(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




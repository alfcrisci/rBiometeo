#' wbdt
#'
#' Given t air temperature (Celsius), rh relative humidity (%)  gives  Wet-bulb dry temperature (WBDT). 
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  WBDT
#' 
#' @export
#'
#'
#'
#'

wbdt=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                        ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbdt(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




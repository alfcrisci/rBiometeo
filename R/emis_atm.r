#' emis_atm
#'
#' Calculate air emissivity.
#'
#' @param numeric t Air temperature in Celsius Degrees
#' @param numeric rh Air Relative humidity in %.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  emis_atm 
#' 
#' @export
#'
#'
#'
#'

emis_atm=function(ta,rh) {
                         ct$assign("ta", as.array(ta))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=emis_atm(ta[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




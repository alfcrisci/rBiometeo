#' THI
#'
#' Given air temperature (Celsius), relative humidity (%)  gives Temperature Humidity Index discomfort. Giles (1990). Is a linearized form.
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @return Temperature Humidity Index value.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  THI,Temperature Humidity Index 
#' 
#' @export
#'
#'
#'
#'

THI=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=THI(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




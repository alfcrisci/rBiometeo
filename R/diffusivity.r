#' diffusivity
#'
#' Calculate air diffusivity.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric Pair Air pressure in Millibar [hPa] 
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  diffusivity 
#' 
#' @export
#'
#'
#'
#'

diffusivity=function(t,Pair) {
                         ct$assign("Tair", as.array(t))
                         ct$assign("Pair", as.array(Pair))
                         ct$eval("var res=[]; for(var i=0, len=Tair.length; i < len; i++){ res[i]=diffusivity(Tair[i],Pair[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




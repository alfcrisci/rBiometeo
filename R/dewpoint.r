#' dewpoint
#'
#' Computes the dewpoint temperature in Celsius degree following different schemes.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @param character formula Type of formula used for saturation pressure : "NOAA","Sonntag","Paroscientific". Default is "NOAA".
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  dewpoint 
#' 
#' @export
#'
#'
#'
#'

dewpoint=function(t,rh,formula="NOAA") {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("formula", as.array(formula))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=dewpoint(t[i],rh[i],formula[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


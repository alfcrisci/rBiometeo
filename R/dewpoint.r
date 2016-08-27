#' dewpoint
#'
#' Computes Dewpoint temperature in Celsius degree following differentschemes.
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param character formula Type of formula used for saturation pressure : "NOAA","Sonntag","Paroscientific".Default is "NOAA".
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
                         if (length(t) > 1) {formula=as.array(rep(formula,length(t)))}
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("formula", as.array(formula))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=dewpoint(t[i],rh[i],formula[i]);")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


#' dewpoint
#'
#' Computes the dewpoint temperature in degC   following different computational schemes defined by formula of saturation pressure estimation
#' ("NOAA","Sonntag","Paroscientific").
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Air Relative humidity in percentage (%).
#' @param formula character  Default is "NOAA". 
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
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
                         if ( length(formula)==1) {formula=rep(formula,length(t))}
                         ct$assign("formula", as.array(formula))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=dewpoint(t[i],rh[i],formula[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


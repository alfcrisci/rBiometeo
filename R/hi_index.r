#' hi_index
#'
#' Given air temperature (Celsius), relative humidity  gives a heat stress index in Celsius degree for primates animals. 
#'
#' @param t   numeric Air temperature in degC.
#' @param rh  numeric Relative humidity in percentage.
#' @return hi_index
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  hi_index 
#' @references Hill et al,2004, Indices of environmental temperatures for primates in open habitats. 
#' @export
#'
#'
#'
#'

hi_index=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=hi_index(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




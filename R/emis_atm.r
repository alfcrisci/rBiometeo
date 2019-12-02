#' emis_atm
#'
#' Calculate air emissivity.
#'
#' @param tk numeric Air temperature in degK.
#' @param rh numeric Relative humidity in percentage.
#' @return air emissivity 
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @keywords  emis_atm 
#' 
#' @export
#'
#'
#'
#'

emis_atm=function(tk,rh) {
                         ct$assign("t", as.array(tk))
                         ct$assign("rh", as.array(rh/100))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=emis_atm(ta[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




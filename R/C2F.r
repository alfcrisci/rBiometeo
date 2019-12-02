#' C2F
#'
#' Convert temperature from Celsius degree (degC) to Fahrenheit degree (degF).
#'
#' @param C numeric Temperature in degC.
#' @return temperature ind degK
#' 
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' 
#' @export
#'
#'
#'
#'

C2F=function(C) {
                         ct$assign("C", as.array(C))
                         ct$eval("var res=[]; for(var i=0, len=C.length; i < len; i++){ res[i]=C2F(C[i])};")
                         res=ct$get("res")
                         return(res)
}


#' ssi_index
#'
#' Calculate Summer Simmer index developed in Canada.
#'
#' @param t numeric Air temperature in Celsius degrees.
#' @param rh numeric Relative humidity in percentage.
#' @return Summer Simmer index in degC.
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  SSI
#' 
#' @export
#'
#'
#'
#'

ssi_index=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=ssi_index(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




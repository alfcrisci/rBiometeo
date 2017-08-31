#' RSI_index
#'
#' Calculates Relative strain index.
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  RSI_index 
#' @references  Lee  DHK  &  Henschel A,1963, Evaluation  of  thermal environment  in  shelters.Rep.  TR–8,  Div.  Occup.  Health,US Dept. Health, Education and Welfare.
#' @export 
#'
#'
#'
#'

RSI_index=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=RSI_index(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




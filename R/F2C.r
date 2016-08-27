#' F2C
#'
#' Convert temperature from Fahrenheit degree to  Celsius degree.
#'
#' @param numeric F Temperature in Fahrenheit degrees
#' @return umeric  Temperature in Celsius degrees.
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  F2C 
#' 
#' @export
#'
#'
#'
#'

F2C=function(F) {
                         ct$assign("F", as.array(F))
                         ct$eval("var res=[]; for(var i=0, len=F.length; i < len; i++){ res[i]=F2C(F[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


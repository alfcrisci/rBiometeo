#' discomfort_index
#'
#' Given t air temperature (Celsius), rh relative humidity gives  Discomfort index (DI). It belongs to direct indexes class.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  discomfort_index 
#' @references Thom, E.C., 1959, The discomfort index. Weather wise, 12, 57 60.
#' @export
#'
#'
#'
#'

discomfort_index=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=discomfort_index(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




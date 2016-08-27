#' thom
#'
#' Calculate Thom discomfort index by using wet bulb temperature estimation.
#'
#' @param numeric t Air temperature in Celsius degree.
#' @param numeric rh Air Relative humidity in %.
#' @return Thom index.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  thom, sultryness  discomfort index
#' @references Thom, E.C. (1959): The discomfort index. Weatherwise, 12: 57–60
#' @export
#'
#'
#'
#'

thom=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=thom(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}




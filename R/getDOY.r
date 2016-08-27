#' getDOY
#'
#' Get julian day number of date.
#'
#' @param date  Date in format YYYY-MM-DD.
#' @return numeric Julian day.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  getDOY 
#' 
#' @export
#'
#'
#'
#'

getDOY=function(datetime) {
                         ct$assign("datetime", as.array(datetime))
                         ct$eval("var res=[]; for(var i=0, len=datetime.length; i < len; i++){ res[i]=getDOY(datetime[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


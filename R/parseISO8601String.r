#' parseISO8601String
#'
#' Parse date in ISO8601 format.
#'
#' @param date  Date in format YYYY-MM-DD.String
#' @return date
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  parseISO8601String 
#' 
#' @export
#'
#'
#'
#'

parseISO8601String=function(dateString) {
                         ct$assign("dateString", as.array(dateString))
                         ct$eval("var res=[]; for(var i=0, len=dateString.length; i < len; i++){ res[i]=parseISO8601String(dateString[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


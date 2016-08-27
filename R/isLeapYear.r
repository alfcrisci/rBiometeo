#' isLeapYear
#'
#' Logical if the year indicated is a leap year.
#'
#' @param numeric yr Year
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  isLeapYear 
#' 
#' @export
#'
#'
#'
#'

isLeapYear=function(yr) {
                         ct$assign("yr", as.array(yr))
                         ct$eval("var res=[]; for(var i=0, len=yr.length; i < len; i++){ res[i]=isLeapYear(yr[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


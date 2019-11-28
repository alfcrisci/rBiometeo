#' isLeapYear
#'
#' Logical if the year indicated is a leap year.
#'
#' @param yr numeric Year.
#' @return 
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
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


#' steadman_class
#'
#' Computes the correspondent Steadman's apparent temperature class.
#'
#' @param numeric steadman_index Steadman index value.
#' @return class of apparent temperature.
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  class,  apparent temperature.
#' 
#' @export
#'
#'
#'
#'

steadman_class=function(steadman_index) {
                         res=as.numeric(cut(steadman_index, c(-100,-5,0,5,10,27,30,35,40,100),right=T,label=c(1:9)))
                         return(res)
}


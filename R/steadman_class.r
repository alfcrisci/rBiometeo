#' steadman_class
#'
#' Computes the correspondent Steadman's apparent temperature class.
#'
#' @param steadman_index numeric  Steadman index value.
#' @return class of apparent temperature.
#'
#'
#' @author    Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  class,  apparent temperature.
#' 
#' @export
#'
#'
#'
#'

steadman_class=function(steadman_index) {
                         
                         res=ifelse(is.na(steadman_index),
                                    NA,
                                    as.numeric(cut(steadman_index, c(-100,-4.99,0.01,5.01,10.01,27.01,30.01,35.01,40.01,100),right=T,label=c(1:9))))
                         return(res)
}


#' BSA
#' 
#' Calculate the Body Surface Area by using anthropometric features (height and weight).
#'
#' @param  h numeric Body height in cm.
#' @param  w numeric Body weight in kg.
#'
#' @return BSA index
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#'
#' @keywords  Body Surface Area 
#' @export
#'
#'
#'
#'

BSA=function(h,w)  {
  ct$assign("h", as.array(h))
  ct$assign("w", as.array(w))
  ct$eval("var res=[]; for(var i=0, len=h.length; i < len; i++){ res[i]=BSA(h[i],w[i])};")
  res=ct$get("res")
  return(res)
}

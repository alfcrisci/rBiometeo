#' ocir_custom
#'
#' Calculate ocir index consisting in range of clothing insulation in moderate thermal environments based on adapted PMV scheme with individuals features.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param numeric wind Wind speed in meter per seconds [m/s].
#' @param numeric tr Mean radiant temperature in Celsius degrees.
#' @param numeric mbody  mass of the body in kg.
#' @param numeric age Age of the subject in year.
#' @param numeric ht Height of subject in meter.
#' @param character gender Sex of subject. "male" or "female"-
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords ocir_custom 
#' 
#' @export
#'
#'
#'
#'

ocir_custom=function(t,rh,wind,mtrad,age,mbody,ht,gender="male") {
                         if ( length(gender)==1) {gender=rep(gender,length(t))}
                          ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("mtrad", as.array(tr))
                         ct$assign("age", as.array(age))
                         ct$assign("mbody", as.array(mbody))
                         ct$assign("ht", as.array(ht))
                         ct$assign("gender", as.array(gender))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=ocir_custom(t[i],rh[i],wind[i],mtrad[i],age[i],mbody[i],ht[i],gender[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


#' PMV_custom
#'
#'  Calculate Predicted Mean Vote (PMV) following ISO 7730 customizing some individual features.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param numeric wind Windspeed in meter per second [m/s].
#' @param numeric tr Air temperature in Celsius degrees.
#' @param numeric M Metabolic rate of subject [W/mq].
#' @param numeric W Work rate of subject [W/mq].
#' @param numeric clo Clothing insulation level in clo.
#' @param numeric age Age in years.
#' @param numeric mbody Body Mass in kg. 
#' @param numeric ht Heigth of subject in meters.
#' @param character gender Sex of the subject. Default is "male".
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords PMV_custom 
#' 
#' @export
#'
#'
#'
#'

PMV_custom=function(t,rh,wind,tr,iclo,age,mbody,ht,gender="male") {
                         if ( length(gender)==1) { gender=rep(gender,length(t)) }
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("mtrad", as.array(tr))
                         ct$assign("iclo", as.array(clo))
                         ct$assign("age", as.array(age))
                         ct$assign("mbody", as.array(mbody))
                         ct$assign("ht", as.array(ht))
                         ct$assign("gender", as.array(gender))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=PMV_custom(t[i],rh[i],wind[i],mtrad[i],iclo[i],age[i],mbody[i],ht[i],gender[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


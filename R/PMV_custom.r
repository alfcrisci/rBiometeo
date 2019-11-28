#' PMV_custom
#'
#'  Calculate Predicted Mean Vote (PMV) following ISO 7730 customizing some individual features.
#'
#' @param t numeric    Air temperature in degC.
#' @param rh numeric   Relative humidity in percentage.
#' @param wind numeric Windspeed in meter per second.
#' @param tr numeric Mean radiant temperature in degC.
#' @param M  numeric    Metabolic work in Watt per mq of the subject.
#' @param W   numeric  Mechanical work rate in Watt per mq of the subject.
#' @param clo numeric  Available basic clothing insulation in clo.
#' @param age numeric Age in years.
#' @param mbody numeric     Body Mass in kg. 
#' @param ht numeric       Heigth of subject in meters.
#' @param gender character Sex of the subject. Default is "male".
#' @return 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords PMV_custom 
#' 
#' @export
#'
#'
#'
#'

PMV_custom=function(t,rh,wind,trad,clo,age,mbody,ht,gender="male") {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("mtrad", as.array(trad))
                         ct$assign("iclo", as.array(clo))
                         ct$assign("age", as.array(age))
                         ct$assign("mbody", as.array(mbody))
                         ct$assign("ht", as.array(ht))
                         ct$assign("gender", as.array(gender))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=PMV_custom(t[i],rh[i],wind[i],mtrad[i],iclo[0],age[0],mbody[0],ht[0],gender[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}


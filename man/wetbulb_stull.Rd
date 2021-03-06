% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/wetbulb_stull.r
\name{wetbulb_stull}
\alias{wetbulb_stull}
\title{wetbulb_stull}
\usage{
wetbulb_stull(t, rh)
}
\arguments{
\item{t}{numeric      Air temperature in degC.}

\item{rh}{numeric     Relative humidity in percentage.}
}
\value{
Wet bulb temperature in degC
}
\description{
Compute natural wetbulb temperature by using Stull empirical formulation
}
\references{
Stull, R.B., 2011, Meteorology for Scientists and Engineers, 3rd Edition. 938 pages.
}
\author{
Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@ibe.cnr.it}
}
\keyword{wetbulb}
